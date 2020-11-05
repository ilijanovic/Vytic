import { collectAttributes, formatText } from "../helpers/utils.js";
/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 *
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element
 */
export function parseHTML(html) {
    var _a;
    return {
        tag: html.tagName,
        text: "",
        originalText: formatText((_a = html.childNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeValue),
        element: null,
        children: Array.from(html.children).map(child => parseHTML(child)),
        attributes: collectAttributes(html)
    };
}
