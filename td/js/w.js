/*
Copyright © Robin Bertram
http://www.robinbertram.com

Webbins library v0.1
*/

var W = W || {
    totalIncludes: 0,
    included: 0,
    includes: [],
    nextInclude: true,
    loading: false,
    loadTries: 0,
    node: function(node) {
        return node.nodeType ? node : document.querySelector(node);
    },
    /* Prepend Elements - <string>|<node>, <node>, <object> , <string> ex: W.prepend('div', target, {'id': 'container', 'class': 'container'}, 'Default text') */
    prepend: function(element, target, parameters, text) {
        if (element && target) {
            if (!element.nodeType) {
                var element = document.createElement(element);
                if (text) element.innerHTML = text;
            }
            for (var key in parameters) element.setAttribute(key, parameters[key]);
            this.node(target).insertBefore(element, this.node(target).firstChild);
            return element;
        } else console.log("Must contain element and target");
    },
    /* Append Elements - <string>|<node>, <node>, <object> , <string> ex: W.append('div', target, {'id': 'container', 'class': 'container'}, 'Default text') */
    append: function(element, target, parameters, text) {
        if (element && target) {
            if (!element.nodeType) {
                var element = document.createElement(element);
                if (text) element.innerHTML = text;
            }
            for (var key in parameters) element.setAttribute(key, parameters[key]);
            this.node(target).appendChild(element);
            return element;
        } else console.log("Must contain element and target");
    },
    /* Include JS */
    include: function(file, async) {
        if (async) {
            if (!W.nextInclude) {
                W.loading = true;
                if (!W.inArray(file, W.includes)) {
                    W.includes.push(file);
                    W.totalIncludes++;
                }
                setTimeout(function() {
                    W.include(file, async);
                }, 100);
                return false;
            }
        }

        var includeID = Date.now(); // byt ut mot var file

        if (includeID = W.append('script', document.querySelector('head'), {'type': 'text/javascript', 'src': file, 'w-file': true})) {
            W.nextInclude = false;

            includeID.onload = function() {
                this.setAttribute("w-loaded", true);
                W.nextInclude = true;
                W.included++;
            }
        }
    },
    trim: function(string) {
        if (string) return this.replace(new RegExp(string), "");
        else        return this.replace(/^\s+|\s+$/g, "");
    },
    /* Set CSS - <node>, <object> (ex: {'left': '300px', 'top': '200px', 'z-index': 2}) */
    css: function(node, parameters) {
        if (node && parameters) {
            for (var key in parameters) {
                if (key == 'width')             this.node(node).style.width = parameters[key];
                else if (key == 'height')       this.node(node).style.height = parameters[key];
                else if (key == 'left')         this.node(node).style.left = parameters[key];
                else if (key == 'top')          this.node(node).style.top = parameters[key];
                else if (key == 'z-index')      this.node(node).style.zIndex = parameters[key];
                else if (key == 'opacity')      this.node(node).style.opacity = parameters[key];
                else if (key == 'display')      this.node(node).style.display = parameters[key];
                else if (key == 'visibility')   this.node(node).style.visibility = parameters[key];
                else if (key == 'cursor')       this.node(node).style.cursor = parameters[key];
                else if (key == 'overflow')     this.node(node).style.overflow = parameters[key];
                else                            console.log('Incorrect parameter: '+key);
            }
        } else console.log("Must contain node and parameters. Node: "+node+" - Parameters: "+JSON.stringify(parameters));
    },
    /* Show */
    show: function(node) {
        this.node(node).style.display = 'block';
    },
    /* Hide */
    hide: function(node) {
        this.node(node).style.display = 'none';
    },
    /* Has class - <node> <string> */
    hasClass: function(node, className) {
        return this.node(node).className.match(new RegExp(className));
    },
    /* Add class - <node> <string> */
    addClass: function(node, className) {
        if (!W.hasClass(this.node(node), className)) this.node(node).className += " "+className;
    },
    /* Remove class - <node> <string> */
    removeClass: function(node, className) {
        if (W.hasClass(this.node(node), className)) {
            this.node(node).className = this.trim(this.node(node).className.replace(new RegExp(className), ''));
        }
    },
    /* Get index */
    getIndex: function(needle, haystack) {
        for (var i=0; i<haystack.length; i++) {
            if (haystack[i] == needle) return i;
        }
        return false;
    },
    /* In array */
    inArray: function(needle, haystack) {
        if (haystack instanceof Array) {
            for (var i=0; i<haystack.length; i++) {
                if (needle == haystack[i]) return true;
            }
        } else {
            if (haystack[needle]) return true;
        }
        return false;
    },
    isTouch: function() {
        try {
            document.createEvent('TouchEvent');
            return true;
        } catch(e) {
            return false;
        }
    },
    screenHeight: function() {
        return screen.height;
    },
    screenWidth: function() {
        return screen.width;
    },
    /* Date format */
    dateFormat: function(tmp) {
        return tmp < 10 ? "0"+tmp : tmp;
    },
    /* Next sibling */
    nextSibling: function(node) {
        while (this.node(node).nextSibling && this.node(node).nextSibling.nodeType != 1) {
            return this.node(node).nextSibling.nextSibling;
        }
    },
    /* Set cookie */
    setCookie: function(name, value, expires) {
        value = escape(value);
        if (expires) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate()+expires);
            value += '; expires='+expireDate.toUTCString();
        }
        document.cookie = name+'='+value;
    },
    /* Get cookie */
    getCookie: function(name) {
        var cookies = document.cookie.split(";");
        for (var i=0; i<cookies.length; i++) {
            var tmp = cookies[i].trim().split("=");
            if (tmp[0] == name) return tmp[1];
        }
        return false;
    },
    loaded: function(callback, executionTime) {
        if (W.loading) {
            if (W.included >= W.totalIncludes) {
                W.loading = false;
                W.loaded(callback, executionTime);
                return false;
            }
        }

        if (!W.loading) {
            var executionTime = executionTime ? executionTime : 5;
            var loaded = document.querySelectorAll('[w-loaded]');

            if (W.loadTries == executionTime) {
                var missingFiles = "";
                var files = document.querySelectorAll('[w-file]');

                for (var i=0; i<files.length; i++) {
                    if (!files[i].getAttribute('w-loaded')) {
                        missingFiles += files[i].src+" ";
                    }
                }
                console.log("Maximum execution time. These files were not loaded: "+missingFiles);
                return false;
            }

            if (loaded.length == W.included) {
                callback();
                return true;
            }

            W.loadTries++;
        }
        setTimeout(function() {
            W.loaded(callback, executionTime);
        }, 500);
    },
    /* Ajax - new Ajax({url: 'url.php', 'method': 'post', 'data': {username: 'Robin'}}, function(data) { console.log(data); }); */
    Ajax: function(parameters, callback) {
        var sendParams = '';
        var xhr = null;

        var c = {
            url:    null,
            method: 'get',
            data:   null,
            async:  true
        }

        for (var i in parameters) {
            for (var j in c) {
                if (i == j) c[j] = parameters[j];
            }
        }

        if (c['data']) {
            for (var i in c['data']) {
                sendParams += i+'='+c['data'][i]+'&';
            }
            sendParams = sendParams.slice(0, -1);
        } else {
            sendParams = null;
        }

        if (!c['url']) {
            console.log("No URL was passed");
        } else {
            try {
                xhr = new XMLHttpRequest();
            } catch(error) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(error) {
                    console.log("No XHR object available");
                }
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        if (callback) callback(xhr.responseText);
                    } else {
                        console.log("Error, status: "+xhr.status);
                    }
                }
            }

            xhr.open(c['method'], c['url'], c['async']);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(sendParams);
        }
    },
    requestAnimationFrame: function() {
        if (!window.requestAnimationFrame) {
            var browsers = ['webkit', 'moz', 'o', 'ms'];
            for (var i=0; i<browsers.length; i++) {
                if (window[browsers[i]+'RequestAnimationFrame']) {
                    window.requestAnimationFrame = window[browsers[i]+'RequestAnimationFrame'];
                    window.cancelAnimationFrame = window[browsers[i]+'CancelAnimationFrame'];
                    break;
                }
            }
        }
    }
};