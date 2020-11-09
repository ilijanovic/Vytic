import { VirtualDomInterface } from "./parser";
import { ComponentType, MethodsInterface } from "./reactivity";
/**
 * Collects all attributes from an element.
 *
 * @param {HTMLElement} element - Element where the attributes gets collected
 * @returns {Object} - Returns Object that contains data / state about the element
 */
export declare function collectAttributes(element: Element): AttributesInterface;
export interface AttributesInterface {
    attr: string[][];
    handlers: string[][];
    bindedStyle: string[][];
    bindedAttr: string[][];
    bindedClasses: string[][];
    show: string;
    visible: Boolean;
    parent: HTMLElement;
    index: number;
    props: {
        [key: string]: string;
    };
}
interface StaticInterface {
    staticNode: Boolean;
    text: string;
}
/**
 * Formats an string that it can be parsed later with "parseString"
 *
 * @param {String} text - String that needs to be formatted
 * @returns {string} - Returns formatted string
 */
export declare function formatText(text: String): StaticInterface;
/**
 *  Parses an string to an element
 *
 * @param {string} template - HTML markup as an string
 * @returns {Element} - Returns an HTML element
 */
export declare function parseStringToElement(template: string): Element;
/**
 * Deletes an element out of the DOM
 *
 * @param {HTMLElement} element - Element that will be deleted
 */
export declare function deleteElement(element: HTMLElement): void;
/**
 * Inserts an element on a specific position
 * By default it inserts it at index 0
 *
 * @param {HTMLElement} element - Element that will be inserted
 * @param {HTMLElement} parent - Parent element
 * @param {number} index - Position of the element in the parent element
 */
export declare function insertElement(element: HTMLElement, parent: Element, index?: number): void;
/**
 * Waits for the next request frame
 *
 * @returns {Promise<number>} - Resolves an request ID number
 */
export declare function nextTick(): Promise<number>;
/**
 * Attaches event handler to an element
 *
 * @param {string[][]} handlers - Array filled with event / name subarrays [event, handler]
 * @param {Object} methods - Object that contains all methods
 * @param {Element} element - Element where the event handlers will be attached
 */
export declare function addHandlers(handlers: string[][], methods: MethodsInterface, element: Element, heap: {
    [key: string]: any;
}): void;
/**
 * Adds static attributes to an element
 *
 * @param {string[][]} attributes - Array filled with attribute / value subarrays [attribute, value]
 * @param {Element} element - Element where the attributes will be set
 */
export declare function addAttributes(attributes: string[][], element: Element): void;
/**
 * Updates binded classes
 *
 * @param {string[][]} classes - Array filled with classname / value subarrays [classname, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the classes will be added / removed
 */
export declare function updateClasses(classes: string[][], data: Object, element: HTMLElement): void;
/**
 * Updates binded styles
 *
 * @param {string[][]} stylings - Array filled with styleproperty / value subarrays [styleproperty, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the styling properties will be updated
 */
export declare function updateStylings(stylings: string[][], data: Object, element: HTMLElement): void;
/**
 * Updates binded attributes
 *
 * @param {string[][]} stylings - Array filled with attributename / value subarrays [attributename, value]
 * @param {Object} data - Proxy object that holds the data
 * @param {HTMLElement} element - Element where the attribute properties will be updated
 */
export declare function updateAttributes(attributes: string[][], data: Object, element: HTMLElement): void;
export declare function objectKeysToUppercase(components: ComponentType): ComponentType;
/**
 * Copyies the object. It loses the reference to the original one.
 *
 * @param {Object} obj - Object with methods
 */
export declare function looseRef(obj: Object): Object;
/**
 *
 * @param {Number} length - Length of the random generated string
 * @returns {String}      - Returns an random generated string
 */
export declare function generateId(length: number): string;
/**
 *
 * Appends CSS to the head
 *
 * @param {String} style - CSS as an string
 * @returns - undefined
 */
export declare function addCSS(style: string): void;
/**
 *
 * @param {String} style - CSS string
 * @param {String} id    - ID that will be appendend after every scoped CSS class.
 */
export declare function uniqueStylesheet(style: string, id: string): string;
export declare function getPosition(element: HTMLElement, parent?: HTMLElement | Element): number;
export declare function updateChildrens(vDom: VirtualDomInterface): void;
export declare function updateProps(props: {
    [key: string]: string;
}, componentData: {
    [key: string]: string;
}, heap: Object): void;
export {};
