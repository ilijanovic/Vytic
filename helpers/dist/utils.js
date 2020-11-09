"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.updateProps = exports.updateChildrens = exports.getPosition = exports.uniqueStylesheet = exports.addCSS = exports.generateId = exports.looseRef = exports.objectKeysToUppercase = exports.updateAttributes = exports.updateStylings = exports.updateClasses = exports.addAttributes = exports.removeHandlers = exports.addHandlers = exports.nextTick = exports.insertElement = exports.deleteElement = exports.parseStringToElement = exports.formatText = exports.collectAttributes = void 0;
var reactivity_1 = require("./reactivity");
/**
 * Collects all attributes from an element.
 *
 * @param {HTMLElement} element - Element where the attributes gets collected
 * @returns {Object} - Returns Object that contains data / state about the element
 */
function collectAttributes(element) {
    return Array.from(element.attributes, function (_a) {
        var name = _a.name, value = _a.value;
        return [
            name,
            value,
        ];
    }).reduce(function (a, _a) {
        var key = _a[0], val = _a[1];
        if (key.includes("@")) {
            var handlerName = key.replace("@", "");
            a.handlers.push([handlerName, val]);
        }
        else if (key.startsWith("s:")) {
            var styleProp = key.replace("s:", "");
            a.bindedStyle.push([styleProp, val]);
        }
        else if (key.startsWith("c:")) {
            var classProp = key.replace("c:", "");
            a.bindedClasses.push([classProp, val]);
        }
        else if (key.startsWith("a:")) {
            var attributeProp = key.replace("a:", "");
            a.bindedAttr.push([attributeProp, val]);
        }
        else if (key === "if") {
            a.show = val;
        }
        else if (key.startsWith("p:")) {
            var prop = key.replace("p:", "");
            a.props[prop] = val;
        }
        else if (key.startsWith("loop")) {
            a.loop = val.split("-");
        }
        else {
            a.attr.push([key, val]);
        }
        return a;
    }, {
        attr: [],
        handlers: [],
        bindedStyle: [],
        bindedAttr: [],
        bindedClasses: [],
        show: null,
        visible: true,
        props: {},
        loop: null,
        parent: element.parentElement,
        index: element.parentElement ? Array.prototype.indexOf.call(element.parentElement.children, element) : 0
    });
}
exports.collectAttributes = collectAttributes;
/**
 * Formats an string that it can be parsed later with "parseString"
 *
 * @param {String} text - String that needs to be formatted
 * @returns {string} - Returns formatted string
 */
function formatText(text) {
    if (!text)
        return {
            staticNode: true,
            text: ""
        };
    var expressions = text === null || text === void 0 ? void 0 : text.match(/({{)(.*?)(}})/g);
    if (!expressions)
        return { text: text.replace(/\n/g, "").trim(), staticNode: true };
    expressions.forEach(function (exp) {
        var varname = exp.match(/(?<={{)(.*?)(?=}})/)[0].trim();
        text = '"' + text.replace(exp, "\" + " + varname + " +\"") + '"';
    });
    return {
        text: text.replace(/\n/g, ""),
        staticNode: false
    };
}
exports.formatText = formatText;
/**
 *  Parses an string to an element
 *
 * @param {string} template - HTML markup as an string
 * @returns {Element} - Returns an HTML element
 */
function parseStringToElement(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    return div.children[0];
}
exports.parseStringToElement = parseStringToElement;
/**
 * Deletes an element out of the DOM
 *
 * @param {HTMLElement} element - Element that will be deleted
 */
function deleteElement(element, parent) {
    parent.removeChild(element);
}
exports.deleteElement = deleteElement;
/**
 * Inserts an element on a specific position
 * By default it inserts it at index 0
 *
 * @param {HTMLElement} element - Element that will be inserted
 * @param {HTMLElement} parent - Parent element
 * @param {number} index - Position of the element in the parent element
 */
function insertElement(element, parent, index) {
    if (index === void 0) { index = 0; }
    parent.insertBefore(element, parent.children[index]);
}
exports.insertElement = insertElement;
/**
 * Waits for the next request frame
 *
 * @returns {Promise<number>} - Resolves an request ID number
 */
function nextTick() {
    return new Promise(function (res) { return requestAnimationFrame(res); });
}
exports.nextTick = nextTick;
/**
 * Attaches event handler to an element
 *
 * @param {string[][]} handlers - Array filled with event / name subarrays [event, handler]
 * @param {Object} methods - Object that contains all methods
 * @param {Element} element - Element where the event handlers will be attached
 */
