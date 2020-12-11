/* js: TreeMap      */
/* author: Ivanuci  */
/* date: 12/02/2020 */
/* algorithm used from https://www.win.tue.nl/~vanwijk/stm.pdf */


const treeMap = {}


treeMap.fStyle = (function () {

    const style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style;
})();
treeMap.fStyle.sheet.insertRule('svg text {-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;}', 0);


treeMap.rows = []
treeMap.data = []
treeMap.config = {
    data: {
        value: null,
        text: null,
        fill: null
    },
    rectangle: {
        svg: {
            'fill': '#779ecb',
            'stroke': 'white',
            'stroke-width': 0.5,
            'vector-effect': 'non-scaling-stroke'
        },
    },
    gradient: gradient,
    text: {
        size: 12,   // percent of rectangle (square) side
        margin: 5,  // percent of rectangle side
        svg: {
            'alignment-baseline': 'middle',
            'text-anchor': 'left',
            'fill': 'white',
            'user-select': 'none',
            'pointer-events': 'none'
        }
    },
    tooltip: null
}

treeMap.cRow = function (sideSize, sideLeft, previousRow) {

    this.sideSize = sideSize
    this.sideLeft = sideLeft
    this.width = sideLeft ? 0 : sideSize
    this.height = sideLeft ? sideSize : 0
    this.areas = []
    this.area = 0

    if (!previousRow) {
        this.x = 0
        this.y = 0
    }
    else {
        this.x = previousRow.sideLeft ? previousRow.x + (previousRow.area / previousRow.sideSize) : previousRow.x
        this.y = previousRow.sideLeft ? previousRow.y : previousRow.y + (previousRow.area / previousRow.sideSize)
    }

    this.relation = function (a, b) {
        return a >= b ? a / b : b / a;
    }

} // treeMap.cRow


treeMap.cRow.prototype.addArea = function (area) {

    this.areas.push(area)
    this.area += area.value
    this.width = this.sideLeft ? (this.area / this.sideSize) : this.sideSize
    this.height = this.sideLeft ? this.sideSize : (this.area / this.sideSize)
    return this;

} // treeMap.cRow.prototype.addArea


treeMap.cRow.prototype.worst = function (area) {

    let areas = area ? this.areas.concat(area) : this.areas
    const areasSum = area ? (this.area + area.value) : this.area
    const areaSideA = areasSum / this.sideSize

    if (areas.length === 1) return this.relation(areaSideA, areas[0].value / areaSideA);

    return Math.max(
        this.relation(areaSideA, areas[0].value / areaSideA),
        this.relation(areaSideA, areas[areas.length - 1].value / areaSideA)
    );

} // treeMap.cRow.prototype.worst


// recursive function to squerify areas 
treeMap.rSquarify = function (mainAreas, row) {

    if (mainAreas.length > 0) {

        const a = mainAreas.shift();

        if (row.area === 0 || row.worst() >= row.worst(a)) {

            treeMap.rSquarify(mainAreas, row.addArea(a))

        }
        else {

            treeMap.rows.push(row);

            const sizeAreasFree = a.value + mainAreas.reduce(function (acc, item) { return acc += item.value; }, 0)
            const otherSideSize = sizeAreasFree / row.sideSize
            const shortestSide = otherSideSize < row.sideSize ? otherSideSize : row.sideSize
            const differentSide = otherSideSize < row.sideSize ? !row.sideLeft : row.sideLeft
            const newRow = new treeMap.cRow(shortestSide, differentSide, row)

            treeMap.rSquarify(mainAreas, newRow.addArea(a));

        }

    }

    else if (row.areas.length > 0) treeMap.rows.push(row);

} // treeMap.rSquarify


