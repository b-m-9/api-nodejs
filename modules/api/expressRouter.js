const express = require('express');
const path = require('path');
const qs = require('qs');
const router = express.Router();
const API = require('../../modules/api').API;

const config = require('../../modules/config');

const geoip = require('../../modules/geoip');
const error = require('../../modules/error/api');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const UAParser = require('ua-parser-js');

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');

let git_status = {version: '1.2.0', commitHash: '#git'};
const git = require('git-rev');
git.short((str) => {
    if (str) {
        git_status.commitHash = str;
    }
});
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Locale, jwt");
  next();
});

router.use(['/_API', '/docs/_API'], express.static(path.normalize(__dirname + '/../../_API')));
router.use(cookieParser());

if (config.get('server:session:enable') && config.get('server:session:driver') === "jwt") {
  const jwt = require("jsonwebtoken");

  router.use((req, res, next) => {
    let decoded = {};
    if (req.headers.jwt) {
      try {
        decoded = jwt.verify(req.headers.jwt, config.get('server:session:secret'), {
          algorithm: 'HS256',
        })
      } catch (e) {
        console.error('JWT error:', e.message || e);
        res.setHeader("jwt-token", "");
        res.setHeader("jwt-invalid", "1");
      }
    }
    req.session = decoded;
    req.session.destroy = function () {
      res.setHeader("jwt-token", "");
    };
    req.session.save = function () {
      delete req.session.iat;
      delete req.session.iss;
      delete req.session.exp;
      delete req.session.save;
      delete req.session.destroy;
      if (Object.keys(req.session).length) {
        const accessToken = jwt.sign(req.session, config.get('server:session:secret'), {
          algorithm: 'HS256',
          expiresIn: config.get('server:session:ttl_hours') + "h"
        })
        res.setHeader("jwt-token", accessToken);
      }
    }
    if (req.session.iat && (Date.now() - (5 * 60 * 1000)) > (req.session.iat * 1000)) { // allow resave after 5 min
      req.session.save()
    }
    next();
  });
} else if (config.get('server:session:enable')) {
    let store;
    if (config.get('server:session:driver') === 'mongodb') {
        if (!!config.get('server:api:debug')) console.log('api-nodejs-> Express use session store MongoDB');
        const MongoStore = require('connect-mongo')(session);
        let access = config.get('server:session:database:username') + ':' + config.get('server:session:database:password');
        if (access === ':') access = '';
        if (access !== '') access += '@';
        store = new MongoStore({
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: 1,
                connectTimeoutMS: 30000
            },
            url: 'mongodb://' + access + '' + config.get('server:session:database:host') + '/' + config.get('server:session:database:database'),
            stringify: false
        });
    }
    if (config.get('server:session:driver') === 'redis') {
        if (!!config.get('server:api:debug')) console.log('api-nodejs-> Express use session store Redis');
        const redis = require('redis').createClient(config.get('redis:port'), config.get('redis:host'));
        const RedisStore = require('connect-redis')(session);
        store = new RedisStore({client: redis});
    }

    if (config.get('server:session:driver') === 'local') {
        if (!!config.get('server:api:debug')) console.log('api-nodejs-> Express use session store Local');
        store = undefined
    }
    const sessionConfig = session({
        secret: config.get('server:session:secret'),
        name: config.get('server:session:name'),
        cookie: {
            maxAge: config.get('server:session:ttl_hours') * 60 * 60 * 1000, // hours
            ...(config.get('server:session:cookie') || {}),
        },
        httpOnly: true,

        resave: config.get('server:session:resave'),
        saveUninitialized: config.get('server:session:saveUninitialized'),
        store
    });
    module.exports.session = sessionConfig;
    router.use(sessionConfig);
}

router.get('/export/nodejs', (req, res) => {
    res.download(path.normalize(__dirname + '/../../_docs/postman.postman_collection'));
});
router.get('/export/insomnia', (req, res) => {
    res.download(path.normalize(__dirname + '/../../_docs/insomnia.json'));
});
router.get('/export/postman', (req, res) => {
    res.download(path.normalize(__dirname + '/../../_docs/postman.postman_collection'));
});

