/* js: Svg Tools    */
/* author: Ivanuci  */
/* date: 12/02/2020 */

const svgTools = {}


svgTools.xmlns = "http://www.w3.org/2000/svg";


// SVG
svgTools.cSvg = function (x, y, width, height) {

    this.width = width
    this.height = height

    this.element = document.createElementNS(svgTools.xmlns, "svg");
    this.element.setAttributeNS(null, "x", x);
    this.element.setAttributeNS(null, "y", y);
    this.element.setAttributeNS(null, "width", width);
    this.element.setAttributeNS(null, "height", height);
    this.element.style.display = "block";
    this.isSvgToolsObject = true;

    this.zoomActive = false
}

svgTools.cSvg.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cSvg.prototype.getElement = function () { return this.element; }

svgTools.cSvg.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
}

svgTools.cSvg.prototype.removeChildren = function () {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
}

svgTools.cSvg.prototype.viewBox = function (x, y, width, height) {
    this.element.setAttributeNS(null, "viewBox", x + " " + y + " " + width + " " + height);
}

svgTools.cSvg.prototype.visible = function (visible) {
    const state = visible ? 'visible' : 'hidden'
    this.element.setAttributeNS(null, "visibility", state);
}

svgTools.cSvg.prototype.addEventListener = function (type, listener) {
    return this.element.addEventListener(type, listener, false)
}

svgTools.cSvg.prototype.removeEventListener = function (type, listener) {
    return this.element.removeEventListener(type, listener, false)
}

svgTools.cSvg.prototype.zoom = function () {

    const thisSvg = this
    let zoom = 1
    let drag = false
    const viewB = { x: 0, y: 0, width: this.width, height: this.height };
    const offset = { mouseX: 0, mouseY: 0, viewX: 0, viewY: 0 };

    const savePositions = function (e) {

        offset.mouseX = e.offsetX
        offset.mouseY = e.offsetY
        offset.viewX = viewB.x
        offset.viewY = viewB.y
        drag = true
    }

    const restorePositions = function (e) {

        viewB.x = offset.viewX
        viewB.y = offset.viewY
        drag = false
    }

    const zooming = function (e) {

        e.preventDefault();
        e.stopPropagation();

        zoom = e.wheelDelta > 0 ? zoom / 2 : zoom * 2
        if (zoom < 1) zoom = 1

        viewB.width = thisSvg.width / zoom
        viewB.height = thisSvg.height / zoom

        viewB.x = e.offsetX - (viewB.width / 2)
        if (viewB.x < 0) viewB.x = 0
        if (viewB.x > thisSvg.width - viewB.width) viewB.x = thisSvg.width - viewB.width

        viewB.y = e.offsetY - (viewB.height / 2)
        if (viewB.y < 0) viewB.y = 0
        if (viewB.y > thisSvg.height - viewB.height) viewB.y = thisSvg.height - viewB.height

        thisSvg.viewBox(viewB.x, viewB.y, viewB.width, viewB.height)

    }

    const moving = function (e) {

        e.preventDefault();
        e.stopPropagation();

        if (drag) {

            offset.viewX = viewB.x + (offset.mouseX - e.offsetX) / zoom
            if (offset.viewX < 0) offset.viewX = 0
            if (offset.viewX > thisSvg.width - viewB.width) offset.viewX = thisSvg.width - viewB.width

            offset.viewY = viewB.y + (offset.mouseY - e.offsetY) / zoom
            if (offset.viewY < 0) offset.viewY = 0
            if (offset.viewY > thisSvg.height - viewB.height) offset.viewY = thisSvg.height - viewB.height

            thisSvg.viewBox(offset.viewX, offset.viewY, viewB.width, viewB.height)
        }

    }

    if (!this.zoomActive) {
        this.zoomActive = true;
        this.addEventListener('mousedown', savePositions)
        this.addEventListener('mouseup', restorePositions)
        this.addEventListener('mousewheel', zooming)
        this.addEventListener('mousemove', moving)
    }

}

svgTools.svg = function (x, y, width, height) {
    return new svgTools.cSvg(x, y, width, height);
}


// GROUP
svgTools.cGroup = function () {

    this.offset = { x: 0, y: 0 }
    this.element = document.createElementNS(svgTools.xmlns, "g");
    this.isSvgToolsObject = true;
}

svgTools.cGroup.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cGroup.prototype.getElement = function () { return this.element; }

svgTools.cGroup.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
    this.offset.x = x
    this.offset.y = y
}

svgTools.cGroup.prototype.shiftX = function (value) {
    this.offset.x += value
    this.element.setAttributeNS(null, 'transform', 'translate(' + this.offset.x + ')');
}

svgTools.cGroup.prototype.removeChildren = function () {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
}

svgTools.cGroup.prototype.remove = function () {
    this.element.remove()
}

svgTools.group = function () {

    return new svgTools.cGroup();
}


// RECTANGLE
svgTools.cRectangle = function (width, height, attributes) {

    this.width = width
    this.height = height
    this.element = document.createElementNS(svgTools.xmlns, "path");
    this.element.setAttributeNS(null, 'd', 'M0,0 h' + width + ' v' + height + ' h-' + width + ' z');

    if (attributes) Object.keys(attributes).forEach(function (key) {
        this.element.setAttributeNS(null, key, attributes[key])
    }, this)

    this.isSvgToolsObject = true;
}

svgTools.cRectangle.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cRectangle.prototype.getElement = function () { return this.element; }

svgTools.cRectangle.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
}

svgTools.cRectangle.prototype.addEventListener = function (type, listener) {
    this.element.addEventListener(type, listener, false)
}

svgTools.rectangle = function (width, height, attributes) {
    return new svgTools.cRectangle(width, height, attributes)
}


// CLIPBOX
svgTools.cClipPathRectangle = function (id, x, y, width, height) {

    this.element = document.createElementNS(svgTools.xmlns, "clipPath");
    this.element.id = id

    const rect = document.createElementNS(svgTools.xmlns, "rect")
    rect.setAttributeNS(null, 'x', x)
    rect.setAttributeNS(null, 'y', y)
    rect.setAttributeNS(null, 'width', width)
    rect.setAttributeNS(null, 'height', height)
    this.element.appendChild(rect)

    this.isSvgToolsObject = true;
}

svgTools.cClipPathRectangle.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.clippathRectangle = function (id, x, y, width, height) {
    return new svgTools.cClipPathRectangle(id, x, y, width, height)
}


// TEXT
svgTools.cText = function (text, attributes) {

    this.element = document.createElementNS(svgTools.xmlns, "text");
    this.element.textContent = text

    if (attributes) Object.keys(attributes).forEach(function (key) {
        this.element.setAttributeNS(null, key, attributes[key])
    }, this)

    this.isSvgToolsObject = true;
}

svgTools.cText.prototype.appendToParent = function (parent) {

    if (parent.isSvgToolsObject)
        parent.element.appendChild(this.element);
    else parent.appendChild(this.element);
}

svgTools.cText.prototype.move = function (x, y) {
    this.element.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ')');
}

svgTools.text = function (text, attributes) {
    return new svgTools.cText(text, attributes)
}