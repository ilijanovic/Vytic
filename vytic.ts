import { parseHTML } from "./helpers/parser"
import { Reactivity, MethodsInterface } from "./helpers/reactivity"

export class Vytic {
    constructor({ root = null, data = {}, methods = {} }: InputProps) {
        if (!root) throw "No root element passed"
        let vDom = parseHTML(root)
        let reactivity = new Reactivity(vDom, data, methods)
        reactivity.makeReactive()
        reactivity.update(reactivity.vDom, methods, true).then(rootElement => {
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
    methods: MethodsInterface
}
interface InputProps {
    root: HTMLElement,
    data: Object,
    methods: MethodsInterface
}
export function createWebComponent({ name, template, data, methods }: ComponentInterface) {
    let classes: { [key: string]: any } = {
        name
    }
    classes.name = class extends HTMLElement {

        constructor() {
            super();
            this.innerHTML = template
            new Vytic({
                root: this,
                data,
                methods
            })
        };
    }
    window.customElements.define(name, classes.name);
    return name
}