treeMap.draw = function (parent, width, height, areas) {

    areas.sort(function (a, b) { return a.value < b.value ? 1 : a.value > b.value ? -1 : 0 });

    // CALCULATE SQUARES

    const areasSum = areas.reduce(function (acc, item) { return acc += item.value; }, 0)
    const factor = Math.sqrt(width * height / areasSum)
    const shortestSide = height < width ? height : width
    const isLeftSide = height < width ? true : false

    treeMap.rows = []
    treeMap.rSquarify(areas, new treeMap.cRow(shortestSide / factor, isLeftSide, null))

    // DRAW SVG

    const svg = svgTools.svg(0, 0, width, height)
    svg.zoom()
    svg.zoom()
    svg.appendToParent(parent)

    treeMap.rows.forEach(function (row) {

        let x = row.x
        let y = row.y
        const sideLeft = row.sideLeft
        const otherSideSize = row.area / row.sideSize

        row.areas.forEach(function (area) {

            const areaDependentSize = area.value / otherSideSize
            const aWidth = sideLeft ? otherSideSize : areaDependentSize
            const aHeight = sideLeft ? areaDependentSize : otherSideSize

            // clone rectangle.svg
            const rectangleSvg = {}
            Object.keys(treeMap.config.rectangle.svg).forEach(function (key) {
                rectangleSvg[key] = treeMap.config.rectangle.svg[key]
            })

            const group = svgTools.group()
            group.move(x * factor, y * factor)
            group.appendToParent(svg)

            if (area.fill) rectangleSvg.fill = area.fill;

            const rect = svgTools.rectangle(aWidth * factor, aHeight * factor, rectangleSvg)

            if (treeMap.config.tooltip) {

                rect.addEventListener('mouseover', function (event) {

                    let title = area.value
                    let titleColor = treeMap.config.text.svg.fill
                    let titleBGColor = rectangleSvg.fill
                    if (area.fill) titleBGColor = area.fill

                    if (typeof treeMap.data[0] === 'object') {
                        textValue = treeMap.data[area.index][treeMap.config.data.value]
                        if (treeMap.config.data.text)
                            title = treeMap.data[area.index][treeMap.config.data.text];
                    }

                    treeMap.config.tooltip.values(title, titleColor, titleBGColor, treeMap.data[area.index])
                    const tooltipSize = treeMap.config.tooltip.element.getBoundingClientRect()
                    const windowSize = { width: window.innerWidth, height: window.innerHeight }
                    const px = event.pageX < (windowSize.width / 2) ? (event.pageX + 15) : (event.pageX - tooltipSize.width - 10)
                    const py = event.pageY < (windowSize.height / 2) ? (event.pageY + 10) : (event.pageY - tooltipSize.height - 10)
                    treeMap.config.tooltip.position(px + "px", py + "px")
                    treeMap.config.tooltip.show()
                });

                rect.addEventListener('mouseout', function () {
                    treeMap.config.tooltip.hide();
                });
            }

            rect.appendToParent(group)

            x = sideLeft ? x : x + areaDependentSize
            y = sideLeft ? y + areaDependentSize : y

            const tBx = rect.width * treeMap.config.text.margin / 100
            const tBy = rect.height * treeMap.config.text.margin / 100
            let textValue = null

            if (treeMap.config.data.text) textValue = treeMap.data[area.index][treeMap.config.data.text];
            else if (typeof treeMap.data[0] !== 'object') textValue = area.value;

            if (textValue) {

                const textSvg = svgTools.svg(tBx, tBy, rect.width - (2 * tBx), rect.height - (2 * tBy))
                textSvg.appendToParent(group)

                const configText = treeMap.config.text.svg
                configText.y = (rect.height - (2 * tBy)) / 2;
                configText['font-size'] = Math.sqrt(rect.width * rect.height) * treeMap.config.text.size / 100

                const text = svgTools.text(textValue, configText)
                text.appendToParent(textSvg);
            }

        }) // row.areas.forEach

    }) // treeMap.rows.forEach

} // treeMap.draw


treeMap.create = function (parentId, width, height, data) {

    const parent = document.getElementById(parentId)
    let areas = []
    let minMax = []

    treeMap.data = data

    if (data && data.length > 0) {

        if (typeof data[0] === 'object') {

            if (treeMap.config.data.fill) {

                minMax = treeMap.data.reduce(function (acc, item) {
                    const val = Number(item[treeMap.config.data.fill])
                    if (!isNaN(val)) {
                        acc[0] = (acc[0] === undefined || val < acc[0]) ? val : acc[0]
                        acc[1] = (acc[1] === undefined || val > acc[1]) ? val : acc[1]
                    }
                    return acc;
                }, []);

            }

            if (treeMap.config.data.value) areas = data.map(function (item, index) {

                const area = {
                    index: index,
                    value: item[treeMap.config.data.value]
                }

                if (minMax.length === 2) {
                    const val = Number(item[treeMap.config.data.fill])
                    if (!isNaN(val))
                        area.fill = treeMap.config.gradient.at((val - minMax[0]) / (minMax[1] - minMax[0]));
                }

                return area;
            })
        }
        else {

            areas = data.map(function (item, index) {
                return {
                    index: index,
                    value: item
                };
            })
        }

        // remove zero values
        areas = areas.filter(function (item) { return item.value > 0; })

    } // if (data && data.length > 0)

    if (areas instanceof Array) treeMap.draw(parent, width, height, areas)

}
