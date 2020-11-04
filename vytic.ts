
import { parseHTML } from "./helpers/parser"
import { Reactivity, MethodsInterface } from "./helpers/reactivity"
import { parseStringToElement } from "./helpers/utils";


export class Vytic {
    rootElement: HTMLElement | Element;
    constructor({ root = null, data = {}, methods = {}, appendTo }: InputProps) {
        if (!root) throw "No root element passed"
        let oldRoot = root;
        let vDom = parseHTML(root)
        let reactivity = new Reactivity(vDom, data, methods)
        reactivity.makeReactive()
        reactivity.update(reactivity.vDom, methods, true).then(rootElement => {
            oldRoot.innerHTML = "";
            if (appendTo) {
                appendTo.appendChild(rootElement);
                return
            }
            Array.from(rootElement.children).forEach(child => {
                if (appendTo) {
                    appendTo.appendChild(child)
                } else {
                    oldRoot.appendChild(child)
                }

            })
        })
    }
}
interface ComponentInterface {
    name: string,
    data: Object,
    template: string,
    methods: MethodsInterface,
    components: Object,
    style: string
}
interface InputProps {
    root: any,
    data: Object,
    methods: MethodsInterface,
    components: Object,
    appendTo: any
}
export function createWebComponent({ name, template, style = "", data = {}, methods = {}, components = {} }: ComponentInterface) {
    let classes: { [key: string]: any } = {
        name
    }
    classes.name = class extends HTMLElement {
        shadowRoot: ShadowRoot
        constructor() {
            super();
            let el = parseStringToElement(template)
            let shadowRoot = this.attachShadow({ mode: "open" })
            let st = document.createElement("style");
            st.appendChild(document.createTextNode(style))
            shadowRoot.appendChild(st)
            new Vytic({
                root: el,
                data: { ...data },
                methods: { ...methods },
                components,
                appendTo: shadowRoot
            })
        };

    }
    window.customElements.define(name, classes.name);
    return name
}



