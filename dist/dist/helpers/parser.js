import { collectAttributes, formatText } from "../helpers/utils.js";
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
