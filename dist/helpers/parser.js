import { collectAttributes, formatText } from "../helpers/utils.js";
export function parseHTML(html) {
    return {
        tag: html.tagName,
        text: "",
        originalText: formatText(html.childNodes[0].nodeValue),
        element: null,
        children: Array.from(html.children).map(child => parseHTML(child)),
        attributes: collectAttributes(html)
    };
}
