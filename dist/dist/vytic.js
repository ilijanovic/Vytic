import { parseHTML } from "./helpers/parser.js";
import { Reactivity } from "./helpers/reactivity.js";
import { parseStringToElement } from "./helpers/utils.js";
export class Vytic {
    constructor({ root = null, data = {}, methods = {}, components = {} }) {
        if (!root)
            throw "No root element passed";
        let vDom = parseHTML(root);
        let reactivity = new Reactivity(vDom, data, methods, components);
        reactivity.makeReactive();
        reactivity.update(reactivity.vDom, methods, components, true).then(rootElement => {
            root.innerHTML = "";
            Array.from(rootElement.children).forEach(child => {
                root.appendChild(child);
            });
        });
    }
}
export function createWebComponent({ name, template, data = {}, methods = {}, components = {} }) {
    let classes = {
        name
    };
    classes.name = class extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = template;
            new Vytic({
                root: shadowRoot.firstElementChild,
                data,
                methods,
                components
            });
        }
        ;
    };
    window.customElements.define(name, classes.name);
    return name;
}
export function createComponent({ template, data, methods, components }) {
    let el = parseStringToElement(template);
    console.log(el);
    new Vytic({
        root: el,
        data,
        methods,
        components
    });
    return el;
}
