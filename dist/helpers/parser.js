import { collectAttributes, formatText } from "../helpers/utils.js";
/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 *
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element
 */
export function parseHTML(html, styleId) {
    var _a;
    let { text, staticNode } = formatText((_a = html.childNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeValue);
    return {
        tag: html.tagName,
        text: "",
        styleId,
        originalText: text,
        element: null,
        staticNode,
        children: Array.from(html.children).map(child => parseHTML(child, styleId)),
        attributes: collectAttributes(html),
        componentData: {},
        loopitem: null
    };
}
