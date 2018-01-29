jQuery(document).ready(function ($) {
    $(function () {

        $('select, input').styler();

    });

    $('.list-code > li').each(function (index, el) {
        $(el).prepend('<span>' + ++index + '</span>')
    });
});

/*!
 * jQuery Form Plugin
 * version: 4.2.2
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/jquery-form/form

 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup

 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license

 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */
!function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = function (t, r) {
        return void 0 === r && (r = "undefined" != typeof window ? require("jquery") : require("jquery")(t)), e(r), r
    } : e(jQuery)
}(function (e) {
    "use strict";

    function t(t) {
        var r = t.data;
        t.isDefaultPrevented() || (t.preventDefault(), e(t.target).closest("form").ajaxSubmit(r))
    }

    function r(t) {
        var r = t.target, a = e(r);
        if (!a.is("[type=submit],[type=image]")) {
            var n = a.closest("[type=submit]");
            if (0 === n.length) return;
            r = n[0]
        }
        var i = r.form;
        if (i.clk = r, "image" === r.type) if (void 0 !== t.offsetX) i.clk_x = t.offsetX, i.clk_y = t.offsetY; else if ("function" == typeof e.fn.offset) {
            var o = a.offset();
            i.clk_x = t.pageX - o.left, i.clk_y = t.pageY - o.top
        } else i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop;
        setTimeout(function () {
            i.clk = i.clk_x = i.clk_y = null
        }, 100)
    }

    function a() {
        if (e.fn.ajaxSubmit.debug) {
            var t = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t)
        }
    }

    var n = /\r?\n/g, i = {};
    i.fileapi = void 0 !== e('<input type="file">').get(0).files, i.formdata = void 0 !== window.FormData;
    var o = !!e.fn.prop;
    e.fn.attr2 = function () {
        if (!o) return this.attr.apply(this, arguments);
        var e = this.prop.apply(this, arguments);
        return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments)
    }, e.fn.ajaxSubmit = function (t, r, n, s) {
        function u(r) {
            var a, n, i = e.param(r, t.traditional).split("&"), o = i.length, s = [];
            for (a = 0; a < o; a++) i[a] = i[a].replace(/\+/g, " "), n = i[a].split("="), s.push([decodeURIComponent(n[0]), decodeURIComponent(n[1])]);
            return s
        }

        function c(r) {
            function n(e) {
                var t = null;
                try {
                    e.contentWindow && (t = e.contentWindow.document)
                } catch (e) {
                    a("cannot get iframe.contentWindow document: " + e)
                }
                if (t) return t;
                try {
                    t = e.contentDocument ? e.contentDocument : e.document
                } catch (r) {
                    a("cannot get iframe.contentDocument: " + r), t = e.document
                }
                return t
            }

            function i() {
                function t() {
                    try {
                        var e = n(v).readyState;
                        a("state = " + e), e && "uninitialized" === e.toLowerCase() && setTimeout(t, 50)
                    } catch (e) {
                        a("Server abort: ", e, " (", e.name, ")"), s(L), j && clearTimeout(j), j = void 0
                    }
                }

                var r = p.attr2("target"), i = p.attr2("action"),
                    o = p.attr("enctype") || p.attr("encoding") || "multipart/form-data";
                w.setAttribute("target", m), l && !/post/i.test(l) || w.setAttribute("method", "POST"), i !== f.url && w.setAttribute("action", f.url), f.skipEncodingOverride || l && !/post/i.test(l) || p.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                }), f.timeout && (j = setTimeout(function () {
                    T = !0, s(A)
                }, f.timeout));
                var u = [];
                try {
                    if (f.extraData) for (var c in f.extraData) f.extraData.hasOwnProperty(c) && (e.isPlainObject(f.extraData[c]) && f.extraData[c].hasOwnProperty("name") && f.extraData[c].hasOwnProperty("value") ? u.push(e('<input type="hidden" name="' + f.extraData[c].name + '">', k).val(f.extraData[c].value).appendTo(w)[0]) : u.push(e('<input type="hidden" name="' + c + '">', k).val(f.extraData[c]).appendTo(w)[0]));
                    f.iframeTarget || h.appendTo(D), v.attachEvent ? v.attachEvent("onload", s) : v.addEventListener("load", s, !1), setTimeout(t, 15);
                    try {
                        w.submit()
                    } catch (e) {
                        document.createElement("form").submit.apply(w)
                    }
                } finally {
                    w.setAttribute("action", i), w.setAttribute("enctype", o), r ? w.setAttribute("target", r) : p.removeAttr("target"), e(u).remove()
                }
            }

            function s(t) {
                if (!x.aborted && !X) {
                    if ((O = n(v)) || (a("cannot access response document"), t = L), t === A && x) return x.abort("timeout"), void S.reject(x, "timeout");
                    if (t === L && x) return x.abort("server abort"), void S.reject(x, "error", "server abort");
                    if (O && O.location.href !== f.iframeSrc || T) {
                        v.detachEvent ? v.detachEvent("onload", s) : v.removeEventListener("load", s, !1);
                        var r, i = "success";
                        try {
                            if (T) throw"timeout";
                            var o = "xml" === f.dataType || O.XMLDocument || e.isXMLDoc(O);
                            if (a("isXml=" + o), !o && window.opera && (null === O.body || !O.body.innerHTML) && --C) return a("requeing onLoad callback, DOM not available"), void setTimeout(s, 250);
                            var u = O.body ? O.body : O.documentElement;
                            x.responseText = u ? u.innerHTML : null, x.responseXML = O.XMLDocument ? O.XMLDocument : O, o && (f.dataType = "xml"), x.getResponseHeader = function (e) {
                                return {"content-type": f.dataType}[e.toLowerCase()]
                            }, u && (x.status = Number(u.getAttribute("status")) || x.status, x.statusText = u.getAttribute("statusText") || x.statusText);
                            var c = (f.dataType || "").toLowerCase(), l = /(json|script|text)/.test(c);
                            if (l || f.textarea) {
                                var p = O.getElementsByTagName("textarea")[0];
                                if (p) x.responseText = p.value, x.status = Number(p.getAttribute("status")) || x.status, x.statusText = p.getAttribute("statusText") || x.statusText; else if (l) {
                                    var m = O.getElementsByTagName("pre")[0], g = O.getElementsByTagName("body")[0];
                                    m ? x.responseText = m.textContent ? m.textContent : m.innerText : g && (x.responseText = g.textContent ? g.textContent : g.innerText)
                                }
                            } else "xml" === c && !x.responseXML && x.responseText && (x.responseXML = q(x.responseText));
                            try {
                                M = N(x, c, f)
                            } catch (e) {
                                i = "parsererror", x.error = r = e || i
                            }
                        } catch (e) {
                            a("error caught: ", e), i = "error", x.error = r = e || i
                        }
                        x.aborted && (a("upload aborted"), i = null), x.status && (i = x.status >= 200 && x.status < 300 || 304 === x.status ? "success" : "error"), "success" === i ? (f.success && f.success.call(f.context, M, "success", x), S.resolve(x.responseText, "success", x), d && e.event.trigger("ajaxSuccess", [x, f])) : i && (void 0 === r && (r = x.statusText), f.error && f.error.call(f.context, x, i, r), S.reject(x, "error", r), d && e.event.trigger("ajaxError", [x, f, r])), d && e.event.trigger("ajaxComplete", [x, f]), d && !--e.active && e.event.trigger("ajaxStop"), f.complete && f.complete.call(f.context, x, i), X = !0, f.timeout && clearTimeout(j), setTimeout(function () {
                            f.iframeTarget ? h.attr("src", f.iframeSrc) : h.remove(), x.responseXML = null
                        }, 100)
                    }
                }
            }

            var u, c, f, d, m, h, v, x, y, b, T, j, w = p[0], S = e.Deferred();
            if (S.abort = function (e) {
                    x.abort(e)
                }, r) for (c = 0; c < g.length; c++) u = e(g[c]), o ? u.prop("disabled", !1) : u.removeAttr("disabled");
            (f = e.extend(!0, {}, e.ajaxSettings, t)).context = f.context || f, m = "jqFormIO" + (new Date).getTime();
            var k = w.ownerDocument, D = p.closest("body");
            if (f.iframeTarget ? (b = (h = e(f.iframeTarget, k)).attr2("name")) ? m = b : h.attr2("name", m) : (h = e('<iframe name="' + m + '" src="' + f.iframeSrc + '" />', k)).css({
                    position: "absolute",
                    top: "-1000px",
                    left: "-1000px"
                }), v = h[0], x = {
                    aborted: 0,
                    responseText: null,
                    responseXML: null,
                    status: 0,
                    statusText: "n/a",
                    getAllResponseHeaders: function () {
                    },
                    getResponseHeader: function () {
                    },
                    setRequestHeader: function () {
                    },
                    abort: function (t) {
                        var r = "timeout" === t ? "timeout" : "aborted";
                        a("aborting upload... " + r), this.aborted = 1;
                        try {
                            v.contentWindow.document.execCommand && v.contentWindow.document.execCommand("Stop")
                        } catch (e) {
                        }
                        h.attr("src", f.iframeSrc), x.error = r, f.error && f.error.call(f.context, x, r, t), d && e.event.trigger("ajaxError", [x, f, r]), f.complete && f.complete.call(f.context, x, r)
                    }
                }, (d = f.global) && 0 == e.active++ && e.event.trigger("ajaxStart"), d && e.event.trigger("ajaxSend", [x, f]), f.beforeSend && !1 === f.beforeSend.call(f.context, x, f)) return f.global && e.active--, S.reject(), S;
            if (x.aborted) return S.reject(), S;
            (y = w.clk) && (b = y.name) && !y.disabled && (f.extraData = f.extraData || {}, f.extraData[b] = y.value, "image" === y.type && (f.extraData[b + ".x"] = w.clk_x, f.extraData[b + ".y"] = w.clk_y));
            var A = 1, L = 2, F = e("meta[name=csrf-token]").attr("content"),
                E = e("meta[name=csrf-param]").attr("content");
            E && F && (f.extraData = f.extraData || {}, f.extraData[E] = F), f.forceSync ? i() : setTimeout(i, 10);
            var M, O, X, C = 50, q = e.parseXML || function (e, t) {
                return window.ActiveXObject ? ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" !== t.documentElement.nodeName ? t : null
            }, _ = e.parseJSON || function (e) {
                return window.eval("(" + e + ")")
            }, N = function (t, r, a) {
                var n = t.getResponseHeader("content-type") || "", i = ("xml" === r || !r) && n.indexOf("xml") >= 0,
                    o = i ? t.responseXML : t.responseText;
                return i && "parsererror" === o.documentElement.nodeName && e.error && e.error("parsererror"), a && a.dataFilter && (o = a.dataFilter(o, r)), "string" == typeof o && (("json" === r || !r) && n.indexOf("json") >= 0 ? o = _(o) : ("script" === r || !r) && n.indexOf("javascript") >= 0 && e.globalEval(o)), o
            };
            return S
        }

        if (!this.length) return a("ajaxSubmit: skipping submit process - no element selected"), this;
        var l, f, d, p = this;
        "function" == typeof t ? t = {success: t} : "string" == typeof t || !1 === t && arguments.length > 0 ? (t = {
            url: t,
            data: r,
            dataType: n
        }, "function" == typeof s && (t.success = s)) : void 0 === t && (t = {}), l = t.method || t.type || this.attr2("method"), (d = (d = "string" == typeof(f = t.url || this.attr2("action")) ? e.trim(f) : "") || window.location.href || "") && (d = (d.match(/^([^#]+)/) || [])[1]), t = e.extend(!0, {
            url: d,
            success: e.ajaxSettings.success,
            type: l || e.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, t);
        var m = {};
        if (this.trigger("form-pre-serialize", [this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
        if (t.beforeSerialize && !1 === t.beforeSerialize(this, t)) return a("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
        var h = t.traditional;
        void 0 === h && (h = e.ajaxSettings.traditional);
        var v, g = [], x = this.formToArray(t.semantic, g, t.filtering);
        if (t.data) {
            var y = e.isFunction(t.data) ? t.data(x) : t.data;
            t.extraData = y, v = e.param(y, h)
        }
        if (t.beforeSubmit && !1 === t.beforeSubmit(x, this, t)) return a("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
        if (this.trigger("form-submit-validate", [x, this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
        var b = e.param(x, h);
        v && (b = b ? b + "&" + v : v), "GET" === t.type.toUpperCase() ? (t.url += (t.url.indexOf("?") >= 0 ? "&" : "?") + b, t.data = null) : t.data = b;
        var T = [];
        if (t.resetForm && T.push(function () {
                p.resetForm()
            }), t.clearForm && T.push(function () {
                p.clearForm(t.includeHidden)
            }), !t.dataType && t.target) {
            var j = t.success || function () {
            };
            T.push(function (r, a, n) {
                var i = arguments, o = t.replaceTarget ? "replaceWith" : "html";
                e(t.target)[o](r).each(function () {
                    j.apply(this, i)
                })
            })
        } else t.success && (e.isArray(t.success) ? e.merge(T, t.success) : T.push(t.success));
        if (t.success = function (e, r, a) {
                for (var n = t.context || this, i = 0, o = T.length; i < o; i++) T[i].apply(n, [e, r, a || p, p])
            }, t.error) {
            var w = t.error;
            t.error = function (e, r, a) {
                var n = t.context || this;
                w.apply(n, [e, r, a, p])
            }
        }
        if (t.complete) {
            var S = t.complete;
            t.complete = function (e, r) {
                var a = t.context || this;
                S.apply(a, [e, r, p])
            }
        }
        var k = e("input[type=file]:enabled", this).filter(function () {
                return "" !== e(this).val()
            }).length > 0, D = "multipart/form-data", A = p.attr("enctype") === D || p.attr("encoding") === D,
            L = i.fileapi && i.formdata;
        a("fileAPI :" + L);
        var F, E = (k || A) && !L;
        !1 !== t.iframe && (t.iframe || E) ? t.closeKeepAlive ? e.get(t.closeKeepAlive, function () {
            F = c(x)
        }) : F = c(x) : F = (k || A) && L ? function (r) {
            for (var a = new FormData, n = 0; n < r.length; n++) a.append(r[n].name, r[n].value);
            if (t.extraData) {
                var i = u(t.extraData);
                for (n = 0; n < i.length; n++) i[n] && a.append(i[n][0], i[n][1])
            }
            t.data = null;
            var o = e.extend(!0, {}, e.ajaxSettings, t, {
                contentType: !1,
                processData: !1,
                cache: !1,
                type: l || "POST"
            });
            t.uploadProgress && (o.xhr = function () {
                var r = e.ajaxSettings.xhr();
                return r.upload && r.upload.addEventListener("progress", function (e) {
                    var r = 0, a = e.loaded || e.position, n = e.total;
                    e.lengthComputable && (r = Math.ceil(a / n * 100)), t.uploadProgress(e, a, n, r)
                }, !1), r
            }), o.data = null;
            var s = o.beforeSend;
            return o.beforeSend = function (e, r) {
                t.formData ? r.data = t.formData : r.data = a, s && s.call(this, e, r)
            }, e.ajax(o)
        }(x) : e.ajax(t), p.removeData("jqxhr").data("jqxhr", F);
        for (var M = 0; M < g.length; M++) g[M] = null;
        return this.trigger("form-submit-notify", [this, t]), this
    }, e.fn.ajaxForm = function (n, i, o, s) {
        if (("string" == typeof n || !1 === n && arguments.length > 0) && (n = {
                url: n,
                data: i,
                dataType: o
            }, "function" == typeof s && (n.success = s)), n = n || {}, n.delegation = n.delegation && e.isFunction(e.fn.on), !n.delegation && 0 === this.length) {
            var u = {s: this.selector, c: this.context};
            return !e.isReady && u.s ? (a("DOM not ready, queuing ajaxForm"), e(function () {
                e(u.s, u.c).ajaxForm(n)
            }), this) : (a("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this)
        }
        return n.delegation ? (e(document).off("submit.form-plugin", this.selector, t).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, n, t).on("click.form-plugin", this.selector, n, r), this) : this.ajaxFormUnbind().on("submit.form-plugin", n, t).on("click.form-plugin", n, r)
    }, e.fn.ajaxFormUnbind = function () {
        return this.off("submit.form-plugin click.form-plugin")
    }, e.fn.formToArray = function (t, r, a) {
        var n = [];
        if (0 === this.length) return n;
        var o, s = this[0], u = this.attr("id"),
            c = t || void 0 === s.elements ? s.getElementsByTagName("*") : s.elements;
        if (c && (c = e.makeArray(c)), u && (t || /(Edge|Trident)\//.test(navigator.userAgent)) && (o = e(':input[form="' + u + '"]').get()).length && (c = (c || []).concat(o)), !c || !c.length) return n;
        e.isFunction(a) && (c = e.map(c, a));
        var l, f, d, p, m, h, v;
        for (l = 0, h = c.length; l < h; l++) if (m = c[l], (d = m.name) && !m.disabled) if (t && s.clk && "image" === m.type) s.clk === m && (n.push({
            name: d,
            value: e(m).val(),
            type: m.type
        }), n.push({name: d + ".x", value: s.clk_x}, {
            name: d + ".y",
            value: s.clk_y
        })); else if ((p = e.fieldValue(m, !0)) && p.constructor === Array) for (r && r.push(m), f = 0, v = p.length; f < v; f++) n.push({
            name: d,
            value: p[f]
        }); else if (i.fileapi && "file" === m.type) {
            r && r.push(m);
            var g = m.files;
            if (g.length) for (f = 0; f < g.length; f++) n.push({
                name: d,
                value: g[f],
                type: m.type
            }); else n.push({name: d, value: "", type: m.type})
        } else null !== p && void 0 !== p && (r && r.push(m), n.push({
            name: d,
            value: p,
            type: m.type,
            required: m.required
        }));
        if (!t && s.clk) {
            var x = e(s.clk), y = x[0];
            (d = y.name) && !y.disabled && "image" === y.type && (n.push({
                name: d,
                value: x.val()
            }), n.push({name: d + ".x", value: s.clk_x}, {name: d + ".y", value: s.clk_y}))
        }
        return n
    }, e.fn.formSerialize = function (t) {
        return e.param(this.formToArray(t))
    }, e.fn.fieldSerialize = function (t) {
        var r = [];
        return this.each(function () {
            var a = this.name;
            if (a) {
                var n = e.fieldValue(this, t);
                if (n && n.constructor === Array) for (var i = 0, o = n.length; i < o; i++) r.push({
                    name: a,
                    value: n[i]
                }); else null !== n && void 0 !== n && r.push({name: this.name, value: n})
            }
        }), e.param(r)
    }, e.fn.fieldValue = function (t) {
        for (var r = [], a = 0, n = this.length; a < n; a++) {
            var i = this[a], o = e.fieldValue(i, t);
            null === o || void 0 === o || o.constructor === Array && !o.length || (o.constructor === Array ? e.merge(r, o) : r.push(o))
        }
        return r
    }, e.fieldValue = function (t, r) {
        var a = t.name, i = t.type, o = t.tagName.toLowerCase();
        if (void 0 === r && (r = !0), r && (!a || t.disabled || "reset" === i || "button" === i || ("checkbox" === i || "radio" === i) && !t.checked || ("submit" === i || "image" === i) && t.form && t.form.clk !== t || "select" === o && -1 === t.selectedIndex)) return null;
        if ("select" === o) {
            var s = t.selectedIndex;
            if (s < 0) return null;
            for (var u = [], c = t.options, l = "select-one" === i, f = l ? s + 1 : c.length, d = l ? s : 0; d < f; d++) {
                var p = c[d];
                if (p.selected && !p.disabled) {
                    var m = p.value;
                    if (m || (m = p.attributes && p.attributes.value && !p.attributes.value.specified ? p.text : p.value), l) return m;
                    u.push(m)
                }
            }
            return u
        }
        return e(t).val().replace(n, "\r\n")
    }, e.fn.clearForm = function (t) {
        return this.each(function () {
            e("input,select,textarea", this).clearFields(t)
        })
    }, e.fn.clearFields = e.fn.clearInputs = function (t) {
        var r = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var a = this.type, n = this.tagName.toLowerCase();
            r.test(a) || "textarea" === n ? this.value = "" : "checkbox" === a || "radio" === a ? this.checked = !1 : "select" === n ? this.selectedIndex = -1 : "file" === a ? /MSIE/.test(navigator.userAgent) ? e(this).replaceWith(e(this).clone(!0)) : e(this).val("") : t && (!0 === t && /hidden/.test(a) || "string" == typeof t && e(this).is(t)) && (this.value = "")
        })
    }, e.fn.resetForm = function () {
        return this.each(function () {
            var t = e(this), r = this.tagName.toLowerCase();
            switch (r) {
                case"input":
                    this.checked = this.defaultChecked;
                case"textarea":
                    return this.value = this.defaultValue, !0;
                case"option":
                case"optgroup":
                    var a = t.parents("select");
                    return a.length && a[0].multiple ? "option" === r ? this.selected = this.defaultSelected : t.find("option").resetForm() : a.resetForm(), !0;
                case"select":
                    return t.find("option").each(function (e) {
                        if (this.selected = this.defaultSelected, this.defaultSelected && !t[0].multiple) return t[0].selectedIndex = e, !1
                    }), !0;
                case"label":
                    var n = e(t.attr("for")), i = t.find("input,select,textarea");
                    return n[0] && i.unshift(n[0]), i.resetForm(), !0;
                case"form":
                    return ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset(), !0;
                default:
                    return t.find("form,input,label,select,textarea").resetForm(), !0
            }
        })
    }, e.fn.enable = function (e) {
        return void 0 === e && (e = !0), this.each(function () {
            this.disabled = !e
        })
    }, e.fn.selected = function (t) {
        return void 0 === t && (t = !0), this.each(function () {
            var r = this.type;
            if ("checkbox" === r || "radio" === r) this.checked = t; else if ("option" === this.tagName.toLowerCase()) {
                var a = e(this).parent("select");
                t && a[0] && "select-one" === a[0].type && a.find("option").selected(!1), this.selected = t
            }
        })
    }, e.fn.ajaxSubmit.debug = !1
});
//# sourceMappingURL=jquery.form.min.js.map


/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// identity function for calling harmony imports with the correct context
    /******/
    __webpack_require__.i = function (value) {
        return value;
    };
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 1);
    /******/
})
/************************************************************************/
/******/([
    /* 0 */
    /***/ (function (module, exports) {

        module.exports = function (modules) {
            function __webpack_require__(moduleId) {
                if (installedModules[moduleId]) return installedModules[moduleId].exports;
                var module = installedModules[moduleId] = {
                    i: moduleId,
                    l: !1,
                    exports: {}
                };
                return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
                    module.l = !0, module.exports;
            }

            var installedModules = {};
            return __webpack_require__.m = modules, __webpack_require__.c = installedModules,
                __webpack_require__.i = function (value) {
                    return value;
                }, __webpack_require__.d = function (exports, name, getter) {
                __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                    configurable: !1,
                    enumerable: !0,
                    get: getter
                });
            }, __webpack_require__.n = function (module) {
                var getter = module && module.__esModule ? function () {
                    return module.default;
                } : function () {
                    return module;
                };
                return __webpack_require__.d(getter, "a", getter), getter;
            }, __webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            }, __webpack_require__.p = "dist", __webpack_require__(__webpack_require__.s = 6);
        }([function (module, __webpack_exports__, __webpack_require__) {
            "use strict";
            Object.defineProperty(__webpack_exports__, "__esModule", {
                value: !0
            });
            var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(5),
                __WEBPACK_IMPORTED_MODULE_1__style_less__ = __webpack_require__(4),
                DATE_STRING_REGEX = (__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__style_less__),
                    /(^\d{1,4}[\.|\\\/|-]\d{1,2}[\.|\\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/),
                PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/,
                JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
                requestAnimationFrame = window.requestAnimationFrame || function (cb) {
                    return cb(), 0;
                }, _defaultConfig = {
                    hoverPreviewEnabled: !1,
                    hoverPreviewArrayCount: 100,
                    hoverPreviewFieldCount: 5,
                    animateOpen: !0,
                    animateClose: !0,
                    theme: null,
                    useToJSON: !0,
                    sortPropertiesBy: null
                }, JSONFormatter = function () {
                    function JSONFormatter(json, open, config, key) {
                        void 0 === open && (open = 1), void 0 === config && (config = _defaultConfig), this.json = json,
                            this.open = open, this.config = config, this.key = key, this._isOpen = null, void 0 === this.config.hoverPreviewEnabled && (this.config.hoverPreviewEnabled = _defaultConfig.hoverPreviewEnabled),
                        void 0 === this.config.hoverPreviewArrayCount && (this.config.hoverPreviewArrayCount = _defaultConfig.hoverPreviewArrayCount),
                        void 0 === this.config.hoverPreviewFieldCount && (this.config.hoverPreviewFieldCount = _defaultConfig.hoverPreviewFieldCount),
                        void 0 === this.config.useToJSON && (this.config.useToJSON = _defaultConfig.useToJSON);
                    }

                    return Object.defineProperty(JSONFormatter.prototype, "isOpen", {
                        get: function () {
                            return null !== this._isOpen ? this._isOpen : this.open > 0;
                        },
                        set: function (value) {
                            this._isOpen = value;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isDate", {
                        get: function () {
                            return this.json instanceof Date || "string" === this.type && (DATE_STRING_REGEX.test(this.json) || JSON_DATE_REGEX.test(this.json) || PARTIAL_DATE_REGEX.test(this.json));
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isUrl", {
                        get: function () {
                            return "string" === this.type && 0 === this.json.indexOf("http");
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isArray", {
                        get: function () {
                            return Array.isArray(this.json);
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isObject", {
                        get: function () {
                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.a)(this.json);
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isEmptyObject", {
                        get: function () {
                            return !this.keys.length && !this.isArray;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "isEmpty", {
                        get: function () {
                            return this.isEmptyObject || this.keys && !this.keys.length && this.isArray;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "useToJSON", {
                        get: function () {
                            return this.config.useToJSON && "stringifiable" === this.type;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "hasKey", {
                        get: function () {
                            return void 0 !== this.key;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "constructorName", {
                        get: function () {
                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.b)(this.json);
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "type", {
                        get: function () {
                            return null === this.json ? "null" : this.config.useToJSON && this.json && this.json.toJSON ? "stringifiable" : typeof this.json;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(JSONFormatter.prototype, "keys", {
                        get: function () {
                            if (this.isObject) {
                                var keys = Object.keys(this.json).map(function (key) {
                                    return key || '""';
                                });
                                return !this.isArray && this.config.sortPropertiesBy ? keys.sort(this.config.sortPropertiesBy) : keys;
                            }
                            return [];
                        },
                        enumerable: !0,
                        configurable: !0
                    }), JSONFormatter.prototype.toggleOpen = function () {
                        this.isOpen = !this.isOpen, this.element && (this.isOpen ? this.appendChildren(this.config.animateOpen) : this.removeChildren(this.config.animateClose),
                            this.element.classList.toggle(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("open")));
                    }, JSONFormatter.prototype.openAtDepth = function (depth) {
                        void 0 === depth && (depth = 1), depth < 0 || (this.open = depth, this.isOpen = 0 !== depth,
                        this.element && (this.removeChildren(!1), 0 === depth ? this.element.classList.remove(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("open")) : (this.appendChildren(this.config.animateOpen),
                            this.element.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("open")))));
                    }, JSONFormatter.prototype.getInlinepreview = function () {
                        var _this = this;
                        if (this.isArray) return this.json.length > this.config.hoverPreviewArrayCount ? "Array[" + this.json.length + "]" : "[" + this.json.map(__WEBPACK_IMPORTED_MODULE_0__helpers__.d).join(", ") + "]";
                        var keys = this.keys, narrowKeys = keys.slice(0, this.config.hoverPreviewFieldCount),
                            kvs = narrowKeys.map(function (key) {
                                return key + ":" + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.d)(_this.type, _this.json[key]);
                            }), ellipsis = keys.length >= this.config.hoverPreviewFieldCount ? "…" : "";
                        return "{" + kvs.join(", ") + ellipsis + "}";
                    }, JSONFormatter.prototype.render = function () {
                        this.element = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("div", "row");
                        var togglerLink = this.isObject ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("a", "toggler-link") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span");
                        if (this.isObject && !this.useToJSON && togglerLink.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "toggler")),
                            this.hasKey && togglerLink.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "key", this.key + ":")),
                            this.isObject && !this.useToJSON) {
                            var value = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "value"),
                                objectWrapperSpan = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span"),
                                constructorName = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "constructor-name", this.constructorName);
                            if (objectWrapperSpan.appendChild(constructorName), this.isArray) {
                                var arrayWrapperSpan = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span");
                                arrayWrapperSpan.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "bracket", "[")),
                                    arrayWrapperSpan.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "number", this.json.length)),
                                    arrayWrapperSpan.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "bracket", "]")),
                                    objectWrapperSpan.appendChild(arrayWrapperSpan);
                            }
                            value.appendChild(objectWrapperSpan), togglerLink.appendChild(value);
                        } else {
                            var value = this.isUrl ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("a") : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span");
                            value.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)(this.type)),
                            this.isDate && value.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("date")),
                            this.isUrl && (value.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("url")),
                                value.setAttribute("href", this.json));
                            var valuePreview = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.f)(this.type, this.json, this.useToJSON ? this.json.toJSON() : this.json);
                            value.appendChild(document.createTextNode(valuePreview)), togglerLink.appendChild(value);
                        }
                        if (this.isObject && this.config.hoverPreviewEnabled) {
                            var preview = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("span", "preview-text");
                            preview.appendChild(document.createTextNode(this.getInlinepreview())), togglerLink.appendChild(preview);
                        }
                        var children = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.e)("div", "children");
                        return this.isObject && children.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("object")),
                        this.isArray && children.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("array")),
                        this.isEmpty && children.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("empty")),
                        this.config && this.config.theme && this.element.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)(this.config.theme)),
                        this.isOpen && this.element.classList.add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("open")),
                            this.element.appendChild(togglerLink), this.element.appendChild(children), this.isObject && this.isOpen && this.appendChildren(),
                        this.isObject && !this.useToJSON && togglerLink.addEventListener("click", this.toggleOpen.bind(this)),
                            this.element;
                    }, JSONFormatter.prototype.appendChildren = function (animated) {
                        var _this = this;
                        void 0 === animated && (animated = !1);
                        var children = this.element.querySelector("div." + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("children"));
                        if (children && !this.isEmpty) if (animated) {
                            var index_1 = 0, addAChild_1 = function () {
                                var key = _this.keys[index_1],
                                    formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
                                children.appendChild(formatter.render()), (index_1 += 1) < _this.keys.length && (index_1 > 10 ? addAChild_1() : requestAnimationFrame(addAChild_1));
                            };
                            requestAnimationFrame(addAChild_1);
                        } else this.keys.forEach(function (key) {
                            var formatter = new JSONFormatter(_this.json[key], _this.open - 1, _this.config, key);
                            children.appendChild(formatter.render());
                        });
                    }, JSONFormatter.prototype.removeChildren = function (animated) {
                        void 0 === animated && (animated = !1);
                        var childrenElement = this.element.querySelector("div." + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__.c)("children"));
                        if (animated) {
                            var childrenRemoved_1 = 0, removeAChild_1 = function () {
                                childrenElement && childrenElement.children.length && (childrenElement.removeChild(childrenElement.children[0]),
                                    childrenRemoved_1 += 1, childrenRemoved_1 > 10 ? removeAChild_1() : requestAnimationFrame(removeAChild_1));
                            };
                            requestAnimationFrame(removeAChild_1);
                        } else childrenElement && (childrenElement.innerHTML = "");
                    }, JSONFormatter;
                }();
            __webpack_exports__.default = JSONFormatter;
        }, function (module, exports, __webpack_require__) {
            exports = module.exports = __webpack_require__(2)(), exports.push([module.i, '.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-row,\n.json-formatter-row a,\n.json-formatter-row a:hover {\n  color: black;\n  text-decoration: none;\n}\n.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: "No properties";\n}\n.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: "[]";\n}\n.json-formatter-row .json-formatter-string,\n.json-formatter-row .json-formatter-stringifiable {\n  color: green;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-row .json-formatter-number {\n  color: blue;\n}\n.json-formatter-row .json-formatter-boolean {\n  color: red;\n}\n.json-formatter-row .json-formatter-null {\n  color: #855A00;\n}\n.json-formatter-row .json-formatter-undefined {\n  color: #ca0b69;\n}\n.json-formatter-row .json-formatter-function {\n  color: #FF20ED;\n}\n.json-formatter-row .json-formatter-date {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: blue;\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-bracket {\n  color: blue;\n}\n.json-formatter-row .json-formatter-key {\n  color: #00008B;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-toggler-link {\n  cursor: pointer;\n}\n.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: "\\25BA";\n}\n.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n.json-formatter-dark.json-formatter-row {\n  font-family: monospace;\n}\n.json-formatter-dark.json-formatter-row,\n.json-formatter-dark.json-formatter-row a,\n.json-formatter-dark.json-formatter-row a:hover {\n  color: white;\n  text-decoration: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-row {\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty {\n  opacity: 0.5;\n  margin-left: 1rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty:after {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {\n  content: "No properties";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {\n  content: "[]";\n}\n.json-formatter-dark.json-formatter-row .json-formatter-string,\n.json-formatter-dark.json-formatter-row .json-formatter-stringifiable {\n  color: #31F031;\n  white-space: pre;\n  word-wrap: break-word;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-number {\n  color: #66C2FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-boolean {\n  color: #EC4242;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-null {\n  color: #EEC97D;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-undefined {\n  color: #ef8fbe;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-function {\n  color: #FD48CB;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-date {\n  background-color: rgba(255, 255, 255, 0.05);\n}\n.json-formatter-dark.json-formatter-row .json-formatter-url {\n  text-decoration: underline;\n  color: #027BFF;\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-bracket {\n  color: #9494FF;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-key {\n  color: #23A0DB;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler-link {\n  cursor: pointer;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler {\n  line-height: 1.2rem;\n  font-size: 0.7rem;\n  vertical-align: middle;\n  opacity: 0.6;\n  cursor: pointer;\n  padding-right: 0.2rem;\n}\n.json-formatter-dark.json-formatter-row .json-formatter-toggler:after {\n  display: inline-block;\n  transition: transform 100ms ease-in;\n  content: "\\25BA";\n}\n.json-formatter-dark.json-formatter-row > a > .json-formatter-preview-text {\n  opacity: 0;\n  transition: opacity 0.15s ease-in;\n  font-style: italic;\n}\n.json-formatter-dark.json-formatter-row:hover > a > .json-formatter-preview-text {\n  opacity: 0.6;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {\n  transform: rotate(90deg);\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-children:after {\n  display: inline-block;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {\n  display: none;\n}\n.json-formatter-dark.json-formatter-row.json-formatter-open.json-formatter-empty:after {\n  display: block;\n}\n', ""]);
        }, function (module, exports) {
            module.exports = function () {
                var list = [];
                return list.toString = function () {
                    for (var result = [], i = 0; i < this.length; i++) {
                        var item = this[i];
                        item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                    }
                    return result.join("");
                }, list.i = function (modules, mediaQuery) {
                    "string" == typeof modules && (modules = [[null, modules, ""]]);
                    for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                        var id = this[i][0];
                        "number" == typeof id && (alreadyImportedModules[id] = !0);
                    }
                    for (i = 0; i < modules.length; i++) {
                        var item = modules[i];
                        "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"),
                            list.push(item));
                    }
                }, list;
            };
        }, function (module, exports) {
            function addStylesToDom(styles, options) {
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i], domStyle = stylesInDom[item.id];
                    if (domStyle) {
                        domStyle.refs++;
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                        for (; j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
                    } else {
                        for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                        stylesInDom[item.id] = {
                            id: item.id,
                            refs: 1,
                            parts: parts
                        };
                    }
                }
            }

            function listToStyles(list) {
                for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                    var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                        css: css,
                        media: media,
                        sourceMap: sourceMap
                    };
                    newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                        id: id,
                        parts: [part]
                    });
                }
                return styles;
            }

            function insertStyleElement(options, styleElement) {
                var head = getHeadElement(),
                    lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
                if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling) : head.appendChild(styleElement) : head.insertBefore(styleElement, head.firstChild),
                    styleElementsInsertedAtTop.push(styleElement); else {
                    if ("bottom" !== options.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                    head.appendChild(styleElement);
                }
            }

            function removeStyleElement(styleElement) {
                styleElement.parentNode.removeChild(styleElement);
                var idx = styleElementsInsertedAtTop.indexOf(styleElement);
                idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
            }

            function createStyleElement(options) {
                var styleElement = document.createElement("style");
                return styleElement.type = "text/css", insertStyleElement(options, styleElement),
                    styleElement;
            }

            function createLinkElement(options) {
                var linkElement = document.createElement("link");
                return linkElement.rel = "stylesheet", insertStyleElement(options, linkElement),
                    linkElement;
            }

            function addStyle(obj, options) {
                var styleElement, update, remove;
                if (options.singleton) {
                    var styleIndex = singletonCounter++;
                    styleElement = singletonElement || (singletonElement = createStyleElement(options)),
                        update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
                } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (styleElement = createLinkElement(options),
                    update = updateLink.bind(null, styleElement), remove = function () {
                    removeStyleElement(styleElement), styleElement.href && URL.revokeObjectURL(styleElement.href);
                }) : (styleElement = createStyleElement(options), update = applyToTag.bind(null, styleElement),
                    remove = function () {
                        removeStyleElement(styleElement);
                    });
                return update(obj), function (newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                        update(obj = newObj);
                    } else remove();
                };
            }

            function applyToSingletonTag(styleElement, index, remove, obj) {
                var css = remove ? "" : obj.css;
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
                    var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
                    childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
                }
            }

            function applyToTag(styleElement, obj) {
                var css = obj.css, media = obj.media;
                if (media && styleElement.setAttribute("media", media), styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (; styleElement.firstChild;) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
            }

            function updateLink(linkElement, obj) {
                var css = obj.css, sourceMap = obj.sourceMap;
                sourceMap && (css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
                var blob = new Blob([css], {
                    type: "text/css"
                }), oldSrc = linkElement.href;
                linkElement.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
            }

            var stylesInDom = {}, memoize = function (fn) {
                var memo;
                return function () {
                    return void 0 === memo && (memo = fn.apply(this, arguments)), memo;
                };
            }, isOldIE = memoize(function () {
                return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
            }), getHeadElement = memoize(function () {
                return document.head || document.getElementsByTagName("head")[0];
            }), singletonElement = null, singletonCounter = 0, styleElementsInsertedAtTop = [];
            module.exports = function (list, options) {
                if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
                options = options || {}, void 0 === options.singleton && (options.singleton = isOldIE()),
                void 0 === options.insertAt && (options.insertAt = "bottom");
                var styles = listToStyles(list);
                return addStylesToDom(styles, options), function (newList) {
                    for (var mayRemove = [], i = 0; i < styles.length; i++) {
                        var item = styles[i], domStyle = stylesInDom[item.id];
                        domStyle.refs--, mayRemove.push(domStyle);
                    }
                    if (newList) {
                        addStylesToDom(listToStyles(newList), options);
                    }
                    for (var i = 0; i < mayRemove.length; i++) {
                        var domStyle = mayRemove[i];
                        if (0 === domStyle.refs) {
                            for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                            delete stylesInDom[domStyle.id];
                        }
                    }
                };
            };
            var replaceText = function () {
                var textStore = [];
                return function (index, replacement) {
                    return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
                };
            }();
        }, function (module, exports, __webpack_require__) {
            var content = __webpack_require__(1);
            "string" == typeof content && (content = [[module.i, content, ""]]);
            __webpack_require__(3)(content, {});
            content.locals && (module.exports = content.locals);
        }, function (module, __webpack_exports__, __webpack_require__) {
            "use strict";

            function escapeString(str) {
                return str.replace('"', '"');
            }

            function isObject(value) {
                var type = typeof value;
                return !!value && "object" == type;
            }

            function getObjectName(object) {
                if (void 0 === object) return "";
                if (null === object) return "Object";
                if ("object" == typeof object && !object.constructor) return "Object";
                var funcNameRegex = /function ([^(]*)/, results = funcNameRegex.exec(object.constructor.toString());
                return results && results.length > 1 ? results[1] : "";
            }

            function getValuePreview(type, object, value) {
                return "null" === type || "undefined" === type ? type : ("string" !== type && "stringifiable" !== type || (value = '"' + escapeString(value) + '"'),
                    "function" === type ? object.toString().replace(/[\r\n]/g, "").replace(/\{.*\}/, "") + "{…}" : value);
            }

            function getPreview(type, object) {
                var value = "";
                return isObject(object) ? (value = getObjectName(object), Array.isArray(object) && (value += "[" + object.length + "]")) : value = getValuePreview(type, object, object),
                    value;
            }

            function cssClass(className) {
                return "json-formatter-" + className;
            }

            function createElement(type, className, content) {
                var el = document.createElement(type);
                return className && el.classList.add(cssClass(className)), void 0 !== content && (content instanceof Node ? el.appendChild(content) : el.appendChild(document.createTextNode(String(content)))),
                    el;
            }

            __webpack_exports__.a = isObject, __webpack_exports__.b = getObjectName, __webpack_exports__.f = getValuePreview,
                __webpack_exports__.d = getPreview, __webpack_exports__.c = cssClass, __webpack_exports__.e = createElement;
        }, function (module, exports, __webpack_require__) {
            module.exports = __webpack_require__(0);
        }]);
