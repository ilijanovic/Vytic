export const modifiers = ["enter", "prevent"];
export function checkEvent(event, modifier) {
    if (!modifiers.includes(modifier))
        return false;
    if (modifier === "enter") {
        return event.code === "Enter";
    }
    if (modifier === "prevent") {
        event.preventDefault();
        return true;
    }
}
