"use strict";
exports.__esModule = true;
exports.parseHTML = void 0;
var utils_1 = require("../helpers/utils");
function parseHTML(html) {
    var _a;
    return {
        tag: html.tagName,
        text: "",
        originalText: utils_1.formatText((_a = html.childNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeValue),
        element: null,
        children: Array.from(html.children).map(function (child) { return parseHTML(child); }),
        attributes: utils_1.collectAttributes(html)
    };
}
exports.parseHTML = parseHTML;
