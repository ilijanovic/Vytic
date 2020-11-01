import { parseHTML } from "./helpers/parser";
import { Reactivity } from "./helpers/reactivity";
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
            this.innerHTML = template;
            new Vytic({
                root: this,
                data,
                methods
            });
        }
        ;
    };
    window.customElements.define(name, classes.name);
    return name;
}
