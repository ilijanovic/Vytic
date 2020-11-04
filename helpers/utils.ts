import { MethodsInterface, parseString } from "./reactivity"

export function collectAttributes(element: HTMLElement | Element): AttributesInterface {
    return Array.from(element.attributes, ({ name, value }) => [
        name,
        value,
    ]).reduce((a, [key, val]) => {
        if (key.includes("@")) {
            let handlerName = key.replace("@", "")
            a.handlers.push([handlerName, val])
        } else if (key.startsWith("s:")) {
            let styleProp = key.replace("s:", "")
            a.bindedStyle.push([styleProp, val])
        } else if (key.startsWith("c:")) {
            let classProp = key.replace("c:", "");
            a.bindedClasses.push([classProp, val])
        } else if (key.startsWith("a:")) {
            let attributeProp = key.replace("a:", "");
            a.bindedAttr.push([attributeProp, val])
        } else if (key === "if") {
            a.show = val
        } else {
            a.attr.push([key, val])
        }
        return a
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
    })
}
export interface AttributesInterface {
    attr: string[][],
    handlers: string[][],
    bindedStyle: string[][],
    bindedAttr: string[][]
    bindedClasses: string[][],
    show: string,
    visible: Boolean,
    parent: HTMLElement,
    index: number
}

export function formatText(text: String): string {
    if (!text)
        return "";

    let expressions = text?.match(/({{)(.*?)(}})/g);
    if (!expressions)
        return '"' + text.replace(/\n/g, "").trim() + '"';

    expressions.forEach((exp) => {
        let varname = exp.match(/(?<={{)(.*?)(?=}})/)[0].trim();
        text = '"' + text.replace(exp, `" + ${varname} +"`) + '"';
    });
    return text.replace(/\n/g, "")
}


export function parseStringToElement(template: string): Element {
    let div = document.createElement("div")
    div.innerHTML = template
    return div.children[0]
}

export function deleteElement(element: HTMLElement): void {
    let parent = element.parentNode;
    parent.removeChild(element)
}
export function insertElement(element: HTMLElement, parent: HTMLElement, index: number = 0): void {

    parent.insertBefore(element, parent.children[index]);
}
export function validHTML(element: HTMLElement | Element): Boolean {
    return document.createElement(element.tagName.toUpperCase()).toString() != "[object HTMLUnknownElement]";
}

export function nextTick(): Promise<any> {
    return new Promise(res => requestAnimationFrame(res))
}

export function addHandlers(handlers: string[][], methods: MethodsInterface, element: Element): void {
    handlers.forEach(([handler, method]) => {
        element.addEventListener(handler, methods[method])
    })
}

export function addAttributes(attributes: string[][], element: Element): void {
    attributes.forEach(([attribute, value]) => {
        element.setAttribute(attribute, value)
    })
}
export function updateClasses(classes: string[][], data: Object, element: Element): void {
    classes.forEach(([cl, value]) => {
        let status = !!parseString(value, data)
        if (status) {
            element.classList.add(cl)
        } else {
            element.classList.remove(cl)
        }
    })
}
export function updateStylings(stylings: string[][], data: Object, element: HTMLElement): void {
    stylings.forEach(([style, stringVariable]) => {
        let value = parseString(stringVariable, data)
        element.style.setProperty(style, value)
    })
}