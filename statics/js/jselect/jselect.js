(function () {
    var utils = {
        //获取对象类型
        getType: function (obj) {
            if (!obj && obj != 0) {
                return undefined;
            }
            var baseType = /^(undefined|string|number|boolean|function)$/;
            return (!baseType.test(typeof (obj)) ?
                (obj.constructor ?
                    /function\s([^()]+)/.exec(obj.constructor + "")[1] :
                    Object.prototype.toString.call(obj).slice(8, -1))
                : typeof (obj)).toLowerCase();
        },
        //循环
        each: function (data, func) {
            var func = func || function () { };
            var i = 0, length = data.length;

            if (length) {
                for (; i < length; i++) {
                    var thisObj = data[i];
                    func.call(thisObj, thisObj);
                }
            } else {
                for (var key in data) {
                    var thisObj = data[key];
                    func.apply(thisObj, [thisObj, key]);

                }
            }
        },
        hasClass: function (selector, elem) {
            var className = " " + selector + " ";

            if (elem.nodeType === 1 && (" " + elem.className + " ").replace(/[\r\n\t]/g, " ").indexOf(className) > -1) {
                return true;
            }

            return false;
        },

        getElementsByClassName: function (className, elem, tag) {
            var elem = elem || document;
            var tag = tag || "*";

            if (elem.querySelectorAll) {
                return elem.querySelectorAll("." + className);
            }

            var selectors = elem.getElementsByTagName(tag);
            var elems = [];

            for (var i = 0, s; (s = selectors[i]) != null; i++) {
                if (utils.hasClass(className, s)) {
                    elems.push(s);
                }
            }
            return elems;

        },

        addEvent: function (eventName, fn, elem) {
            var elem = elem || window;
            if (elem && elem.addEventListener) {
                elem.addEventListener(eventName, fn, false);
            } else if (elem && elem.attachEvent) {
                elem.attachEvent("on" + eventName, fn);
            } else {
                new Function("var oldEvent=elem.on" + eventName + ";elem.on" + eventName + "=function(){oldEvent();fn();}")(elem);
            }
        }
    }

    var zIndex = 1000;

    function render() {
        utils.each(document.getElementsByTagName("SELECT"), function () {
            var custom = this.getAttribute("custom") == undefined || this.getAttribute("custom") === "true";
            var container = document.createElement("DIV");
            var width = this.getAttribute("width");
            var height = this.getAttribute("height");
            container.className = "select-box";
            container.innerHTML = "<span class='select-box-title'>" +
                "<span class='select-box-value'>请选择...</span></span>" +
                "<UL class='select-box-list'>" + this.innerHTML.replace(/option/ig, "li") + "</UL>";

            container.style.zIndex = zIndex;
            zIndex--;

            this.parentNode.insertBefore(container, this);
            this.style.display = "none";

            utils.each(utils.getElementsByClassName("select-box-title", container, "SPAN"), function () {
                this.onclick = function (e) {
                    var e = e || window.event;

                    utils.each(utils.getElementsByClassName("select-box"), function () {
                        this.className = "select-box";
                    });

                    if (!utils.hasClass("select-box-hover", container)) {
                        container.className = "select-box select-box-hover";
                    } else {
                        container.className = "select-box";
                    }
                    e.stopPropagation && e.stopPropagation();
                    e.cancelable = true;
                    return false;
                }
                if (width) {
                    this.style.width = parseInt(width) - 5 + "px";
                    utils.each(utils.getElementsByClassName("select-box-value", container, "SPAN"), function () {
                        this.style.width = parseInt(width) - 30 + "px";
                        this.style.display = "block";
                    });
                }
            });

            utils.each(utils.getElementsByClassName("select-box-list", container, "UL"), function () {
                if (width) {
                    this.style.width = parseInt(width) + "px";
                }
                if (height) {
                    this.style.height = parseInt(height) + "px";
                    this.style["overflowY"] = "scroll";
                }
            });
            //container.onmouseleave = function () {
            //    opened = false;
            //    container.className = "select-box";
            //}

            var thisObj = this;
            var text = utils.getElementsByClassName("select-box-value", container, "SPAN")[0];
            utils.each(container.getElementsByTagName("LI"), function (e) {
                this.onclick = function () {
                    text.innerHTML = this.innerHTML;
                    container.className = "select-box";
                    var options = thisObj.getElementsByTagName("OPTION");
                    for (var i = 0, len = options.length; i < len; i++) {
                        option = options[i];
                        if ((this.getAttribute("value") != undefined && this.getAttribute("value") == option.getAttribute("value")) || this.innerHTML == option.innerHTML) {
                            option.selected = true;
                            break;
                        }
                    }
                    try {
                        thisObj.onchange && thisObj.onchange(this.getAttribute("value"));
                    } catch (e) {
                    }
                    return false;
                }

                //初始化
                if (this.getAttribute("value") == thisObj.value) {
                    text.innerHTML = this.innerHTML;
                }

            });
        });
    }
    window.RenderSelect = function () {
        utils.each(utils.getElementsByClassName("select-box", document.body, "DIV"), function () {
            this.parentNode.removeChild(this);
        });
        render();
    }

    function init() {
        render();

        utils.addEvent("click", function (e) {
            utils.each(utils.getElementsByClassName("select-box"), function () {
                this.className = "select-box";
            });
        });
    }

    window.jQuery ? jQuery(init) : utils.addEvent("load", function () {
        init();
    });

}());