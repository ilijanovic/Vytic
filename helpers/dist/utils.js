"use strict";
exports.__esModule = true;
exports.insertElement = exports.deleteElement = exports.parseStringToElement = exports.formatText = exports.collectAttributes = void 0;
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
        parent: element.parentElement,
        index: element.parentElement ? Array.prototype.indexOf.call(element.parentElement.children, element) : 0
    });
}
exports.collectAttributes = collectAttributes;
function formatText(text) {
    if (!text)
        return "";
    var expressions = text === null || text === void 0 ? void 0 : text.match(/({{)(.*?)(}})/g);
    if (!expressions)
        return '"' + text.replace(/\n/g, "").trim() + '"';
    expressions.forEach(function (exp) {
        var varname = exp.match(/(?<={{)(.*?)(?=}})/)[0].trim();
        text = '"' + text.replace(exp, "\" + " + varname + " +\"") + '"';
    });
    return text.replace(/\n/g, "");
}
exports.formatText = formatText;
function parseStringToElement(template) {
    var div = document.createElement("div");
    div.innerHTML = template;
    return div.children[0];
}
exports.parseStringToElement = parseStringToElement;
function deleteElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}
exports.deleteElement = deleteElement;
function insertElement(element, parent, index) {
    if (index === void 0) { index = 0; }
    parent.insertBefore(element, parent.children[index]);
}
exports.insertElement = insertElement;