//# sourceMappingURL=json-formatter.js.map

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports, __webpack_require__) {

        var JSONFormatter = __webpack_require__(0).default;
        window.submitMethod = function (formId, id) {
            var startTime = new Date().getTime();
            $.ajax.settings = {
                xhrFields: {withCredentials: true},
                crossDomain: true
            };
            $('form#' + formId).ajaxSubmit({
                beforeSubmit: function (arr, $form, options) {
                    console.log(options.data);
                    $("#testRequest-" + id).html('');
                    $("#testRequest-" + id).html(options.url + '<hr>' + options.type + '<hr>' );
                    $("#testRequest-" + id).append(JSON.stringify(arr))
                },
                success: function (data, status, result) {
                    var testTime = ((new Date().getTime()) - startTime);

                    $("#testStatus-" + id).html(result.status + ' ' + result.statusText);
                    try {
                        if (typeof data === 'string')
                            data = JSON.parse(data)
                    } catch (e) {
                        console.error('JSONPARSE', e)
                    }
                    $("#testTime-" + id).html(testTime + ' ms');
                    const formatter = new JSONFormatter(data, 2, {hoverPreviewEnabled: true});
                    $("#testResponse-" + id).html(formatter.render());
                    // $("#testResponse-" + id).html(result.responseText);

                    var headers1 = result.getAllResponseHeaders();
                    headers1 = headers1.split('\n');
                    if (headers1[headers1.length - 1] === '') headers1.splice(headers1.length - 1, 1);
                    $("#testCountHeaders-" + id).html('(' + headers1.length + ')');
                    headers1.forEach(function (el) {
                        $("#testHeaders-" + id).append(el + '<br>')
                    });
                }, error: function () {
                    $("#testStatus-" + id).html('Error');
                    $("#testTime-" + id).html(((new Date().getTime()) - startTime) + ' ms');
                    $("#testResponse-" + id).html('Error');

                }
            });


        }
        /***/
    })
    /******/]);

//# sourceMappingURL=index.js.map
