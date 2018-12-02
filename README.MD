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


API Types and validate
----
- ##### String:
```
/**
* @param {string} options.regexp - STRING REGEXP (optional)
*/
API.types.STRING(lenght,options)
```               
- ##### Number:
```
/**
*      ┌──────────────── fixed (3)
*  13.556 ───────── length (5)

* @param {string} options.regexp - STRING REGEXP (optional)
*/
API.types.FLOAT(length,fixed,options) //float number
API.types.INTEGER(length,options) // integer
```          
- ##### Date:
```
/**
* @param {number} options.zone_utc - Convert to ZONE (example 0 = UTC) (optional)
*/
API.types.DATE(options)
```
          
- ##### Enum:
```
API.types.ENUM(...values) 
// example API.types.ENUM('active','pending','deleted') 
```
      
- ##### Boolean:
```
API.types.BOOLEAN()
```
   
- ##### Object:
```
API.types.OBJECT()
```
   
- ##### Array:
```
API.types.ARRAY()
```
 
- ##### FILE:  (validator soon)
```
API.types.FILE()
```

#### Own type
You can also create your own type. 
for this you need to add the file to the ```PROJECT_ROOT/api_plugins``` folder
###### Example
```
// PROJECT_ROOT/api_plugins/object-id-type.js

const mongoose = require('mongoose');

module.exports = (API) => {

    class _ObjectId {
        constructor(len, options) {
            this.name = 'ObjectID';

        }

        valid(v) {
            if (!v || v === '' || typeof v !== 'string' || !mongoose.Types.ObjectId.isValid(v))
                return {
                    success: false,
                    error: 'Value is not ObjectId'
                };
            return {success: true, value: v};
        }
    }

    API.types.ObjectId = () => {
        return new _ObjectId();
    };
};

//Example use type 
API.types.ObjectId()
```



### API File example
./api/GROUP_PATH/API_file.js
```javascript
module.exports = (API, redis) => {
    // method api/v1/GROUP_PATH/API_file/test
    API.register('test', async (user, param) => {
       return {ok:1};
    }, {
        title: 'Test API',
        level: 0,// 0 public,1 user,2 admin,3 server
        description: 'This method for test and learn api. =)',
        group: "Testing API",
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
Каждый register должен содержать function c return Promise  важно чтоб каждый метод в результате выполненея возвращял промис
Как генерируется имя метода? 
api/v1/ + путь к файлу с методом + (1 параметр из register если он является строкой) 
таким образом мы получаем 
api/v1/папка1/папка2/файл/test 
##### Обработка ошибок 
Ошибки имеют строгую структуру все ответы апи возвращяют ответ в виде JSON:
###### Пример error response:

       {
         "success": false,
         "error": {
           "apiError": true,
           "message": "Page not found",
           "errorType": "api",
           "object": {
             
           },
           "level": 0,
           "errorCode": 4041543664702404,
           "stack": "Object.API.register [as fn] (./path/api/file.js:444:52)"
         },
         "latency_ms": 4,
         "requestId": "1543748408108-wirUSou"
       }
       
Часто нам необходимо описовать свои ошибки в методах для того чтоб наш клиент понимал что пошло не так в API встроена удобная и гибкая система содание ошибок:
###### Генерирование ошибок в методах:
Вам достаточно будет использовать данный код в своем методе: (метод сразу вернет ***Promise.reject***)
```
    return API.error.response("Error message example",55511111) 
    
```
данный способ подойтет в большенстве случаев он принимает 3 параметра (message,errorcode,params) параметры не обезательный но если ваш метод должен вернуть чтото дополнительно вы можете  его использовать.

Более гибкий способ описание ошибок:
```
    return Promise.reject(
        API.error.create("Error message example",'api',{},10,55511111,500)
    )
```
Данный метод принимает параметры тип и уровенть ошибки , а также statusCode с которым будет возращен запрос
параметры данного метода (message, type, params, level, errorCode, statusCode) 
***Будте внимательны так как данный метод не возвращяет в себе reject он создает только нужный обект для его возврата API вам необходимо вернуть ответ его в Promise.reject()***


##### Каждый метод имеет документацию в которой 
- title - заголовок метода 
- level - уровень доступа к методу

      0 - публичный метод авторизация не требуется 
      
      1 - пользовательский метод перед вызовом будет вызвана 
          функция auth_user которая должна вернуть status: true
          если юзер авторизован а также может вернуть дополнитлеьно user_id 
          для того чтоб в методе был  параметр  auth.user.user_id
          
      2 - Админский метод аналогично как и юзерский 
          функция проверок auth_admin
          
      3 - Серверный метод может быть вызван только на севрере 
          (к примеру в других методах) API.call($method,$user,$params,'server')
          
- description - описание метода (подробности предупреждениея и другая информация по методу)
- group - группа метода (категория к кому относится метод для документации чтоб удобно оформить документацию)
- hide - не показывать данный метод в списке (документации) (секретный метод) (optional)
- param - параметры 
    
        paramName: {
            type: API.types.STRING(10), // тип параметра
            error_code:12345678, // код ошибки в если параметр прийдет не валидный
            title: 'example param', // описание 
            required: true // обезательный 
        }
        
        // параметры также может быть массивом
        paramArray: [{
             type: API.types.STRING(10), // тип параметра
             error_code:12345678, // код ошибки в если параметр прийдет не валидный
             title: 'example param', // описание 
             required: true // обезательный 
        }] 
        // в данном случаи будет проверен каждый елемент массива на сотвествие типа
           и если стоит required то массив должен иметь хотябы один елемент
           
        // параметр также может быть массивом с обектами 
           данном случаи будет проверено весь массив с нужными обектами 
           
            paramArray: [{param1:{type...},param2:{type...}}
- response - массив  в котором описуется что вернет метод


на основе этой документации все параметры будут валидироватся и уровни доступы  до того как будет вызван сам параметр
если в методе произойдет синтаксическая ошибка метод вернет код 500 с указанием ошибки



After starting the application, the ./api/ and ./config/ folder will be created.
- ./api/ - directory with API
- ./config/api_config.json - configuration file


конфиграционый файл  создается при первом запуске правильная конфигурация влият на работу  апи 
все параметры имееют логиченые название  вы можете ознакомится с ним самостоятельно
 