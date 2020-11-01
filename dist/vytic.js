import { parseHTML } from "./helpers/parser.js";
import { Reactivity } from "./helpers/reactivity.js";
export class Vytic {
    constructor({ root = null, data = {}, methods = {} }) {
        if (!root)
            throw "No root element passed";
        let vDom = parseHTML(root);
        let reactivity = new Reactivity(vDom, data, methods);
        reactivity.makeReactive();
        reactivity.update(reactivity.vDom, methods, true).then(rootElement => {
            root.innerHTML = "";
            Array.from(rootElement.children).forEach(child => {
                root.appendChild(child);
            });
        });
    }
}
export function createWebComponent({ name, template, data, methods }) {
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
                methods
            });
        }
        ;
    };
    window.customElements.define(name, classes.name);
    return name;
}
