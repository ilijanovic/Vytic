
import { ComponentType, MethodsInterface, parseString } from "./reactivity"

/**
 * Collects all attributes from an element.
 * 
 * @param {HTMLElement} element - Element where the attributes gets collected
 * @returns {Object} - Returns Object that contains data / state about the element
 */
export function collectAttributes(element: Element): AttributesInterface {
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

/**
 * Formats an string that it can be parsed later with "parseString"
 * 
 * @param {String} text - String that needs to be formatted
 * @returns {string} - Returns formatted string
 */
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

/**
 *  Parses an string to an element
 * 
 * @param {string} template - HTML markup as an string
 * @returns {Element} - Returns an HTML element
 */
export function parseStringToElement(template: string): Element {
    let div = document.createElement("div")
    div.innerHTML = template
    return div.children[0]
}

/**
 * Deletes an element out of the DOM
 * 
 * @param {HTMLElement} element - Element that will be deleted
 */
export function deleteElement(element: HTMLElement): void {
    let parent = element.parentNode;
    parent.removeChild(element)
}

/**
 * Inserts an element on a specific position
 * By default it inserts it at index 0
 * 
 * @param {HTMLElement} element - Element that will be inserted
 * @param {HTMLElement} parent - Parent element 
 * @param {number} index - Position of the element in the parent element
 */
export function insertElement(element: HTMLElement, parent: Element, index: number = 0): void {
    parent.insertBefore(element, parent.children[index]);
}


/**
 * Waits for the next request frame
 * 
 * @returns {Promise<number>} - Resolves an request ID number
 */
export function nextTick(): Promise<number> {
    return new Promise(res => requestAnimationFrame(res))
}

/**
 * Attaches event handler to an element
 * 
 * @param {string[][]} handlers - Array filled with event / name subarrays [event, handler]
 * @param {Object} methods - Object that contains all methods
 * @param {Element} element - Element where the event handlers will be attached 
 */
export function addHandlers(handlers: string[][], methods: MethodsInterface, element: Element, heap: Object): void {
    handlers.forEach(([handler, method]) => {
        element.addEventListener(handler, typeof methods[method] === "function" ? methods[method] : () => {
            //TODO: Add handler for non functions
        })
    })
}
/**
 * Adds static attributes to an element
 * 
 * @param {string[][]} attributes - Array filled with attribute / value subarrays [attribute, value]
 * @param {Element} element - Element where the attributes will be set
 */
export function addAttributes(attributes: string[][], element: Element): void {
    attributes.forEach(([attribute, value]) => {
        element.setAttribute(attribute, value)
    })
}
/**
 * Updates binded classes
 * 
 * @param {string[][]} classes - Array filled with classname / value subarrays [classname, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the classes will be added / removed
 */
export function updateClasses(classes: string[][], data: Object, element: HTMLElement): void {
    classes.forEach(([cl, value]) => {
        let status = !!parseString(value, data)
        if (status) {
            element.classList.add(cl)
        } else {
            element.classList.remove(cl)
        }
    })
}

/**
 * Updates binded styles
 * 
 * @param {string[][]} stylings - Array filled with styleproperty / value subarrays [styleproperty, value] 
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the styling properties will be updated
 */
export function updateStylings(stylings: string[][], data: Object, element: HTMLElement): void {
    stylings.forEach(([style, stringVariable]) => {
        let value = parseString(stringVariable, data)
        element.style.setProperty(style, value)
    })
}
/**
 * Updates binded attributes
 * 
 * @param {string[][]} stylings - Array filled with attributename / value subarrays [attributename, value] 
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the attribute properties will be updated
 */
export function updateAttributes(attributes: string[][], data: Object, element: HTMLElement): void {
    attributes.forEach(([attr, value]) => {
        let parsed = parseString(value, data)
        if (value !== element.getAttribute(attr)) {
            element.setAttribute(attr, parsed)
        }
    })
}

export function objectKeysToUppercase(components: ComponentType) {
    let newObj: ComponentType = {};
    for (let key in components) {
        let newKey = key.toUpperCase();
        newObj[newKey] = components[key];
    }
    return newObj;
}

/**
 * Copyies the object. It loses the reference to the original one.
 * 
 * @param {Object} obj - Object with methods
 */
export function looseRef(obj: Object): Object {
    return { ...obj }
}

/**
 *
 * @param {Number} length - Length of the random generated string
 * @returns {String}      - Returns an random generated string
 */
export function generateId(length: number): string {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `vytic-id-${result}`;
}

/**
 *
 * Appends CSS to the head
 *
 * @param {String} style - CSS as an string
 * @returns - undefined
 */
export function addCSS(style: string): void {
    let head = document.getElementsByTagName("head")[0];
    let css = document.createElement("style");
    head.appendChild(css);
    css.appendChild(document.createTextNode(style));
}

/**
 *
 * @param {String} style - CSS string
 * @param {String} id    - ID that will be appendend after every scoped CSS class.
 */
export function uniqueStylesheet(style: string, id: string): string {
    id = id.toLowerCase();
    let newStyle = style.replace(/\s+{|{/g, `[${id}] {`);
    return newStyle;
}
