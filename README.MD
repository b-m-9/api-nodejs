# NodeJS Module Rest-API
### Install module
```javascript
npm i api-nodejs
```

#### Init application api-nodejs
```javascript
const api = require('api-nodejs');
const express = require('express');
const app = express();
const API = new api({}, {
    auth_user: (user) => {

        return new Promise(resolve => {
            if (user.session.auth && user.session.user_id)
                resolve({status: true, user_id: user.session.user_id});
            else
                resolve({status: false})

        });
    },
    auth_admin: (user) => {
        return new Promise(resolve => {
            resolve({status: false});
        });
    }
});

app.use('/api/v1', API.expressRouter);
```
### API File
./api/GROUP_PATH/API_file.js
```javascript
const path = require('path');
const nameGroupAPI = path.basename(__filename, '.js');
module.exports = (API, redis) => {
    API.register('example', (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param)
                return reject(API.error.create('param is not defined', 'api', {}, 1, 0));

            return resolve({example:1,param:param});

        })
        .catch(API.error.validate)
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