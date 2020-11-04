import { parseHTML } from "./helpers/parser.js";
import { Reactivity } from "./helpers/reactivity.js";
import { parseStringToElement } from "./helpers/utils.js";
export class Vytic {
    constructor({ root = null, data = {}, methods = {}, appendTo }) {
        if (!root)
            throw "No root element passed";
        let oldRoot = root;
        let vDom = parseHTML(root);
        let reactivity = new Reactivity(vDom, data, methods);
        reactivity.makeReactive();
        reactivity.update(reactivity.vDom, methods, true).then(rootElement => {
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
        });
    }
}
export function createWebComponent({ name, template, style = "", data = {}, methods = {}, components = {} }) {
    let classes = {
        name
    };
    classes.name = class extends HTMLElement {
        constructor() {
            super();
            let el = parseStringToElement(template);
            let shadowRoot = this.attachShadow({ mode: "open" });
            let st = document.createElement("style");
            st.appendChild(document.createTextNode(style));
            shadowRoot.appendChild(st);
            new Vytic({
                root: el,
                data,
                methods,
                components,
                appendTo: shadowRoot
            });
        }
        ;
    };
    window.customElements.define(name, classes.name);
    return name;
}
