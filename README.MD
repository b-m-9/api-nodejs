# NodeJS Module Rest-API

### example api
```javascript
const path = require('path');
const error = require('../../modules/error/api.js');
const nameGroupAPI = path.basename(__filename, '.js');
module.exports = (API, redis) => {
    API.register('example', (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param) return reject('param is not defined');

            return resolve({...param});

        })
            .then(param => {
                return {example:1,param:param}

            })

            .catch(err => {
                // console.error(err);
                if (err.apiError) return Promise.reject(err);

                let message = 'not message';
                if (typeof err === "string") message = err;
                if (err && typeof err.message === "string") message = err.message;
                let err_obj = {param: param, err: err};
                return Promise.reject(error.api(message, 'api', err_obj, 1, 1516107602));
            })
    }, {
        title: 'EXAMPLE TITLE',
        level: 1,// 0 public,1 user,2 admin,3 server
        description: 'Example',
        group:nameGroupAPI,
        param: [
           {
                name: 'test',
                type: "int",
                title: 'example param',
                necessarily: true
            }
        ],
        response: [
            {
                name: 'data.example',
                type: "string",
                title: 'example res',
                default: '1'
            }
        ]
    });
};
```