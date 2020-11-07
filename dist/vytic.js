import { parseHTML } from "./helpers/parser.js";
import { Reactivity } from "./helpers/reactivity.js";
import { parseStringToElement, nextTick, objectKeysToUppercase, looseRef } from "./helpers/utils.js";
/**
 * Creates a new Vytic instance
 * Compiles the HTML markup down to an virtual DOM. It parses the DOM an replaces it with the root element
 *
 * @constructor
 * @param {Element} root - The root element that will be reactive later
 * @param {Object} data - Objects that holds data. Will be replaced by an proxy object to track changes
 * @param {Object} methods - Methods to mutate data
 * @param {ShadowRoot | HTMLElement | Element} appendTo - Instead of replacing the root element with the parsed element, the element will be appended instead on the "appendAt" element
 */
class Vytic {
    constructor({ root = null, data = {}, styleId = undefined, methods = {}, appendTo, ready, parent, components = {}, index }) {
        if (typeof root === "string") {
            root = parseStringToElement(root);
        }
        else if (!root) {
            throw "No root element passed";
        }
        components = objectKeysToUppercase(components);
        methods = looseRef(methods);
        let oldRoot = root;
        let vDom = parseHTML(root, styleId);
        this.vDom = vDom;
        let reactivity = new Reactivity({ vDom, data, methods, components, parent, index, styleId });
        let heap = reactivity.makeReactive();
        let rootElement = reactivity.update({ vDom: reactivity.vDom, methods, components, parent, styleId, once: true });
        oldRoot.innerHTML = "";
        if (typeof ready === "function") {
            ready.call(heap);
        }
        if (appendTo) {
            this.root = appendTo;
            appendTo.appendChild(rootElement);
            return;
        }
        this.root = rootElement;
        if (typeof root !== "string") {
            oldRoot.replaceWith(rootElement);
        }
    }
    getReactiveElement() {
        return this.root;
    }
    getVirtualDOM() {
        return this.vDom;
    }
}
export const idCollector = {};
/**
 * Creates a native web component with reactivity from Vytic
 *
 * @param {Object} obj - An object.
 * @param {string} name - Name of the web component. Must be written in kebap case
 * @param {string} template - HTML markup as a sting. Only 1 element is allowed to be in a component. Multiple elements needs to be wrapped in an container
 * @param {string} style - CSS string. Only available inside the component
 * @param {Object} data - Contains data
 * @param {Object} methods - Contains methods for mutating data
 * @returns {ShadowRoot} - Returns the reactive shadow element
 */
function createWebComponent({ name, template, style = "", data = {}, methods = {} }) {
    let classes = {
        name
    };
    classes[name] = class extends HTMLElement {
        constructor() {
            super();
            let el = parseStringToElement(template);
            let shadowRoot = this.attachShadow({ mode: "open" });
            let st = document.createElement("style");
            st.appendChild(document.createTextNode(style));
            shadowRoot.appendChild(st);
            this.shadow = shadowRoot;
            new Vytic({
                root: el,
                data: Object.assign({}, data),
                methods: Object.assign({}, methods),
                appendTo: shadowRoot,
                styleId: ""
            });
        }
        ;
    };
    window.customElements.define(name, classes[name]);
    return classes[name].shadow;
}
export { Vytic, createWebComponent, nextTick };
