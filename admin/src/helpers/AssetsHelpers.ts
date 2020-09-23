export function removeCSSClass(ele: HTMLElement, cls: string) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)")
    ele.className = ele.className.replace(reg, " ")
}

export function addCSSClass(ele: HTMLElement, cls: string) {
    ele.classList.add(cls)
}

export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname
