/**
 * Created by bogdanmedvedev on 11.07.16.
 */
'use strict';

const opionsSocket = {};
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
class SocketClass {

    constructor(options, param) {
        this.options = options;
        this.socket = {};
        this.forker = {};
        this.wsOpen = false;
        this.countSocketConnect = 0;
        this.paramWS = "";
        this.deleyConnect = [500, 2000, 4000, 6000, 10000, +(Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000 )];
        for (var key in param) if (param.hasOwnProperty(key)) this.paramWS += "&" + key + "=" + param[key];
        this.paramWS = this.paramWS.replace('&', "?");
        this.start();
    }

    close() {
        // if (this.ws.wsOpen) this.ws.close();
        console.log("клиент хочет закрыть сойденение с  сервером " );
    }

    onopen() {
        console.log("[WSS] Соединение установлено.");
        this.wsOpen = true;
        this.countSocketConnect = 0;
    }

    onclose(event) {
        this.wsOpen = false;


        setTimeout((function () {
            if (this.countSocketConnect < 5)
                this.countSocketConnect++;
            this.start()
        }).bind(this), this.deleyConnect[this.countSocketConnect]);
        console.log('[WSS] Обрыв соединения'); // например, "убит" процесс сервера

    }

    onmessage(data) {
        try {
            var object = JSON.parse(data);
        } catch (e) {
            console.warn('[WSS] onmessage No valid JSON:\n\t',data);

        }

        console.log(object);
        if (object && object.event && this.forker.hasOwnProperty(object.event)) {
            if (object.data) {
                this.forker[object.event].apply(null, Array.prototype.slice.call(object.data, 0));
            } else {
                this.forker[object.event]();
            }
        } else console.warn("[WSS] Warn onEmiter(event) \n\tObject: ", object)
    }

    start() {
        this.close.bind(this)();
        this.socket = new eio.Socket(this.options);
        this.socket.on('open', this.onopen.bind(this));
        this.socket.on('message', this.onmessage.bind(this));
        this.socket.on('close', this.onclose.bind(this));

    }

    emit(event) {
        var data = [];
        try {
            if(arguments>1){
                data = arguments.splice(0,1);
            }
            if (this.wsOpen)
                this.socket.send(JSON.stringify({event: event, data: data}));
        } catch (e) {
            console.warn('[WSS] EMIT No valid JSON:,', e, '\n\t', {event: event, data: data});
        }
    }

    on(name, fn) {
        this.forker[name] = fn;
    }
}

var socket = new SocketClass(opionsSocket);
socket.on('name', (data)=> {
    console.error(data);
});