export const modifiers: string[] = ["enter", "prevent"]

export function checkEvent(event: KeyboardEvent, modifier: string): Boolean {
    if (!modifiers.includes(modifier)) return false
    if (modifier === "enter") {
        return event.code === "Enter"
    }
    if (modifier === "prevent") {
        event.preventDefault()
        return true
    }
}