router.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
router.use(bodyParser.json({limit: '20mb'}));
router.use(fileUpload({
    abortOnLimit: true,
    limits: {fileSize: 200 * 1024 * 1024},
}));
router.use((req, res, next) => {
    if (req.is('multipart/form-data')) {
        req.body = qs.parse(req.body);
    }
    next();
});


router.use('/', (req, res, next) => {
    req.initTimestamp = (new Date()).getTime();
    let IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';
    IP = IP.replace('::ffff:', '');
    if (IP.split(',').length !== 1) {
        IP = IP.split(',')[0]
    }
    if (IP === '::1') IP = '127.0.0.1';
    let infoIP = (IP.indexOf(":")) ? {
      ip: IP,
      counterCode: "AA",
      counterName: "IPv6",
      success: false
    } : geoip(IP);

    if (req.session && (Object.keys(req.session) > 1 || !!req.headers.session)) {
        req.session.lastUse = new Date();
        if (!req.session.first_ip)
            req.session.first_ip = IP;
        req.session.ip = IP;
    }
    if (config.get('server:api:debug:log')) console.log('API request: \n\t\tMethod: ' + req.url+ '\n\t\tClient: ' + infoIP.ip + '/' + infoIP.counterCode);
    req.infoClient = infoIP;

    // req.infoClient.lang = req.params.lang;
    if (false === infoIP.success) {
        // res.end('{"error":"You IP error","ip":"' + IP + '","support":"support@' + config.get('domain') + '"}');
        // log.error('{express} client dont load page reason:[infoIP] : ', infoIP)
        // blocked not ip
        res.set('charset', 'utf8');
        next();
    } else {
        res.set('charset', 'utf8');
        next();
    }

});

const api_docs_public= config.get('api:docs:public');
const api_docs_user= config.get('api:docs:user');
const api_docs_admin= config.get('api:docs:admin');
const api_docs_server= config.get('api:docs:server');


router.all('/config/docs/api/', (req, res) => {
    let config_local = {
        server_path: config.get('server_path'),
        ws_url: config.get('server:ws:url'),
        version: git_status.version,
        commitHash: git_status.commitHash,
        latency_ms: (Math.random() * 100).toFixed(0),
        countQueries: (Math.random() * 1000).toFixed(0),
    };
    res.header("Content-Type", "application/json; charset=utf-8");

    let docs = API.docs;
    for (let i  in docs) {
        if (docs[i] && docs[i].param) {
            for (let p in docs[i].param) {
                if (docs[i].param[p] && docs[i].param[p].type && docs[i].param[p].type.valid) {
                    docs[i].param[p].type.validator = docs[i].param[p].type.valid.toString();
                }
            }
        }
    }
    return res.end && res.end(JSON.stringify({
        methods: docs.filter((m, i) => {
            if(!m || !m.method)
              return false;
             if(!api_docs_public && m.level === 0)
              return false;
             if(!api_docs_user && m.level === 1)
              return false;
             if(!api_docs_admin && m.level === 2)
              return false;
             if(!api_docs_server && m.level === 3)
              return false;

            return true;
        }),
        config: config_local,
        admin: true
    }));

});

router.all('/*/', (req, res) => {
    req.params.method = req.path.replace(/^\//, '').replace(/\/$/, '');
    let param = {...req.query, ...req.body};
    const checksumParams = crypto.createHash('sha256').update(JSON.stringify(param)).digest('hex');
    param.files = req.files;
    let user = {
        checksumParams,
        ip: req.infoClient,
        session: req.session,
        headers: req.headers,
        agent: new UAParser().setUA(req.headers['user-agent']).getResult()
    };
    if (!req.params.method) {
        res.sendStatus(404);
        return res.end && res.end(JSON.stringify({
            error: error.create('method not found', 'param', {method: req.params.method, code: 404}, 0),
            success: false
        }));
    }

    return API.call(req.params.method, user, param, 'http')
        .then(result => {
            if (result) {
                if (result.redirect)
                    return res.redirect(302, result.redirect);

                return result;
            }
            return {
                error: error.create('API result of null', 'api', {param: param}, 10),
                success: false
            };
        })
        .catch(err => err)
        .then(response => {
            if (response && typeof response === 'object') {
                res.header("Content-Type", "application/json; charset=utf-8");
                return res.end && res.end(JSON.stringify(response));
            }
        });
});
module.exports.router = router;
module.exports.API = API;