function addHandlers(handlers, methods, element, heap) {
    handlers.forEach(function (_a) {
        var handler = _a[0], method = _a[1];
        element.addEventListener(handler, typeof methods[method] === "function" ? heap[method] : function () {
            var objectKeyNames = Object.keys(heap).toString();
            new Function("let { " + objectKeyNames + " } = this;   " + method + ";  return this").call(heap);
        }, { passive: true });
    });
}
exports.addHandlers = addHandlers;
function removeHandlers(handlers, element, heap) {
    handlers.forEach(function (_a) {
        var handler = _a[0], method = _a[1];
        element.removeEventListener(handler, heap[method]);
    });
}
exports.removeHandlers = removeHandlers;
/**
 * Adds static attributes to an element
 *
 * @param {string[][]} attributes - Array filled with attribute / value subarrays [attribute, value]
 * @param {Element} element - Element where the attributes will be set
 */
function addAttributes(attributes, element) {
    attributes.forEach(function (_a) {
        var attribute = _a[0], value = _a[1];
        element.setAttribute(attribute, value);
    });
}
exports.addAttributes = addAttributes;
/**
 * Updates binded classes
 *
 * @param {string[][]} classes - Array filled with classname / value subarrays [classname, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the classes will be added / removed
 */
function updateClasses(classes, data, element) {
    classes.forEach(function (_a) {
        var cl = _a[0], value = _a[1];
        var status = !!reactivity_1.parseString(value, data);
        if (status) {
            element.classList.add(cl);
        }
        else {
            element.classList.remove(cl);
        }
    });
}
exports.updateClasses = updateClasses;
/**
 * Updates binded styles
 *
 * @param {string[][]} stylings - Array filled with styleproperty / value subarrays [styleproperty, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the styling properties will be updated
 */
function updateStylings(stylings, data, element) {
    stylings.forEach(function (_a) {
        var style = _a[0], stringVariable = _a[1];
        var value = reactivity_1.parseString(stringVariable, data);
        element.style.setProperty(style, value);
    });
}
exports.updateStylings = updateStylings;
/**
 * Updates binded attributes
 *
 * @param {string[][]} stylings - Array filled with attributename / value subarrays [attributename, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the attribute properties will be updated
 */
function updateAttributes(attributes, data, element) {
    attributes.forEach(function (_a) {
        var attr = _a[0], value = _a[1];
        var parsed = reactivity_1.parseString(value, data);
        if (value !== element.getAttribute(attr)) {
            element.setAttribute(attr, parsed);
        }
    });
}
exports.updateAttributes = updateAttributes;
function objectKeysToUppercase(components) {
    var newObj = {};
    for (var key in components) {
        var newKey = key.toUpperCase();
        newObj[newKey] = components[key];
    }
    return newObj;
}
exports.objectKeysToUppercase = objectKeysToUppercase;
/**
 * Copyies the object. It loses the reference to the original one.
 *
 * @param {Object} obj - Object with methods
 */
function looseRef(obj) {
    return __assign({}, obj);
}
exports.looseRef = looseRef;
/**
 *
 * @param {Number} length - Length of the random generated string
 * @returns {String}      - Returns an random generated string
 */
function generateId(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "vytic-id-" + result;
}
exports.generateId = generateId;
/**
 *
 * Appends CSS to the head
 *
 * @param {String} style - CSS as an string
 * @returns - undefined
 */
function addCSS(style) {
    var head = document.getElementsByTagName("head")[0];
    var css = document.createElement("style");
    head.appendChild(css);
    css.appendChild(document.createTextNode(style));
}
exports.addCSS = addCSS;
/**
 *
 * @param {String} style - CSS string
 * @param {String} id    - ID that will be appendend after every scoped CSS class.
 */
function uniqueStylesheet(style, id) {
    id = id.toLowerCase();
    var newStyle = style.replace(/\s+{|{/g, "[" + id + "] {\n        ");
    return newStyle;
}
exports.uniqueStylesheet = uniqueStylesheet;
function getPosition(element, parent) {
    if (parent === void 0) { parent = null; }
    if (!parent)
        return Array.from(element.parentElement.children).indexOf(element);
    return Array.from(parent.children).indexOf(element);
}
exports.getPosition = getPosition;
function updateChildrens(vDom) {
    vDom.children.forEach(function (child) {
        if (child.attributes.visible) {
            if (getPosition(child.element, vDom.element) !== child.attributes.index) {
                insertElement(child.element, vDom.element, child.attributes.index);
            }
        }
    });
}
exports.updateChildrens = updateChildrens;
function updateProps(props, componentData, heap) {
    for (var key in props) {
        componentData[key] = reactivity_1.parseString(props[key], heap);
    }
}
exports.updateProps = updateProps;
