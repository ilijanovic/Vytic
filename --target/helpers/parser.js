"use strict";
exports.__esModule = true;
exports.parseHTML = void 0;
var utils_1 = require("../helpers/utils");
function parseHTML(html) {
    return {
        tag: html.tagName,
        text: "",
        originalText: utils_1.formatText(html.childNodes[0].nodeValue),
        element: null,
        children: Array.from(html.children).map(function (child) { return parseHTML(child); }),
        attributes: utils_1.collectAttributes(html)
    };
}
exports.parseHTML = parseHTML;
