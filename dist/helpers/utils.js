export function collectAttributes(element) {
    return Array.from(element.attributes, ({ name, value }) => [
        name,
        value,
    ]).reduce((a, [key, val]) => {
        if (key.includes("@")) {
            let handlerName = key.replace("@", "");
            a.handlers.push([handlerName, val]);
        }
        else if (key.startsWith("s:")) {
            let styleProp = key.replace("s:", "");
            a.bindedStyle.push([styleProp, val]);
        }
        else if (key.startsWith("c:")) {
            let classProp = key.replace("c:", "");
            a.bindedClasses.push([classProp, val]);
        }
        else if (key.startsWith("a:")) {
            let attributeProp = key.replace("a:", "");
            a.bindedAttr.push([attributeProp, val]);
        }
        else if (key === "if") {
            a.show = val;
        }
        else {
            a.attr.push([key, val]);
        }
        return a;
    }, {
        attr: [],
        handlers: [],
        bindedStyle: [],
        bindedAttr: [],
        bindedClasses: [],
        show: null,
        visible: true,
        parent: element.parentElement,
        index: Array.prototype.indexOf.call(element.parentElement.children, element)
    });
}
export function formatText(text) {
    if (!text)
        return "";
    let expressions = text === null || text === void 0 ? void 0 : text.match(/({{)(.*?)(}})/g);
    if (!expressions)
        return '"' + text.replace(/\n/g, "").trim() + '"';
    expressions.forEach((exp) => {
        let varname = exp.match(/(?<={{)(.*?)(?=}})/)[0].trim();
        text = '"' + text.replace(exp, `" + ${varname} +"`) + '"';
    });
    return text.replace(/\n/g, "");
}
export function parseStringToElement(template) {
    let div = document.createElement("div");
    div.innerHTML = template;
    return div.children[0];
}
export function deleteElement(element) {
    let parent = element.parentNode;
    parent.removeChild(element);
}
export function insertElement(element, parent, index = 0) {
    parent.insertBefore(element, parent.children[index]);
}
