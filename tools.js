/*
 * @Author: xiangliang.zeng
 * @Date:   2016-12-05 13:18:21
 * @Last Modified by:   xiangliang.zeng
 * @Last Modified time: 2017-02-17 11:10:46
 */

'use strict';

function Tools() {
    this.class2type = {};
    this._toString = this.class2type.toString;
    this._slice = Array.prototype.slice;
    this._type = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ");
}
Tools.prototype = {
    isArray: Array.isArray || function(arr) {
        this._toString.call[arr] === '[object Array]';
    },
    each: function(obj, callback) {
        var i = 0,
            length;
        if (this.isArray(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
    },
    type: function(obj) {
        var _this = this;
        if (obj == null) {
            return obj + "";
        }
        this.each(this._type, function(i, t) {
            _this.class2type['[object ' + t + ']'] = t.toLowerCase();
        });
        return typeof obj === "object" || typeof obj === "function" ?
            this.class2type[this._toString.call(obj)] || "object" :
            typeof obj;
    },
    trim: function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    ltrim: function(str) {
        return str.replace(/(^\s*)/g, '');
    },
    rtrim: function(str) {
        return str.replace(/(\s*$)/g, '');
    },
    trimAll: function(str) {
        return str.replace(/\s/g, '');
    },
    left: function(str, len) {
        return str.substring(0, len);
    },
    right: function(str, len) {
        return (str.length <= len) ? str.toString() : str.substring(str.length - len, str.length);
    },
    reverse: function(str) {
        return str.split('').reverse().join('');
    },
    addOutline: function() {
        [].forEach.call(document.querySelectorAll("*"), function(a) {
            a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16)
        });
    },
    getStyle: function(obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
    },
    showFPS: function() {
        var script = document.createElement('script');
        script.onload = function() {
            var stats = new Stats();
            document.body.appendChild(stats.dom);
            requestAnimationFrame(function loop() {
                stats.update();
                requestAnimationFrame(loop)
            });
        };
        script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
        document.head.appendChild(script);
    },
    isRepeat: function(arr) { //arr是否有重复元素
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]]) return true;
            hash[arr[i]] = true;
        }
        return false;
    },
    replaceAll: function(bigStr, str1, str2) { //把bigStr中的所有str1替换为str2
        var reg = new RegExp(str1, 'gm');
        return bigStr.replace(reg, str2);
    },
    getRandom16: function() { // 生成"7e9c1c1f3d65d"
        return Math.random().toString(16).substring(2);
    },
    getRandom32: function() { // 生成"do7x3okpavl1rc2c26h1wnrk9"
        return Math.random().toString(36).substring(2);
    },
    parserURL: function(url) {
        var a = document.createElement('a');
        a.href = url;

        var search = function(search) {
            if (!search) return {};

            var ret = {};
            search = search.slice(1).split('&');
            for (var i = 0, arr; i < search.length; i++) {
                arr = search[i].split('=');
                ret[arr[0]] = arr[1];
            }
            return ret;
        };

        return {
            protocol: a.protocol,
            host: a.host,
            hostname: a.hostname,
            pathname: a.pathname,
            search: search(a.search),
            hash: a.hash
        }
    },
    addReLoad: function() {
        var reload = document.createElement('div');
        reload.style.cssText = 'display: block;position: fixed;left: 10px;bottom: 10px;color: #fff;background-color: #04be02;line-height: 1;font-size: 14px;padding: 8px 16px;z-index: 10000;border-radius: 4px;box-shadow: 0 0 8px rgba(0,0,0,.4);'
        reload.textContent = 'ReLoad';
        document.body.appendChild(reload);
        reload.addEventListener('click', function() {
            var random = this.getRandom16();
            var href = window.location.href;
            if (href.indexOf('?')) {
                window.location.href = href.split('?')[0] + '?' + random;
            } else {
                window.location.href = href + '?' + random;
            }
        }, false);
    },
    deepCopy: function(obj) {
        var result = this._toString.call(obj) === '[object Array]' ? [] : {};
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    },
    setMsg: function (msg) {
        console.log("setMsg:msg=" + msg);
        var msgTxt = document.getElementById("msgTxt") || null;
        if (!msgTxt) {
            msgTxt = document.createElement('div');
            document.body.appendChild(msgTxt);
            msgTxt.style.position = "absolute";
            msgTxt.style.top = "10px";
            msgTxt.style.right = "10px";
            msgTxt.style.fontSize = "14px";
            msgTxt.style.lineHeight = "20px";
            msgTxt.style.width = "300px";
            msgTxt.style.height = "auto";
            msgTxt.style.backgroundColor = "red";
            msgTxt.style.border = "solid 2px green";
            msgTxt.style.pointerEvents = "none";
            msgTxt.style.opacity = 0.7;
        }
        if (msgTxt) {
            msgTxt.innerHTML += msg + "<br/>";
            if (msgTxt.clientHeight > document.documentElement.clientHeight * 0.9) {
                msgTxt.innerHTML = msg + "<br/>";
            }
        }
    },
    addRootRem: function () {
        var dcl = document.documentElement, wh;
        function setRootRem() {
            wh = dcl.clientHeight;
            dcl.style.fontSize = 100 * (wh / 1206) + 'px';   // 1206为设计稿高度
        }

        setRootRem();
        document.addEventListener('DOMContentLoaded', setRootRem, false);
        window.addEventListener('resize', setRootRem, false);
    },
    myFixed: function (num,length) {
        num.toFixed(length)
    },
    myPreventDefault:function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    removeHTMLtouchMove: function () {  
        document.addEventListener('touchmove',this.myPreventDefault,false)
    },
	assign:Object.assign || function(target) {
        if(target === undefined || target === null) {
	        throw new TypeError('Cannot convert undefined or null to object');
        }
		var output = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source !== undefined && source !== null) {
				for (var nextKey in source) {
					if (source.hasOwnProperty(nextKey)) {
						output[nextKey] = source[nextKey];
					}
				}
			}
		}
		return output;
    },
    bindFn: function () {
	    return function boundFn() {
		    return fn.apply(context, arguments);
	    };
    },
	ifUndefined: function (val1,val2) {
        return val1 === undefined ? val2 : val1;
	},
    splitStr: function (str) {
        return this.trim(str).split(/s+/g);
    },
    addEventFn: function (target,types,handler) {
        this.each(this.splitStr(types),function(type) {
		    target.addEventListener(type, handler, false);
	    });
    },
    removeEventFn: function (target,types,handler) {
	    this.each(this.splitStr(types),function(type) {
		    target.removeEventListener(type, handler, false);
	    });
    },
    toArray: function (obj) {
        return typeof obj === 'object' ? this._slice.call(obj,0) : obj;
    },
	setTimeoutContext:function(fn, timeout, context) {
        // var _this = this;
		return setTimeout(this.bindFn(fn, context), timeout);
    },
	setIntervalContext:function(fn, timeout, context) {
		// var _this = this;
		return setInterval(_this.bindFn(fn, context), timeout);
	},
	hasParent:function(node, parent) {
		while (node) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	}
}