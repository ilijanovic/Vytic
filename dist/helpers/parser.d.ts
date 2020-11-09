import { AttributesInterface } from "../helpers/utils";
/**
 * Compiles HTML down to an virtual DOM.
 * Element will not be deleted
 *
 * @param {Element} html - Element that will be compiled down to an virtual DOM
 * @returns {Object} - Returns virtual DOM representation of the element
 */
export declare function parseHTML(html: Element, styleId: string): VirtualDomInterface;
export interface VirtualDomInterface {
    tag: string;
    text: string;
    originalText: string;
    attributes: AttributesInterface;
    children: any[];
    styleId: string;
    element: HTMLElement;
    staticNode: Boolean;
    componentData: {
        [key: string]: any;
    };
}
