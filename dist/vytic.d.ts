import { MethodsInterface, ComponentType } from "./helpers/reactivity";
import { nextTick } from "./helpers/utils";
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
declare class Vytic {
    root: Element | ShadowRoot;
    vDom: Object;
    reactiveData: Object;
    constructor({ root, data, props, slots, styleId, methods, appendTo, ready, parent, components, index }: InputProps);
    getReactiveElement(): any;
    getVirtualDOM(): Object;
    getReactiveData(): Object;
}
export declare const idCollector: {
    [key: string]: string;
};
export interface WebComponentInterface {
    name: string;
    data: Object;
    template: string;
    methods: MethodsInterface;
    style: string;
}
export interface ComponentInterface {
    data: Object;
    root: Element;
    methods: MethodsInterface;
    ready?: Function;
    components?: ComponentType;
    style: string;
}
export interface InputProps {
    root: Element;
    data: Object;
    methods: MethodsInterface;
    appendTo?: Element | ShadowRoot | HTMLElement;
    ready?: Function;
    components?: ComponentType;
    parent?: Element;
    index?: number;
    styleId: string;
    slots?: Element[];
    props?: {
        [key: string]: any;
    };
}
export { Vytic, nextTick };
