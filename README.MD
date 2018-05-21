# NodeJS Module Rest-API
API-NodeJS - это минималистичный и гибкий фреймворк
 предоставляющий обширный набор функций для построения REST-API на Node.js.

Имеет в своем распоряжении множество служебных методов и 
промежуточных обработчиков,
для создания надежного професионального сервера быстро и легко.

Данный модуль предоставлет веб панель для просмотра, 
тестирование и анализа методов API.

### Install module
```javascript
npm i api-nodejs
```

#### Quick start
```javascript
const express = require('express');
const app = express();

const RestAPI = require('api-nodejs');
const restapi = new RestAPI({}, {
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
             if (user.session.auth && user.session.user_id&& user.session.admin ===1)
                 resolve({status: true, user_id: user.session.user_id});
             else
                 resolve({status: false})
        });
    }
});

app.use('/api/v1', restapi.expressRouter);
```
- нужно описать основные принципы работы 
- описать что такое функции auth_user auth_admin
- описать как создается  конфигурационый файл
- описать что такое api express router
- описать файл конфигураций что значит каждый из параметров в нем 


### API Types and validate
----
                 
```
API.types.STRING(lenght,options)
```               
```
API.types.FLOAT(10,2,options)
```          
```
API.types.DATE()
```        
```
API.types.INTEGER(10,options)
```
- options.regexp = 'STRING_REGEXP'
- нужно описать  что такое типы как они работают какие опыции они принимают
- описать каждый из типов 
- описать как работает ответ ошибок 
- как принимают regexp
- описать как написать свой тип данных


### API File
./api/GROUP_PATH/API_file.js
```javascript
const path = require('path');
const nameGroupAPI = path.basename(__filename, '.js');
module.exports = (API, redis) => {
    API.register('test', (user, param) => {
        return new Promise((resolve, reject) => {
            if (!param) return reject('param is not defined');
            return resolve({example: 1, param: param})
        })
            .catch(API.error.validate)
    }, {
        title: 'Test API',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: 'Example API',
        group: nameGroupAPI,
        param: {
            test:{
                type: API.types.STRING(10),
                error_code:12345678,
                title: 'example param',
                required: true
            }
        },
        response: [{
            name: 'data.example',
            type: "string",
            title: 'example res',
            default: '1'
        }]
    });
};
```

- если еррор кода нет то вернет код 500400404 если параметр не пройдет валидацию или будет не найден
- нужно описать как создать файл апи  
- как регестрировать метод 
- что значит имя  метода
- что метод должен вернуть  какие параметры они приймет
- описать doc 
- что такое lvl
- не забыть упомянуть про hide
- что такое параметр  
- что такое  ответ 


After starting the application, the ./api/ and ./config/ folder will be created.
- ./api/ - directory with API
- ./config/api_config.json - configuration file
 