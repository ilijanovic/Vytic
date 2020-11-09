"use strict";
exports.__esModule = true;
exports.parseHTML = void 0;
var utils_1 = require("../helpers/utils");
/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 *
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element
 */
function parseHTML(html, styleId) {
    var _a;
    var _b = utils_1.formatText((_a = html.childNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeValue), text = _b.text, staticNode = _b.staticNode;
    return {
        tag: html.tagName,
        text: "",
        styleId: styleId,
        originalText: text,
        element: null,
        staticNode: staticNode,
        children: Array.from(html.children).map(function (child) { return parseHTML(child, styleId); }),
        attributes: utils_1.collectAttributes(html),
        componentData: {},
        loopitem: null
    };
}
exports.parseHTML = parseHTML;
