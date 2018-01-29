'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var opionsSocket = {};
function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

var SocketClass = function () {
    function SocketClass(options, param) {
        _classCallCheck(this, SocketClass);

        this.options = options;
        this.socket = {};
        this.forker = {};
        this.wsOpen = false;
        this.countSocketConnect = 0;
        this.paramWS = "";
        this.deleyConnect = [500, 2000, 4000, 6000, 10000, +(Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000)];
        for (var key in param) {
            if (param.hasOwnProperty(key)) this.paramWS += "&" + key + "=" + param[key];
        }this.paramWS = this.paramWS.replace('&', "?");
        this.start();
    }

    _createClass(SocketClass, [{
        key: 'close',
        value: function close() {
            // if (this.ws.wsOpen) this.ws.close();
            console.log("клиент хочет закрыть сойденение с  сервером ");
        }
    }, {
        key: 'onopen',
        value: function onopen() {
            console.log("[WSS] Соединение установлено.");
            this.wsOpen = true;
            this.countSocketConnect = 0;
        }
    }, {
        key: 'onclose',
        value: function onclose(event) {
            this.wsOpen = false;

            setTimeout(function () {
                if (this.countSocketConnect < 5) this.countSocketConnect++;
                this.start();
            }.bind(this), this.deleyConnect[this.countSocketConnect]);
            console.log('[WSS] Обрыв соединения'); // например, "убит" процесс сервера
        }
    }, {
        key: 'onmessage',
        value: function onmessage(data) {
            try {
                var object = JSON.parse(data);
            } catch (e) {
                console.warn('[WSS] onmessage No valid JSON:\n\t', data);
            }

            console.log(object);
            if (object && object.event && this.forker.hasOwnProperty(object.event)) {
                if (object.data) {
                    this.forker[object.event].apply(null, Array.prototype.slice.call(object.data, 0));
                } else {
                    this.forker[object.event]();
                }
            } else console.warn("[WSS] Warn onEmiter(event) \n\tObject: ", object);
        }
    }, {
        key: 'start',
        value: function start() {
            this.close.bind(this)();
            this.socket = new eio.Socket(this.options);
            this.socket.on('open', this.onopen.bind(this));
            this.socket.on('message', this.onmessage.bind(this));
            this.socket.on('close', this.onclose.bind(this));
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var data = [];
            try {
                if (arguments > 1) {
                    data = arguments.splice(0, 1);
                }
                if (this.wsOpen) this.socket.send(JSON.stringify({ event: event, data: data }));
            } catch (e) {
                console.warn('[WSS] EMIT No valid JSON:,', e, '\n\t', { event: event, data: data });
            }
        }
    }, {
        key: 'on',
        value: function on(name, fn) {
            this.forker[name] = fn;
        }
    }]);

    return SocketClass;
}();

var socket = new SocketClass(opionsSocket);
socket.on('name', function (data) {
    console.error(data);
});