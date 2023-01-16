export const isDocked = () => {
    if (typeof(window) !== "undefined") {
        return true
    } else {
        return false
    }
}