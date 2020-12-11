/* js: Tooltip      */
/* author: Ivanuci  */
/* date: 11/22/2020 */


const tooltip = {}


tooltip.fStyle = (function () {

    const style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style;
})();

tooltip.fStyle.sheet.insertRule('#uptime-tooltip table tr td { border-bottom: 1pt solid gray; }', 0);
tooltip.fStyle.sheet.insertRule('#uptime-tooltip { position: absolute; text-align: left; padding: 5px; background: #FFFFFF; color: #313639; border: 0.5px solid #313639; border-radius: 4px; pointer-events: none; font-size: 12px; }', 0);

tooltip.cInstance = function () {

    this.element = document.createElement("div")
    this.element.style.display = "block"
    this.element.id = "uptime-tooltip"
    this.element.style.opacity = "0"

    this.ttTitle = document.createElement("div")
    this.ttTitle.innerHTML = "Naslov"
    this.ttTitle.style.fontWeight = "bold"
    this.ttTitle.style.color = "white"
    this.ttTitle.style.backgroundColor = "#7ea4b3"
    this.ttTitle.style.padding = "2px"
    this.ttTitle.style.textAlign = "center"
    this.ttTitle.style.marginBottom = "5px"

    this.ttTable = document.createElement("table")

    this.element.appendChild(this.ttTitle)
    this.element.appendChild(this.ttTable)
}

tooltip.cInstance.prototype.appendToParent = function (parent) {

    parent.appendChild(this.element)
}

tooltip.cInstance.prototype.values = function (title, titleColor, titleBGColor, data) {

    this.ttTitle.innerHTML = title
    this.ttTitle.style.color = titleColor
    this.ttTitle.style.backgroundColor = titleBGColor

    this.ttTable.innerHTML = ''
    Object.keys(data).forEach(function (key) {

        const row = this.ttTable.insertRow()
        const name = row.insertCell()
        name.innerHTML = key
        const value = row.insertCell()
        value.innerHTML = data[key]
    }, this)
}

tooltip.cInstance.prototype.show = function () {
    this.element.style.opacity = "1"
}

tooltip.cInstance.prototype.hide = function () {
    this.element.style.opacity = "0"
}

tooltip.cInstance.prototype.position = function (left, top) {
    this.element.style.left = left
    this.element.style.top = top
}

tooltip.cInstance.prototype.style = function (property, value) {
    return this.element.style[property] = value;
}

tooltip.instance = new tooltip.cInstance()

