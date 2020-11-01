import { parseHTML } from "./helpers/parser"
import { Reactivity, MethodsInterface } from "./helpers/reactivity"
import { parseStringToElement } from "./helpers/utils"


export class Vytic {

    constructor({ root = null, data = {}, methods = {} }: InputProps) {
        if (!root) throw "No root element passed"
        let vDom = parseHTML(root)
        let reactivity = new Reactivity(vDom, data, methods)
        reactivity.makeReactive()
        reactivity.update(reactivity.vDom, methods, true,).then(rootElement => {
            root.innerHTML = "";
            Array.from(rootElement.children).forEach(child => {
                root.appendChild(child)
            })
        })


    }




}
interface ComponentInterface {
    name: string,
    data: Object,
    template: string,
    methods: MethodsInterface,

}
interface InputProps {
    root: HTMLElement | Element,
    data: Object,
    methods: MethodsInterface,
}
export function createWebComponent({ name, template, data, methods }: ComponentInterface) {
    let classes: { [key: string]: any } = {
        name
    }
    classes.name = class extends HTMLElement {
        shadowRoot: any
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" })
            shadowRoot.innerHTML = template
            new Vytic({
                root: shadowRoot.firstElementChild,
                data,
                methods
            })
        };
    }
    window.customElements.define(name, classes.name);
    return name
}

