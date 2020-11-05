import { parseHTML } from "./helpers/parser.js";
import { Reactivity } from "./helpers/reactivity.js";
import { parseStringToElement } from "./helpers/utils.js";
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
export class Vytic {
    constructor({ root = null, data = {}, methods = {}, appendTo }) {
        if (!root)
            throw "No root element passed";
        let oldRoot = root;
        let vDom = parseHTML(root);
        let reactivity = new Reactivity(vDom, data, methods);
        reactivity.makeReactive();
        let rootElement = reactivity.update(reactivity.vDom, methods, true);
        oldRoot.innerHTML = "";
        if (appendTo) {
            appendTo.appendChild(rootElement);
            return;
        }
        Array.from(rootElement.children).forEach(child => {
            if (appendTo) {
                appendTo.appendChild(child);
            }
            else {
                oldRoot.appendChild(child);
            }
        });
    }
}
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
export function createWebComponent({ name, template, style = "", data = {}, methods = {} }) {
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
                appendTo: shadowRoot
            });
        }
        ;
    };
    window.customElements.define(name, classes[name]);
    return classes[name].shadow;
}
