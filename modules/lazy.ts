import { VirtualDomInterface } from "../helpers/parser";
let observer: IntersectionObserver = null;
export const lazy = function (vDom: VirtualDomInterface, heap: Object) {
    let isLazy = vDom.attributes.attr.some(([attribute]) => attribute === "lazy")
    if (!isLazy) return
    if (!observer) {
        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {

                }
            })
        })
    }

}