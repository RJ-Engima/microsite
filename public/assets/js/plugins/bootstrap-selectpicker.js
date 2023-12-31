! function(e, t) {
    "function" == typeof define && define.amd ? define(["jquery"], function(e) {
        return t(e)
    }) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(e.jQuery)
}(this, function(e) {
    ! function(e) {
        "use strict";
        var t, i, s, n = document.createElement("_");
        if (n.classList.toggle("c3", !1), n.classList.contains("c3")) {
            var o = DOMTokenList.prototype.toggle;
            DOMTokenList.prototype.toggle = function(e, t) {
                return 1 in arguments && !this.contains(e) == !t ? t : o.call(this, e)
            }
        }

        function l(e) {
            var t, i = [],
                s = e && e.options;
            if (e.multiple)
                for (var n = 0, o = s.length; n < o; n++)(t = s[n]).selected && i.push(t.value || t.text);
            else i = e.value;
            return i
        }
        String.prototype.startsWith || (t = function() {
            try {
                var e = {},
                    t = Object.defineProperty,
                    i = t(e, e, e) && t
            } catch (e) {}
            return i
        }(), i = {}.toString, s = function(e) {
            if (null == this) throw new TypeError;
            var t = String(this);
            if (e && "[object RegExp]" == i.call(e)) throw new TypeError;
            var s = t.length,
                n = String(e),
                o = n.length,
                l = arguments.length > 1 ? arguments[1] : void 0,
                r = l ? Number(l) : 0;
            r != r && (r = 0);
            var c = Math.min(Math.max(r, 0), s);
            if (o + c > s) return !1;
            for (var a = -1; ++a < o;)
                if (t.charCodeAt(c + a) != n.charCodeAt(a)) return !1;
            return !0
        }, t ? t(String.prototype, "startsWith", {
            value: s,
            configurable: !0,
            writable: !0
        }) : String.prototype.startsWith = s), Object.keys || (Object.keys = function(e, t, i) {
            i = [];
            for (t in e) i.hasOwnProperty.call(e, t) && i.push(t);
            return i
        });
        var r = {
            useDefault: !1,
            _set: e.valHooks.select.set
        };
        e.valHooks.select.set = function(t, i) {
            return i && !r.useDefault && e(t).data("selected", !0), r._set.apply(this, arguments)
        };
        var c = null,
            a = function() {
                try {
                    return new Event("change"), !0
                } catch (e) {
                    return !1
                }
            }();

        function d(e, t, i, s) {
            for (var n = ["content", "subtext", "tokens"], o = !1, l = 0; l < n.length; l++) {
                var r = n[l],
                    c = e[r];
                if (c && (c = c.toString(), "content" === r && (c = c.replace(/<[^>]+>/g, "")), s && (c = p(c)), c = c.toUpperCase(), o = "contains" === i ? c.indexOf(t) >= 0 : c.startsWith(t))) break
            }
            return o
        }

        function h(e) {
            return parseInt(e, 10) || 0
        }

        function p(t) {
            return e.each([{
                re: /[\xC0-\xC6]/g,
                ch: "A"
            }, {
                re: /[\xE0-\xE6]/g,
                ch: "a"
            }, {
                re: /[\xC8-\xCB]/g,
                ch: "E"
            }, {
                re: /[\xE8-\xEB]/g,
                ch: "e"
            }, {
                re: /[\xCC-\xCF]/g,
                ch: "I"
            }, {
                re: /[\xEC-\xEF]/g,
                ch: "i"
            }, {
                re: /[\xD2-\xD6]/g,
                ch: "O"
            }, {
                re: /[\xF2-\xF6]/g,
                ch: "o"
            }, {
                re: /[\xD9-\xDC]/g,
                ch: "U"
            }, {
                re: /[\xF9-\xFC]/g,
                ch: "u"
            }, {
                re: /[\xC7-\xE7]/g,
                ch: "c"
            }, {
                re: /[\xD1]/g,
                ch: "N"
            }, {
                re: /[\xF1]/g,
                ch: "n"
            }], function() {
                t = t ? t.replace(this.re, this.ch) : ""
            }), t
        }
        e.fn.triggerNative = function(e) {
            var t, i = this[0];
            i.dispatchEvent ? (a ? t = new Event(e, {
                bubbles: !0
            }) : (t = document.createEvent("Event")).initEvent(e, !0, !1), i.dispatchEvent(t)) : i.fireEvent ? ((t = document.createEventObject()).eventType = e, i.fireEvent("on" + e, t)) : this.trigger(e)
        };
        var u = function(e) {
                var t = function(t) {
                        return e[t]
                    },
                    i = "(?:" + Object.keys(e).join("|") + ")",
                    s = RegExp(i),
                    n = RegExp(i, "g");
                return function(e) {
                    return e = null == e ? "" : "" + e, s.test(e) ? e.replace(n, t) : e
                }
            },
            m = u({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            }),
            f = u({
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&quot;": '"',
                "&#x27;": "'",
                "&#x60;": "`"
            }),
            v = {
                32: " ",
                48: "0",
                49: "1",
                50: "2",
                51: "3",
                52: "4",
                53: "5",
                54: "6",
                55: "7",
                56: "8",
                57: "9",
                59: ";",
                65: "A",
                66: "B",
                67: "C",
                68: "D",
                69: "E",
                70: "F",
                71: "G",
                72: "H",
                73: "I",
                74: "J",
                75: "K",
                76: "L",
                77: "M",
                78: "N",
                79: "O",
                80: "P",
                81: "Q",
                82: "R",
                83: "S",
                84: "T",
                85: "U",
                86: "V",
                87: "W",
                88: "X",
                89: "Y",
                90: "Z",
                96: "0",
                97: "1",
                98: "2",
                99: "3",
                100: "4",
                101: "5",
                102: "6",
                103: "7",
                104: "8",
                105: "9"
            },
            g = 27,
            b = 13,
            x = 32,
            w = 9,
            I = 38,
            k = 40,
            $ = {};
        try {
            $.full = (e.fn.dropdown.Constructor.VERSION || "").split(" ")[0].split("."), $.major = $.full[0]
        } catch (e) {
            console.error("There was an issue retrieving Bootstrap's version. Ensure Bootstrap is being loaded before bootstrap-select and there is no namespace collision.", e), $.major = "3"
        }
        var C = {
                DISABLED: "disabled",
                DIVIDER: "4" === $.major ? "dropdown-divider" : "divider",
                SHOW: "4" === $.major ? "show" : "open",
                DROPUP: "dropup",
                MENURIGHT: "dropdown-menu-right",
                MENULEFT: "dropdown-menu-left",
                BUTTONCLASS: "4" === $.major ? "btn-light" : "btn-default",
                POPOVERHEADER: "4" === $.major ? "popover-header" : "popover-title"
            },
            S = new RegExp(I + "|" + k),
            E = new RegExp("^" + w + "$|" + g),
            y = (new RegExp(b + "|" + x), function(t, i) {
                var s = this;
                r.useDefault || (e.valHooks.select.set = r._set, r.useDefault = !0), this.$element = e(t), this.$newElement = null, this.$button = null, this.$menu = null, this.options = i, this.selectpicker = {
                    main: {
                        map: {
                            newIndex: {},
                            originalIndex: {}
                        }
                    },
                    current: {
                        map: {}
                    },
                    search: {
                        map: {}
                    },
                    view: {},
                    keydown: {
                        keyHistory: "",
                        resetKeyHistory: {
                            start: function() {
                                return setTimeout(function() {
                                    s.selectpicker.keydown.keyHistory = ""
                                }, 800)
                            }
                        }
                    }
                }, null === this.options.title && (this.options.title = this.$element.attr("title"));
                var n = this.options.windowPadding;
                "number" == typeof n && (this.options.windowPadding = [n, n, n, n]), this.val = y.prototype.val, this.render = y.prototype.render, this.refresh = y.prototype.refresh, this.setStyle = y.prototype.setStyle, this.selectAll = y.prototype.selectAll, this.deselectAll = y.prototype.deselectAll, this.destroy = y.prototype.destroy, this.remove = y.prototype.remove, this.show = y.prototype.show, this.hide = y.prototype.hide, this.init()
            });

        function z(t) {
            var i, s = arguments,
                n = t;
            [].shift.apply(s);
            var o = this.each(function() {
                var t = e(this);
                if (t.is("select")) {
                    var o = t.data("selectpicker"),
                        l = "object" == typeof n && n;
                    if (o) {
                        if (l)
                            for (var r in l) l.hasOwnProperty(r) && (o.options[r] = l[r])
                    } else {
                        var c = e.extend({}, y.DEFAULTS, e.fn.selectpicker.defaults || {}, t.data(), l);
                        c.template = e.extend({}, y.DEFAULTS.template, e.fn.selectpicker.defaults ? e.fn.selectpicker.defaults.template : {}, t.data().template, l.template), t.data("selectpicker", o = new y(this, c))
                    }
                    "string" == typeof n && (i = o[n] instanceof Function ? o[n].apply(o, s) : o.options[n])
                }
            });
            return void 0 !== i ? i : o
        }
        y.VERSION = "1.13.1", y.DEFAULTS = {
            noneSelectedText: "Nothing selected",
            noneResultsText: "No results matched {0}",
            countSelectedText: function(e, t) {
                return 1 == e ? "{0} item selected" : "{0} items selected"
            },
            maxOptionsText: function(e, t) {
                return [1 == e ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", 1 == t ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"]
            },
            selectAllText: "Select All",
            deselectAllText: "Deselect All",
            doneButton: !1,
            doneButtonText: "Close",
            multipleSeparator: ", ",
            styleBase: "btn",
            style: "btn-default",
            size: "auto",
            title: null,
            selectedTextFormat: "values",
            width: !1,
            container: !1,
            hideDisabled: !1,
            showSubtext: !1,
            showIcon: !0,
            showContent: !0,
            dropupAuto: !0,
            header: !1,
            liveSearch: !1,
            liveSearchPlaceholder: null,
            liveSearchNormalize: !1,
            liveSearchStyle: "contains",
            actionsBox: !1,
            iconBase: "glyphicon",
            tickIcon: "glyphicon-ok",
            showTick: !1,
            template: {
                caret: '<span class="caret"></span>'
            },
            maxOptions: !1,
            mobile: !1,
            selectOnTab: !1,
            dropdownAlignRight: !1,
            windowPadding: 0,
            virtualScroll: 600
        }, "4" === $.major && (y.DEFAULTS.style = "btn-light", y.DEFAULTS.iconBase = "", y.DEFAULTS.tickIcon = "bs-ok-default"), y.prototype = {
            constructor: y,
            init: function() {
                var e = this,
                    t = this.$element.attr("id");
                this.$element.addClass("bs-select-hidden"), this.multiple = this.$element.prop("multiple"), this.autofocus = this.$element.prop("autofocus"), this.$newElement = this.createDropdown(), this.createLi(), this.$element.after(this.$newElement).prependTo(this.$newElement), this.$button = this.$newElement.children("button"), this.$menu = this.$newElement.children(".dropdown-menu"), this.$menuInner = this.$menu.children(".inner"), this.$searchbox = this.$menu.find("input"), this.$element.removeClass("bs-select-hidden"), !0 === this.options.dropdownAlignRight && this.$menu.addClass(C.MENURIGHT), void 0 !== t && this.$button.attr("data-id", t), this.checkDisabled(), this.clickListener(), this.options.liveSearch && this.liveSearchListener(), this.render(), this.setStyle(), this.setWidth(), this.options.container ? this.selectPosition() : this.$element.on("hide.bs.select", function() {
                    if (e.isVirtual()) {
                        var t = e.$menuInner[0],
                            i = t.firstChild.cloneNode(!1);
                        t.replaceChild(i, t.firstChild), t.scrollTop = 0
                    }
                }), this.$menu.data("this", this), this.$newElement.data("this", this), this.options.mobile && this.mobile(), this.$newElement.on({
                    "hide.bs.dropdown": function(t) {
                        e.$menuInner.attr("aria-expanded", !1), e.$element.trigger("hide.bs.select", t)
                    },
                    "hidden.bs.dropdown": function(t) {
                        e.$element.trigger("hidden.bs.select", t)
                    },
                    "show.bs.dropdown": function(t) {
                        e.$menuInner.attr("aria-expanded", !0), e.$element.trigger("show.bs.select", t)
                    },
                    "shown.bs.dropdown": function(t) {
                        e.$element.trigger("shown.bs.select", t)
                    }
                }), e.$element[0].hasAttribute("required") && this.$element.on("invalid", function() {
                    e.$button.addClass("bs-invalid"), e.$element.on({
                        "shown.bs.select": function() {
                            e.$element.val(e.$element.val()).off("shown.bs.select")
                        },
                        "rendered.bs.select": function() {
                            this.validity.valid && e.$button.removeClass("bs-invalid"), e.$element.off("rendered.bs.select")
                        }
                    }), e.$button.on("blur.bs.select", function() {
                        e.$element.focus().blur(), e.$button.off("blur.bs.select")
                    })
                }), setTimeout(function() {
                    e.$element.trigger("loaded.bs.select")
                })
            },
            createDropdown: function() {
                var t = this.multiple || this.options.showTick ? " show-tick" : "",
                    i = this.autofocus ? " autofocus" : "",
                    s = this.options.header ? '<div class="' + C.POPOVERHEADER + '"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>" : "",
                    n = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + m(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search"></div>' : "",
                    o = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn ' + C.BUTTONCLASS + '">' + this.options.selectAllText + '</button><button type="button" class="actions-btn bs-deselect-all btn ' + C.BUTTONCLASS + '">' + this.options.deselectAllText + "</button></div></div>" : "",
                    l = this.multiple && this.options.doneButton ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm ' + C.BUTTONCLASS + '">' + this.options.doneButtonText + "</button></div></div>" : "",
                    r = '<div class="dropdown bootstrap-select' + t + '"><button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + i + ' role="button"><div class="filter-option"><div class="filter-option-inner"><div class="filter-option-inner-inner"></div></div> </div>' + ("4" === $.major ? "" : '<span class="bs-caret">' + this.options.template.caret + "</span>") + '</button><div class="dropdown-menu ' + ("4" === $.major ? "" : C.SHOW) + '" role="combobox">' + s + n + o + '<div class="inner ' + C.SHOW + '" role="listbox" aria-expanded="false" tabindex="-1"><ul class="dropdown-menu inner ' + ("4" === $.major ? C.SHOW : "") + '"></ul></div>' + l + "</div></div>";
                return e(r)
            },
            setPositionData: function() {
                this.selectpicker.view.canHighlight = [];
                for (var e = 0; e < this.selectpicker.current.data.length; e++) {
                    var t = this.selectpicker.current.data[e],
                        i = !0;
                    "divider" === t.type ? (i = !1, t.height = this.sizeInfo.dividerHeight) : "optgroup-label" === t.type ? (i = !1, t.height = this.sizeInfo.dropdownHeaderHeight) : t.height = this.sizeInfo.liHeight, t.disabled && (i = !1), this.selectpicker.view.canHighlight.push(i), t.position = (0 === e ? 0 : this.selectpicker.current.data[e - 1].position) + t.height
                }
            },
            isVirtual: function() {
                return !1 !== this.options.virtualScroll && this.selectpicker.main.elements.length >= this.options.virtualScroll || !0 === this.options.virtualScroll
            },
            createView: function(t, i) {
                i = i || 0;
                var s = this;
                this.selectpicker.current = t ? this.selectpicker.search : this.selectpicker.main;
                var n, o, l = [];

                function r(e, i) {
                    var r, c, a, d, h, p, u, m, f, v = s.selectpicker.current.elements.length,
                        g = [],
                        b = void 0,
                        x = !0,
                        w = s.isVirtual();
                    s.selectpicker.view.scrollTop = e, !0 === w && s.sizeInfo.hasScrollBar && s.$menu[0].offsetWidth > s.sizeInfo.totalMenuWidth && (s.sizeInfo.menuWidth = s.$menu[0].offsetWidth, s.sizeInfo.totalMenuWidth = s.sizeInfo.menuWidth + s.sizeInfo.scrollBarWidth, s.$menu.css("min-width", s.sizeInfo.menuWidth)), r = Math.ceil(s.sizeInfo.menuInnerHeight / s.sizeInfo.liHeight * 1.5), c = Math.round(v / r) || 1;
                    for (var I = 0; I < c; I++) {
                        var k = (I + 1) * r;
                        if (I === c - 1 && (k = v), g[I] = [I * r + (I ? 1 : 0), k], !v) break;
                        void 0 === b && e <= s.selectpicker.current.data[k - 1].position - s.sizeInfo.menuInnerHeight && (b = I)
                    }
                    if (void 0 === b && (b = 0), h = [s.selectpicker.view.position0, s.selectpicker.view.position1], a = Math.max(0, b - 1), d = Math.min(c - 1, b + 1), s.selectpicker.view.position0 = Math.max(0, g[a][0]) || 0, s.selectpicker.view.position1 = Math.min(v, g[d][1]) || 0, p = h[0] !== s.selectpicker.view.position0 || h[1] !== s.selectpicker.view.position1, void 0 !== s.activeIndex && (o = s.selectpicker.current.elements[s.selectpicker.current.map.newIndex[s.prevActiveIndex]], l = s.selectpicker.current.elements[s.selectpicker.current.map.newIndex[s.activeIndex]], n = s.selectpicker.current.elements[s.selectpicker.current.map.newIndex[s.selectedIndex]], i && (s.activeIndex !== s.selectedIndex && (l.classList.remove("active"), l.firstChild && l.firstChild.classList.remove("active")), s.activeIndex = void 0), s.activeIndex && s.activeIndex !== s.selectedIndex && n && n.length && (n.classList.remove("active"), n.firstChild && n.firstChild.classList.remove("active"))), void 0 !== s.prevActiveIndex && s.prevActiveIndex !== s.activeIndex && s.prevActiveIndex !== s.selectedIndex && o && o.length && (o.classList.remove("active"), o.firstChild && o.firstChild.classList.remove("active")), (i || p) && (u = s.selectpicker.view.visibleElements ? s.selectpicker.view.visibleElements.slice() : [], s.selectpicker.view.visibleElements = s.selectpicker.current.elements.slice(s.selectpicker.view.position0, s.selectpicker.view.position1), s.setOptionStatus(), (t || !1 === w && i) && (m = u, f = s.selectpicker.view.visibleElements, x = !(m.length === f.length && m.every(function(e, t) {
                        return e === f[t]
                    }))), (i || !0 === w) && x)) {
                        var $, C, S = s.$menuInner[0],
                            E = document.createDocumentFragment(),
                            y = S.firstChild.cloneNode(!1),
                            z = !0 === w ? s.selectpicker.view.visibleElements : s.selectpicker.current.elements;
                        S.replaceChild(y, S.firstChild);
                        I = 0;
                        for (var O = z.length; I < O; I++) E.appendChild(z[I]);
                        !0 === w && ($ = 0 === s.selectpicker.view.position0 ? 0 : s.selectpicker.current.data[s.selectpicker.view.position0 - 1].position, C = s.selectpicker.view.position1 > v - 1 ? 0 : s.selectpicker.current.data[v - 1].position - s.selectpicker.current.data[s.selectpicker.view.position1 - 1].position, S.firstChild.style.marginTop = $ + "px", S.firstChild.style.marginBottom = C + "px"), S.firstChild.appendChild(E)
                    }
                    if (s.prevActiveIndex = s.activeIndex, s.options.liveSearch) {
                        if (t && i) {
                            var T, D = 0;
                            s.selectpicker.view.canHighlight[D] || (D = 1 + s.selectpicker.view.canHighlight.slice(1).indexOf(!0)), T = s.selectpicker.view.visibleElements[D], s.selectpicker.view.currentActive && (s.selectpicker.view.currentActive.classList.remove("active"), s.selectpicker.view.currentActive.firstChild && s.selectpicker.view.currentActive.firstChild.classList.remove("active")), T && (T.classList.add("active"), T.firstChild && T.firstChild.classList.add("active")), s.activeIndex = s.selectpicker.current.map.originalIndex[D]
                        }
                    } else s.$menuInner.focus()
                }
                this.setPositionData(), r(i, !0), this.$menuInner.off("scroll.createView").on("scroll.createView", function(e, t) {
                    s.noScroll || r(this.scrollTop, t), s.noScroll = !1
                }), e(window).off("resize.createView").on("resize.createView", function() {
                    r(s.$menuInner[0].scrollTop)
                })
            },
            createLi: function() {
                var t, i = this,
                    s = [],
                    n = 0,
                    o = 0,
                    l = [],
                    r = 0,
                    c = 0,
                    a = -1;
                this.selectpicker.view.titleOption || (this.selectpicker.view.titleOption = document.createElement("option"));
                var d = {
                        span: document.createElement("span"),
                        subtext: document.createElement("small"),
                        a: document.createElement("a"),
                        li: document.createElement("li"),
                        whitespace: document.createTextNode(" ")
                    },
                    h = d.span.cloneNode(!1),
                    p = document.createDocumentFragment();
                h.className = i.options.iconBase + " " + i.options.tickIcon + " check-mark", d.a.appendChild(h), d.a.setAttribute("role", "option"), d.subtext.className = "text-muted", d.text = d.span.cloneNode(!1), d.text.className = "text";
                var u = function(e, t, i, s) {
                        var n = d.li.cloneNode(!1);
                        return e && (1 === e.nodeType || 11 === e.nodeType ? n.appendChild(e) : n.innerHTML = e), void 0 !== i && "" !== i && (n.className = i), void 0 !== s && null !== s && n.classList.add("optgroup-" + s), n
                    },
                    f = function(e, t, i) {
                        var s = d.a.cloneNode(!0);
                        return e && (11 === e.nodeType ? s.appendChild(e) : s.insertAdjacentHTML("beforeend", e)), void 0 !== t & "" !== t && (s.className = t), "4" === $.major && s.classList.add("dropdown-item"), i && s.setAttribute("style", i), s
                    },
                    v = function(e) {
                        var t, s, n = d.text.cloneNode(!1);
                        if (e.optionContent) n.innerHTML = e.optionContent;
                        else {
                            if (n.textContent = e.text, e.optionIcon) {
                                var o = d.whitespace.cloneNode(!1);
                                (s = d.span.cloneNode(!1)).className = i.options.iconBase + " " + e.optionIcon, p.appendChild(s), p.appendChild(o)
                            }
                            e.optionSubtext && ((t = d.subtext.cloneNode(!1)).innerHTML = e.optionSubtext, n.appendChild(t))
                        }
                        return p.appendChild(n), p
                    };
                if (this.options.title && !this.multiple) {
                    a--;
                    var g = this.$element[0],
                        b = !1,
                        x = !this.selectpicker.view.titleOption.parentNode;
                    if (x) this.selectpicker.view.titleOption.className = "bs-title-option", this.selectpicker.view.titleOption.value = "", b = void 0 === e(g.options[g.selectedIndex]).attr("selected") && void 0 === this.$element.data("selected");
                    (x || 0 !== this.selectpicker.view.titleOption.index) && g.insertBefore(this.selectpicker.view.titleOption, g.firstChild), b && (g.selectedIndex = 0)
                }
                var w = this.$element.find("option");
                w.each(function(h) {
                    var g = e(this);
                    if (a++, !g.hasClass("bs-title-option")) {
                        var b, x, I = g.data(),
                            k = this.className || "",
                            $ = m(this.style.cssText),
                            S = I.content,
                            E = this.textContent,
                            y = I.tokens,
                            z = I.subtext,
                            O = I.icon,
                            T = g.parent(),
                            D = T[0],
                            H = "OPTGROUP" === D.tagName,
                            L = H && D.disabled,
                            A = this.disabled || L,
                            N = this.previousElementSibling && "OPTGROUP" === this.previousElementSibling.tagName,
                            P = T.data();
                        if (!0 === I.hidden || i.options.hideDisabled && (A && !H || L)) {
                            b = I.prevHiddenIndex, g.next().data("prevHiddenIndex", void 0 !== b ? b : h), a--, N || void 0 !== b && (F = w[b].previousElementSibling) && "OPTGROUP" === F.tagName && !F.disabled && (N = !0), N && "divider" !== l[l.length - 1].type && (a++, s.push(u(!1, 0, C.DIVIDER, r + "div")), l.push({
                                type: "divider",
                                optID: r,
                                originalIndex: h
                            }))
                        } else {
                            if (H && !0 !== I.divider) {
                                if (i.options.hideDisabled && A) {
                                    if (void 0 === P.allOptionsDisabled) {
                                        var W = T.children();
                                        T.data("allOptionsDisabled", W.filter(":disabled").length === W.length)
                                    }
                                    if (T.data("allOptionsDisabled")) return void a--
                                }
                                var R = " " + D.className || "";
                                if (!this.previousElementSibling) {
                                    r += 1;
                                    var B = D.label,
                                        M = m(B),
                                        U = P.subtext,
                                        j = P.icon;
                                    0 !== h && s.length > 0 && (a++, s.push(u(!1, 0, C.DIVIDER, r + "div")), l.push({
                                        type: "divider",
                                        optID: r,
                                        originalIndex: h
                                    })), a++;
                                    var V = function(e) {
                                        var t, s, n = d.text.cloneNode(!1);
                                        if (n.textContent = e.labelEscaped, e.labelIcon) {
                                            var o = d.whitespace.cloneNode(!1);
                                            (s = d.span.cloneNode(!1)).className = i.options.iconBase + " " + e.labelIcon, p.appendChild(s), p.appendChild(o)
                                        }
                                        return e.labelSubtext && ((t = d.subtext.cloneNode(!1)).textContent = e.labelSubtext, n.appendChild(t)), p.appendChild(n), p
                                    }({
                                        labelEscaped: M,
                                        labelSubtext: U,
                                        labelIcon: j
                                    });
                                    s.push(u(V, 0, "dropdown-header" + R, r)), l.push({
                                        content: M,
                                        subtext: U,
                                        type: "optgroup-label",
                                        optID: r,
                                        originalIndex: h
                                    }), c = a - 1
                                }
                                if (i.options.hideDisabled && A || !0 === I.hidden) return void a--;
                                x = v({
                                    text: E,
                                    optionContent: S,
                                    optionSubtext: z,
                                    optionIcon: O
                                }), s.push(u(f(x, "opt " + k + R, $), 0, "", r)), l.push({
                                    content: S || E,
                                    subtext: z,
                                    tokens: y,
                                    type: "option",
                                    optID: r,
                                    headerIndex: c,
                                    lastIndex: c + D.childElementCount,
                                    originalIndex: h,
                                    data: I
                                }), n++
                            } else if (!0 === I.divider) s.push(u(!1, 0, "divider")), l.push({
                                type: "divider",
                                originalIndex: h
                            });
                            else {
                                var F;
                                if (!N && i.options.hideDisabled)
                                    if (void 0 !== (b = I.prevHiddenIndex))(F = w[b].previousElementSibling) && "OPTGROUP" === F.tagName && !F.disabled && (N = !0);
                                N && "divider" !== l[l.length - 1].type && (a++, s.push(u(!1, 0, C.DIVIDER, r + "div")), l.push({
                                    type: "divider",
                                    optID: r,
                                    originalIndex: h
                                })), x = v({
                                    text: E,
                                    optionContent: S,
                                    optionSubtext: z,
                                    optionIcon: O
                                }), s.push(u(f(x, k, $))), l.push({
                                    content: S || E,
                                    subtext: z,
                                    tokens: y,
                                    type: "option",
                                    originalIndex: h,
                                    data: I
                                }), n++
                            }
                            i.selectpicker.main.map.newIndex[h] = a, i.selectpicker.main.map.originalIndex[a] = h;
                            var G = l[l.length - 1];
                            G.disabled = A;
                            var _ = 0;
                            G.content && (_ += G.content.length), G.subtext && (_ += G.subtext.length), O && (_ += 1), _ > o && (o = _, t = s[s.length - 1])
                        }
                    }
                }), this.selectpicker.main.elements = s, this.selectpicker.main.data = l, this.selectpicker.current = this.selectpicker.main, this.selectpicker.view.widestOption = t, this.selectpicker.view.availableOptionsCount = n
            },
            findLis: function() {
                return this.$menuInner.find(".inner > li")
            },
            render: function() {
                var e = this,
                    t = this.$element.find("option"),
                    i = [],
                    s = [];
                this.togglePlaceholder(), this.tabIndex();
                for (var n = 0, o = this.selectpicker.main.elements.length; n < o; n++) {
                    var l = t[this.selectpicker.main.map.originalIndex[n]];
                    if (l && l.selected && (i.push(l), s.length < 100 && "count" !== e.options.selectedTextFormat || 1 === i.length)) {
                        if (e.options.hideDisabled && (l.disabled || "OPTGROUP" === l.parentNode.tagName && l.parentNode.disabled)) return;
                        var r, c, a = this.selectpicker.main.data[n].data,
                            d = a.icon && e.options.showIcon ? '<i class="' + e.options.iconBase + " " + a.icon + '"></i> ' : "";
                        r = e.options.showSubtext && a.subtext && !e.multiple ? ' <small class="text-muted">' + a.subtext + "</small>" : "", c = l.title ? l.title : a.content && e.options.showContent ? a.content.toString() : d + l.innerHTML.trim() + r, s.push(c)
                    }
                }
                var h = this.multiple ? s.join(this.options.multipleSeparator) : s[0];
                if (i.length > 50 && (h += "..."), this.multiple && -1 !== this.options.selectedTextFormat.indexOf("count")) {
                    var p = this.options.selectedTextFormat.split(">");
                    if (p.length > 1 && i.length > p[1] || 1 === p.length && i.length >= 2) {
                        var u = this.selectpicker.view.availableOptionsCount;
                        h = ("function" == typeof this.options.countSelectedText ? this.options.countSelectedText(i.length, u) : this.options.countSelectedText).replace("{0}", i.length.toString()).replace("{1}", u.toString())
                    }
                }
                void 0 == this.options.title && (this.options.title = this.$element.attr("title")), "static" == this.options.selectedTextFormat && (h = this.options.title), h || (h = void 0 !== this.options.title ? this.options.title : this.options.noneSelectedText), this.$button[0].title = f(h.replace(/<[^>]*>?/g, "").trim()), this.$button.find(".filter-option-inner-inner")[0].innerHTML = h, this.$element.trigger("rendered.bs.select")
            },
            setStyle: function(e, t) {
                this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ""));
                var i = e || this.options.style;
                "add" == t ? this.$button.addClass(i) : "remove" == t ? this.$button.removeClass(i) : (this.$button.removeClass(this.options.style), this.$button.addClass(i))
            },
            liHeight: function(t) {
                if (t || !1 !== this.options.size && !this.sizeInfo) {
                    this.sizeInfo || (this.sizeInfo = {});
                    var i = document.createElement("div"),
                        s = document.createElement("div"),
                        n = document.createElement("div"),
                        o = document.createElement("ul"),
                        l = document.createElement("li"),
                        r = document.createElement("li"),
                        c = document.createElement("li"),
                        a = document.createElement("a"),
                        d = document.createElement("span"),
                        p = this.options.header && this.$menu.find("." + C.POPOVERHEADER).length > 0 ? this.$menu.find("." + C.POPOVERHEADER)[0].cloneNode(!0) : null,
                        u = this.options.liveSearch ? document.createElement("div") : null,
                        m = this.options.actionsBox && this.multiple && this.$menu.find(".bs-actionsbox").length > 0 ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0) : null,
                        f = this.options.doneButton && this.multiple && this.$menu.find(".bs-donebutton").length > 0 ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0) : null;
                    if (this.sizeInfo.selectWidth = this.$newElement[0].offsetWidth, d.className = "text", a.className = "dropdown-item", i.className = this.$menu[0].parentNode.className + " " + C.SHOW, i.style.width = this.sizeInfo.selectWidth + "px", s.className = "dropdown-menu " + C.SHOW, n.className = "inner " + C.SHOW, o.className = "dropdown-menu inner " + ("4" === $.major ? C.SHOW : ""), l.className = C.DIVIDER, r.className = "dropdown-header", d.appendChild(document.createTextNode("Inner text")), a.appendChild(d), c.appendChild(a), r.appendChild(d.cloneNode(!0)), this.selectpicker.view.widestOption && o.appendChild(this.selectpicker.view.widestOption.cloneNode(!0)), o.appendChild(c), o.appendChild(l), o.appendChild(r), p && s.appendChild(p), u) {
                        var v = document.createElement("input");
                        u.className = "bs-searchbox", v.className = "form-control", u.appendChild(v), s.appendChild(u)
                    }
                    m && s.appendChild(m), n.appendChild(o), s.appendChild(n), f && s.appendChild(f), i.appendChild(s), document.body.appendChild(i);
                    var g, b = a.offsetHeight,
                        x = r ? r.offsetHeight : 0,
                        w = p ? p.offsetHeight : 0,
                        I = u ? u.offsetHeight : 0,
                        k = m ? m.offsetHeight : 0,
                        S = f ? f.offsetHeight : 0,
                        E = e(l).outerHeight(!0),
                        y = !!window.getComputedStyle && window.getComputedStyle(s),
                        z = s.offsetWidth,
                        O = y ? null : e(s),
                        T = {
                            vert: h(y ? y.paddingTop : O.css("paddingTop")) + h(y ? y.paddingBottom : O.css("paddingBottom")) + h(y ? y.borderTopWidth : O.css("borderTopWidth")) + h(y ? y.borderBottomWidth : O.css("borderBottomWidth")),
                            horiz: h(y ? y.paddingLeft : O.css("paddingLeft")) + h(y ? y.paddingRight : O.css("paddingRight")) + h(y ? y.borderLeftWidth : O.css("borderLeftWidth")) + h(y ? y.borderRightWidth : O.css("borderRightWidth"))
                        },
                        D = {
                            vert: T.vert + h(y ? y.marginTop : O.css("marginTop")) + h(y ? y.marginBottom : O.css("marginBottom")) + 2,
                            horiz: T.horiz + h(y ? y.marginLeft : O.css("marginLeft")) + h(y ? y.marginRight : O.css("marginRight")) + 2
                        };
                    n.style.overflowY = "scroll", g = s.offsetWidth - z, document.body.removeChild(i), this.sizeInfo.liHeight = b, this.sizeInfo.dropdownHeaderHeight = x, this.sizeInfo.headerHeight = w, this.sizeInfo.searchHeight = I, this.sizeInfo.actionsHeight = k, this.sizeInfo.doneButtonHeight = S, this.sizeInfo.dividerHeight = E, this.sizeInfo.menuPadding = T, this.sizeInfo.menuExtras = D, this.sizeInfo.menuWidth = z, this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth, this.sizeInfo.scrollBarWidth = g, this.sizeInfo.selectHeight = this.$newElement[0].offsetHeight, this.setPositionData()
                }
            },
            getSelectPosition: function() {
                var t, i = e(window),
                    s = this.$newElement.offset(),
                    n = e(this.options.container);
                this.options.container && !n.is("body") ? ((t = n.offset()).top += parseInt(n.css("borderTopWidth")), t.left += parseInt(n.css("borderLeftWidth"))) : t = {
                    top: 0,
                    left: 0
                };
                var o = this.options.windowPadding;
                this.sizeInfo.selectOffsetTop = s.top - t.top - i.scrollTop(), this.sizeInfo.selectOffsetBot = i.height() - this.sizeInfo.selectOffsetTop - this.sizeInfo.selectHeight - t.top - o[2], this.sizeInfo.selectOffsetLeft = s.left - t.left - i.scrollLeft(), this.sizeInfo.selectOffsetRight = i.width() - this.sizeInfo.selectOffsetLeft - this.sizeInfo.selectWidth - t.left - o[1], this.sizeInfo.selectOffsetTop -= o[0], this.sizeInfo.selectOffsetLeft -= o[3]
            },
            setMenuSize: function(e) {
                this.getSelectPosition();
                var t, i, s, n, o, l, r, c = this.sizeInfo.selectWidth,
                    a = this.sizeInfo.liHeight,
                    d = this.sizeInfo.headerHeight,
                    h = this.sizeInfo.searchHeight,
                    p = this.sizeInfo.actionsHeight,
                    u = this.sizeInfo.doneButtonHeight,
                    m = this.sizeInfo.dividerHeight,
                    f = this.sizeInfo.menuPadding,
                    v = 0;
                if (this.options.dropupAuto && (r = a * this.selectpicker.current.elements.length + f.vert, this.$newElement.toggleClass(C.DROPUP, this.sizeInfo.selectOffsetTop - this.sizeInfo.selectOffsetBot > this.sizeInfo.menuExtras.vert && r + this.sizeInfo.menuExtras.vert + 50 > this.sizeInfo.selectOffsetBot)), "auto" === this.options.size) n = this.selectpicker.current.elements.length > 3 ? 3 * this.sizeInfo.liHeight + this.sizeInfo.menuExtras.vert - 2 : 0, i = this.sizeInfo.selectOffsetBot - this.sizeInfo.menuExtras.vert, s = n + d + h + p + u, l = Math.max(n - f.vert, 0), this.$newElement.hasClass(C.DROPUP) && (i = this.sizeInfo.selectOffsetTop - this.sizeInfo.menuExtras.vert), o = i, t = i - d - h - p - u - f.vert;
                else if (this.options.size && "auto" != this.options.size && this.selectpicker.current.elements.length > this.options.size) {
                    for (var g = 0; g < this.options.size; g++) "divider" === this.selectpicker.current.data[g].type && v++;
                    t = (i = a * this.options.size + v * m + f.vert) - f.vert, o = i + d + h + p + u, s = l = ""
                }
                "auto" === this.options.dropdownAlignRight && this.$menu.toggleClass(C.MENURIGHT, this.sizeInfo.selectOffsetLeft > this.sizeInfo.selectOffsetRight && this.sizeInfo.selectOffsetRight < this.$menu[0].offsetWidth - c), this.$menu.css({
                    "max-height": o + "px",
                    overflow: "hidden",
                    "min-height": s + "px"
                }), this.$menuInner.css({
                    "max-height": t + "px",
                    "overflow-y": "auto",
                    "min-height": l + "px"
                }), this.sizeInfo.menuInnerHeight = t, this.selectpicker.current.data.length && this.selectpicker.current.data[this.selectpicker.current.data.length - 1].position > this.sizeInfo.menuInnerHeight && (this.sizeInfo.hasScrollBar = !0, this.sizeInfo.totalMenuWidth = this.sizeInfo.menuWidth + this.sizeInfo.scrollBarWidth, this.$menu.css("min-width", this.sizeInfo.totalMenuWidth)), this.dropdown && this.dropdown._popper && this.dropdown._popper.update()
            },
            setSize: function(t) {
                if (this.liHeight(t), this.options.header && this.$menu.css("padding-top", 0), !1 !== this.options.size) {
                    var i, s = this,
                        n = e(window),
                        o = 0;
                    this.setMenuSize(), "auto" === this.options.size ? (this.$searchbox.off("input.setMenuSize propertychange.setMenuSize").on("input.setMenuSize propertychange.setMenuSize", function() {
                        return s.setMenuSize()
                    }), n.off("resize.setMenuSize scroll.setMenuSize").on("resize.setMenuSize scroll.setMenuSize", function() {
                        return s.setMenuSize()
                    })) : this.options.size && "auto" != this.options.size && this.selectpicker.current.elements.length > this.options.size && (this.$searchbox.off("input.setMenuSize propertychange.setMenuSize"), n.off("resize.setMenuSize scroll.setMenuSize")), t ? o = this.$menuInner[0].scrollTop : s.multiple || "number" == typeof(i = s.selectpicker.main.map.newIndex[s.$element[0].selectedIndex]) && !1 !== s.options.size && (o = (o = s.sizeInfo.liHeight * i) - s.sizeInfo.menuInnerHeight / 2 + s.sizeInfo.liHeight / 2), s.createView(!1, o)
                }
            },
            setWidth: function() {
                var e = this;
                "auto" === this.options.width ? requestAnimationFrame(function() {
                    e.$menu.css("min-width", "0"), e.liHeight(), e.setMenuSize();
                    var t = e.$newElement.clone().appendTo("body"),
                        i = t.css("width", "auto").children("button").outerWidth();
                    t.remove(), e.sizeInfo.selectWidth = Math.max(e.sizeInfo.totalMenuWidth, i), e.$newElement.css("width", e.sizeInfo.selectWidth + "px")
                }) : "fit" === this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", "")), this.$newElement.hasClass("fit-width") && "fit" !== this.options.width && this.$newElement.removeClass("fit-width")
            },
            selectPosition: function() {
                this.$bsContainer = e('<div class="bs-container" />');
                var t, i, s, n = this,
                    o = e(this.options.container),
                    l = function(e) {
                        var l = {};
                        n.$bsContainer.addClass(e.attr("class").replace(/form-control|fit-width/gi, "")).toggleClass(C.DROPUP, e.hasClass(C.DROPUP)), t = e.offset(), o.is("body") ? i = {
                            top: 0,
                            left: 0
                        } : ((i = o.offset()).top += parseInt(o.css("borderTopWidth")) - o.scrollTop(), i.left += parseInt(o.css("borderLeftWidth")) - o.scrollLeft()), s = e.hasClass(C.DROPUP) ? 0 : e[0].offsetHeight, $.major < 4 && (l.top = t.top - i.top + s, l.left = t.left - i.left), l.width = e[0].offsetWidth, n.$bsContainer.css(l)
                    };
                this.$button.on("click.bs.dropdown.data-api", function() {
                    n.isDisabled() || (l(n.$newElement), n.$bsContainer.appendTo(n.options.container).toggleClass(C.SHOW, !n.$button.hasClass(C.SHOW)).append(n.$menu))
                }), e(window).on("resize scroll", function() {
                    l(n.$newElement)
                }), this.$element.on("hide.bs.select", function() {
                    n.$menu.data("height", n.$menu.height()), n.$bsContainer.detach()
                })
            },
            setOptionStatus: function() {
                var e = this,
                    t = this.$element.find("option");
                if (e.noScroll = !1, e.selectpicker.view.visibleElements && e.selectpicker.view.visibleElements.length)
                    for (var i = 0; i < e.selectpicker.view.visibleElements.length; i++) {
                        var s = e.selectpicker.current.map.originalIndex[i + e.selectpicker.view.position0],
                            n = t[s];
                        if (n) {
                            var o = this.selectpicker.main.map.newIndex[s],
                                l = this.selectpicker.main.elements[o];
                            e.setDisabled(s, n.disabled || "OPTGROUP" === n.parentNode.tagName && n.parentNode.disabled, o, l), e.setSelected(s, n.selected, o, l)
                        }
                    }
            },
            setSelected: function(e, t, i, s) {
                var n, o, l, r = void 0 !== this.activeIndex,
                    c = this.activeIndex === e || t && !this.multiple && !r;
                i || (i = this.selectpicker.main.map.newIndex[e]), s || (s = this.selectpicker.main.elements[i]), l = s.firstChild, t && (this.selectedIndex = e), s.classList.toggle("selected", t), s.classList.toggle("active", c), c && (this.selectpicker.view.currentActive = s, this.activeIndex = e), l && (l.classList.toggle("selected", t), l.classList.toggle("active", c), l.setAttribute("aria-selected", t)), c || !r && t && void 0 !== this.prevActiveIndex && (n = this.selectpicker.main.map.newIndex[this.prevActiveIndex], (o = this.selectpicker.main.elements[n]).classList.remove("selected"), o.classList.remove("active"), o.firstChild && (o.firstChild.classList.remove("selected"), o.firstChild.classList.remove("active")))
            },
            setDisabled: function(e, t, i, s) {
                var n;
                i || (i = this.selectpicker.main.map.newIndex[e]), s || (s = this.selectpicker.main.elements[i]), n = s.firstChild, s.classList.toggle(C.DISABLED, t), n && ("4" === $.major && n.classList.toggle(C.DISABLED, t), n.setAttribute("aria-disabled", t), t ? n.setAttribute("tabindex", -1) : n.setAttribute("tabindex", 0))
            },
            isDisabled: function() {
                return this.$element[0].disabled
            },
            checkDisabled: function() {
                var e = this;
                this.isDisabled() ? (this.$newElement.addClass(C.DISABLED), this.$button.addClass(C.DISABLED).attr("tabindex", -1).attr("aria-disabled", !0)) : (this.$button.hasClass(C.DISABLED) && (this.$newElement.removeClass(C.DISABLED), this.$button.removeClass(C.DISABLED).attr("aria-disabled", !1)), -1 != this.$button.attr("tabindex") || this.$element.data("tabindex") || this.$button.removeAttr("tabindex")), this.$button.click(function() {
                    return !e.isDisabled()
                })
            },
            togglePlaceholder: function() {
                var e = this.$element[0],
                    t = e.selectedIndex,
                    i = -1 === t;
                i || e.options[t].value || (i = !0), this.$button.toggleClass("bs-placeholder", i)
            },
            tabIndex: function() {
                this.$element.data("tabindex") !== this.$element.attr("tabindex") && -98 !== this.$element.attr("tabindex") && "-98" !== this.$element.attr("tabindex") && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex"))), this.$element.attr("tabindex", -98)
            },
            clickListener: function() {
                var t = this,
                    i = e(document);
                i.data("spaceSelect", !1), this.$button.on("keyup", function(e) {
                    /(32)/.test(e.keyCode.toString(10)) && i.data("spaceSelect") && (e.preventDefault(), i.data("spaceSelect", !1))
                }), this.$newElement.on("show.bs.dropdown", function() {
                    $.major > 3 && !t.dropdown && (t.dropdown = t.$button.data("bs.dropdown"), t.dropdown._menu = t.$menu[0])
                }), this.$button.on("click.bs.dropdown.data-api", function() {
                    t.$newElement.hasClass(C.SHOW) || t.setSize()
                }), this.$element.on("shown.bs.select", function() {
                    t.$menuInner[0].scrollTop !== t.selectpicker.view.scrollTop && (t.$menuInner[0].scrollTop = t.selectpicker.view.scrollTop), t.options.liveSearch ? t.$searchbox.focus() : t.$menuInner.focus()
                }), this.$menuInner.on("click", "li a", function(i, s) {
                    var n = e(this),
                        o = t.isVirtual() ? t.selectpicker.view.position0 : 0,
                        r = t.selectpicker.current.map.originalIndex[n.parent().index() + o],
                        a = l(t.$element[0]),
                        d = t.$element.prop("selectedIndex"),
                        h = !0;
                    if (t.multiple && 1 !== t.options.maxOptions && i.stopPropagation(), i.preventDefault(), !t.isDisabled() && !n.parent().hasClass(C.DISABLED)) {
                        var p = t.$element.find("option"),
                            u = p.eq(r),
                            m = u.prop("selected"),
                            f = u.parent("optgroup"),
                            v = t.options.maxOptions,
                            g = f.data("maxOptions") || !1;
                        if (r === t.activeIndex && (s = !0), s || (t.prevActiveIndex = t.activeIndex, t.activeIndex = void 0), t.multiple) {
                            if (u.prop("selected", !m), t.setSelected(r, !m), n.blur(), !1 !== v || !1 !== g) {
                                var b = v < p.filter(":selected").length,
                                    x = g < f.find("option:selected").length;
                                if (v && b || g && x)
                                    if (v && 1 == v) p.prop("selected", !1), u.prop("selected", !0), t.$menuInner.find(".selected").removeClass("selected"), t.setSelected(r, !0);
                                    else if (g && 1 == g) {
                                        f.find("option:selected").prop("selected", !1), u.prop("selected", !0);
                                        var w = t.selectpicker.current.data[n.parent().index() + t.selectpicker.view.position0].optID;
                                        t.$menuInner.find(".optgroup-" + w).removeClass("selected"), t.setSelected(r, !0)
                                    } else {
                                        var I = "string" == typeof t.options.maxOptionsText ? [t.options.maxOptionsText, t.options.maxOptionsText] : t.options.maxOptionsText,
                                            k = "function" == typeof I ? I(v, g) : I,
                                            $ = k[0].replace("{n}", v),
                                            S = k[1].replace("{n}", g),
                                            E = e('<div class="notify"></div>');
                                        k[2] && ($ = $.replace("{var}", k[2][v > 1 ? 0 : 1]), S = S.replace("{var}", k[2][g > 1 ? 0 : 1])), u.prop("selected", !1), t.$menu.append(E), v && b && (E.append(e("<div>" + $ + "</div>")), h = !1, t.$element.trigger("maxReached.bs.select")), g && x && (E.append(e("<div>" + S + "</div>")), h = !1, t.$element.trigger("maxReachedGrp.bs.select")), setTimeout(function() {
                                            t.setSelected(r, !1)
                                        }, 10), E.delay(750).fadeOut(300, function() {
                                            e(this).remove()
                                        })
                                    }
                            }
                        } else p.prop("selected", !1), u.prop("selected", !0), t.setSelected(r, !0);
                        !t.multiple || t.multiple && 1 === t.options.maxOptions ? t.$button.focus() : t.options.liveSearch && t.$searchbox.focus(), h && (a != l(t.$element[0]) && t.multiple || d != t.$element.prop("selectedIndex") && !t.multiple) && (c = [r, u.prop("selected"), a], t.$element.triggerNative("change"))
                    }
                }), this.$menu.on("click", "li." + C.DISABLED + " a, ." + C.POPOVERHEADER + ", ." + C.POPOVERHEADER + " :not(.close)", function(i) {
                    i.currentTarget == this && (i.preventDefault(), i.stopPropagation(), t.options.liveSearch && !e(i.target).hasClass("close") ? t.$searchbox.focus() : t.$button.focus())
                }), this.$menuInner.on("click", ".divider, .dropdown-header", function(e) {
                    e.preventDefault(), e.stopPropagation(), t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus()
                }), this.$menu.on("click", "." + C.POPOVERHEADER + " .close", function() {
                    t.$button.click()
                }), this.$searchbox.on("click", function(e) {
                    e.stopPropagation()
                }), this.$menu.on("click", ".actions-btn", function(i) {
                    t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus(), i.preventDefault(), i.stopPropagation(), e(this).hasClass("bs-select-all") ? t.selectAll() : t.deselectAll()
                }), this.$element.on({
                    change: function() {
                        t.render(), t.$element.trigger("changed.bs.select", c), c = null
                    },
                    focus: function() {
                        t.$button.focus()
                    }
                })
            },
            liveSearchListener: function() {
                var e = this,
                    t = document.createElement("li");
                this.$button.on("click.bs.dropdown.data-api", function() {
                    e.$searchbox.val() && e.$searchbox.val("")
                }), this.$searchbox.on("click.bs.dropdown.data-api focus.bs.dropdown.data-api touchend.bs.dropdown.data-api", function(e) {
                    e.stopPropagation()
                }), this.$searchbox.on("input propertychange", function() {
                    var i = e.$searchbox.val();
                    if (e.selectpicker.search.map.newIndex = {}, e.selectpicker.search.map.originalIndex = {}, e.selectpicker.search.elements = [], e.selectpicker.search.data = [], i) {
                        var s = [],
                            n = i.toUpperCase(),
                            o = {},
                            l = [],
                            r = e._searchStyle(),
                            c = e.options.liveSearchNormalize;
                        e._$lisSelected = e.$menuInner.find(".selected");
                        for (var a = 0; a < e.selectpicker.main.data.length; a++) {
                            var h = e.selectpicker.main.data[a];
                            o[a] || (o[a] = d(h, n, r, c)), o[a] && void 0 !== h.headerIndex && -1 === l.indexOf(h.headerIndex) && (h.headerIndex > 0 && (o[h.headerIndex - 1] = !0, l.push(h.headerIndex - 1)), o[h.headerIndex] = !0, l.push(h.headerIndex), o[h.lastIndex + 1] = !0), o[a] && "optgroup-label" !== h.type && l.push(a)
                        }
                        a = 0;
                        for (var p = l.length; a < p; a++) {
                            var u = l[a],
                                f = l[a - 1],
                                v = (h = e.selectpicker.main.data[u], e.selectpicker.main.data[f]);
                            ("divider" !== h.type || "divider" === h.type && v && "divider" !== v.type && p - 1 !== a) && (e.selectpicker.search.data.push(h), s.push(e.selectpicker.main.elements[u]), e.selectpicker.search.map.newIndex[h.originalIndex] = s.length - 1, e.selectpicker.search.map.originalIndex[s.length - 1] = h.originalIndex)
                        }
                        e.activeIndex = void 0, e.noScroll = !0, e.$menuInner.scrollTop(0), e.selectpicker.search.elements = s, e.createView(!0), s.length || (t.className = "no-results", t.innerHTML = e.options.noneResultsText.replace("{0}", '"' + m(i) + '"'), e.$menuInner[0].firstChild.appendChild(t))
                    } else e.$menuInner.scrollTop(0), e.createView(!1)
                })
            },
            _searchStyle: function() {
                return this.options.liveSearchStyle || "contains"
            },
            val: function(e) {
                return void 0 !== e ? (this.$element.val(e).triggerNative("change"), this.$element) : this.$element.val()
            },
            changeAll: function(e) {
                if (this.multiple) {
                    void 0 === e && (e = !0);
                    var t = this.$element.find("option"),
                        i = 0,
                        s = 0,
                        n = l(this.$element[0]);
                    this.$element.addClass("bs-select-hidden");
                    for (var o = 0; o < this.selectpicker.current.elements.length; o++) {
                        var r = t[this.selectpicker.current.map.originalIndex[o]];
                        r && (r.selected && i++, r.selected = e, r.selected && s++)
                    }
                    this.$element.removeClass("bs-select-hidden"), i !== s && (this.setOptionStatus(), this.togglePlaceholder(), c = [null, null, n], this.$element.triggerNative("change"))
                }
            },
            selectAll: function() {
                return this.changeAll(!0)
            },
            deselectAll: function() {
                return this.changeAll(!1)
            },
            toggle: function(e) {
                (e = e || window.event) && e.stopPropagation(), this.$button.trigger("click.bs.dropdown.data-api")
            },
            keydown: function(t) {
                var i, s, n, o, l, r = e(this),
                    c = (r.is("input") ? r.parent().parent() : r.parent()).data("this"),
                    a = c.findLis(),
                    h = !1,
                    p = t.which === w && !r.hasClass("dropdown-toggle") && !c.options.selectOnTab,
                    u = S.test(t.which) || p,
                    m = c.$menuInner[0].scrollTop,
                    f = c.isVirtual(),
                    $ = !0 === f ? c.selectpicker.view.position0 : 0;
                if (!(s = c.$newElement.hasClass(C.SHOW)) && (u || t.which >= 48 && t.which <= 57 || t.which >= 96 && t.which <= 105 || t.which >= 65 && t.which <= 90) && c.$button.trigger("click.bs.dropdown.data-api"), t.which === g && s && (t.preventDefault(), c.$button.trigger("click.bs.dropdown.data-api").focus()), u) {
                    if (!a.length) return;
                    void 0 === (i = !0 === f ? a.index(a.filter(".active")) : c.selectpicker.current.map.newIndex[c.activeIndex]) && (i = -1), -1 !== i && ((n = c.selectpicker.current.elements[i + $]).classList.remove("active"), n.firstChild && n.firstChild.classList.remove("active")), t.which === I ? (-1 !== i && i--, i + $ < 0 && (i += a.length), c.selectpicker.view.canHighlight[i + $] || -1 === (i = c.selectpicker.view.canHighlight.slice(0, i + $).lastIndexOf(!0) - $) && (i = a.length - 1)) : (t.which === k || p) && (++i + $ >= c.selectpicker.view.canHighlight.length && (i = 0), c.selectpicker.view.canHighlight[i + $] || (i = i + 1 + c.selectpicker.view.canHighlight.slice(i + $ + 1).indexOf(!0))), t.preventDefault();
                    var y = $ + i;
                    t.which === I ? 0 === $ && i === a.length - 1 ? (c.$menuInner[0].scrollTop = c.$menuInner[0].scrollHeight, y = c.selectpicker.current.elements.length - 1) : h = (l = (o = c.selectpicker.current.data[y]).position - o.height) < m : (t.which === k || p) && (0 !== $ && 0 === i ? (c.$menuInner[0].scrollTop = 0, y = 0) : h = (l = (o = c.selectpicker.current.data[y]).position - c.sizeInfo.menuInnerHeight) > m), (n = c.selectpicker.current.elements[y]).classList.add("active"), n.firstChild && n.firstChild.classList.add("active"), c.activeIndex = c.selectpicker.current.map.originalIndex[y], c.selectpicker.view.currentActive = n, h && (c.$menuInner[0].scrollTop = l), c.options.liveSearch ? c.$searchbox.focus() : r.focus()
                } else if (!r.is("input") && !E.test(t.which) || t.which === x && c.selectpicker.keydown.keyHistory) {
                    var z, O, T = [];
                    t.preventDefault(), c.selectpicker.keydown.keyHistory += v[t.which], c.selectpicker.keydown.resetKeyHistory.cancel && clearTimeout(c.selectpicker.keydown.resetKeyHistory.cancel), c.selectpicker.keydown.resetKeyHistory.cancel = c.selectpicker.keydown.resetKeyHistory.start(), O = c.selectpicker.keydown.keyHistory, /^(.)\1+$/.test(O) && (O = O.charAt(0));
                    for (var D = 0; D < c.selectpicker.current.data.length; D++) {
                        var H = c.selectpicker.current.data[D];
                        d(H, O, "startsWith", !0) && c.selectpicker.view.canHighlight[D] && (H.index = D, T.push(H.originalIndex))
                    }
                    if (T.length) {
                        var L = 0;
                        a.removeClass("active").find("a").removeClass("active"), 1 === O.length && (-1 === (L = T.indexOf(c.activeIndex)) || L === T.length - 1 ? L = 0 : L++), z = c.selectpicker.current.map.newIndex[T[L]], m - (o = c.selectpicker.current.data[z]).position > 0 ? (l = o.position - o.height, h = !0) : (l = o.position - c.sizeInfo.menuInnerHeight, h = o.position > m + c.sizeInfo.menuInnerHeight), (n = c.selectpicker.current.elements[z]).classList.add("active"), n.firstChild && n.firstChild.classList.add("active"), c.activeIndex = T[L], n.firstChild.focus(), h && (c.$menuInner[0].scrollTop = l), r.focus()
                    }
                }
                s && (t.which === x && !c.selectpicker.keydown.keyHistory || t.which === b || t.which === w && c.options.selectOnTab) && (t.which !== x && t.preventDefault(), c.options.liveSearch && t.which === x || (c.$menuInner.find(".active a").trigger("click", !0), r.focus(), c.options.liveSearch || (t.preventDefault(), e(document).data("spaceSelect", !0))))
            },
            mobile: function() {
                this.$element.addClass("mobile-device")
            },
            refresh: function() {
                var t = e.extend({}, this.options, this.$element.data());
                this.options = t, this.selectpicker.main.map.newIndex = {}, this.selectpicker.main.map.originalIndex = {}, this.createLi(), this.checkDisabled(), this.render(), this.setStyle(), this.setWidth(), this.setSize(!0), this.$element.trigger("refreshed.bs.select")
            },
            hide: function() {
                this.$newElement.hide()
            },
            show: function() {
                this.$newElement.show()
            },
            remove: function() {
                this.$newElement.remove(), this.$element.remove()
            },
            destroy: function() {
                this.$newElement.before(this.$element).remove(), this.$bsContainer ? this.$bsContainer.remove() : this.$menu.remove(), this.$element.off(".bs.select").removeData("selectpicker").removeClass("bs-select-hidden selectpicker")
            }
        };
        var O = e.fn.selectpicker;
        e.fn.selectpicker = z, e.fn.selectpicker.Constructor = y, e.fn.selectpicker.noConflict = function() {
            return e.fn.selectpicker = O, this
        }, e(document).off("keydown.bs.dropdown.data-api").on("keydown.bs.select", '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bs-searchbox input', y.prototype.keydown).on("focusin.modal", '.bootstrap-select [data-toggle="dropdown"], .bootstrap-select [role="listbox"], .bs-searchbox input', function(e) {
            e.stopPropagation()
        }), e(window).on("load.bs.select.data-api", function() {
            e(".selectpicker").each(function() {
                var t = e(this);
                z.call(t, t.data())
            })
        })
    }(e)
});