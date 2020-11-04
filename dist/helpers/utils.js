import { parseString } from "./reactivity.js";
export function collectAttributes(element) {
    return Array.from(element.attributes, ({ name, value }) => [
        name,
        value,
    ]).reduce((a, [key, val]) => {
        if (key.includes("@")) {
            let handlerName = key.replace("@", "");
            a.handlers.push([handlerName, val]);
        }
        else if (key.startsWith("s:")) {
            let styleProp = key.replace("s:", "");
            a.bindedStyle.push([styleProp, val]);
        }
        else if (key.startsWith("c:")) {
            let classProp = key.replace("c:", "");
            a.bindedClasses.push([classProp, val]);
        }
        else if (key.startsWith("a:")) {
            let attributeProp = key.replace("a:", "");
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
export function formatText(text) {
    if (!text)
        return "";
    let expressions = text === null || text === void 0 ? void 0 : text.match(/({{)(.*?)(}})/g);
    if (!expressions)
        return '"' + text.replace(/\n/g, "").trim() + '"';
    expressions.forEach((exp) => {
        let varname = exp.match(/(?<={{)(.*?)(?=}})/)[0].trim();
        text = '"' + text.replace(exp, `" + ${varname} +"`) + '"';
    });
    return text.replace(/\n/g, "");
}
export function parseStringToElement(template) {
    let div = document.createElement("div");
    div.innerHTML = template;
    return div.children[0];
}
export function deleteElement(element) {
    let parent = element.parentNode;
    parent.removeChild(element);
}
export function insertElement(element, parent, index = 0) {
    parent.insertBefore(element, parent.children[index]);
}
export function validHTML(element) {
    return document.createElement(element.tagName.toUpperCase()).toString() != "[object HTMLUnknownElement]";
}
export function nextTick() {
    return new Promise(res => requestAnimationFrame(res));
}
export function addHandlers(handlers, methods, element) {
    handlers.forEach(([handler, method]) => {
        element.addEventListener(handler, methods[method]);
    });
}
export function addAttributes(attributes, element) {
    attributes.forEach(([attribute, value]) => {
        element.setAttribute(attribute, value);
    });
}
export function updateClasses(classes, data, element) {
    classes.forEach(([cl, value]) => {
        let status = !!parseString(value, data);
        if (status) {
            element.classList.add(cl);
        }
        else {
            element.classList.remove(cl);
        }
    });
}
export function updateStylings(stylings, data, element) {
    stylings.forEach(([style, stringVariable]) => {
        let value = parseString(stringVariable, data);
        element.style.setProperty(style, value);
    });
}
