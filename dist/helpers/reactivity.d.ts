import { ComponentInterface } from "../vytic";
import { VirtualDomInterface } from "./parser";
export declare type ComponentType = {
    [key: string]: ComponentInterface;
};
export interface UpdateInterface {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    components: ComponentType;
    parent: Element;
    once: Boolean;
    styleId?: string;
}
export interface ReactivityInterface {
    vDom: VirtualDomInterface;
    data: Object;
    methods: MethodsInterface;
    components: ComponentType;
    parent: Element;
    index?: number;
    styleId: string;
    slots: Element[];
    props?: {
        [key: string]: string;
    };
}
export declare class Reactivity {
    vDom: VirtualDomInterface;
    methods: MethodsInterface;
    updating: Boolean;
    heap: {
        [key: string]: any;
    };
    components: ComponentType;
    parent: Element;
    index: number;
    styleId: string;
    slots: Element[];
    props: {
        [key: string]: string;
    };
    constructor({ vDom, slots, data, methods, components, parent, index, styleId, props }: ReactivityInterface);
    makeReactive(): Object;
    proxyHandler(): Object;
    update({ vDom, methods, components, parent, once, styleId }: UpdateInterface): HTMLElement;
}
export interface MethodsInterface {
    [key: string]: any;
}
export declare function parseString(str: String, data: Object): any;
