# Treemap-chart
Treemap chart have always seemed interesting to me. I browsed a little, found this algorithm https://www.win.tue.nl/~vanwijk/stm.pdf and decided to program it ...

<p align="center">
  <img src="https://github.com/ivanuci/Treemap-chart/blob/main/example.gif" alt="example.gif">
</p>

## Usage

### Include in html:
```html
 <script type="text/javascript" src="treemap.min.js"></script>
```

### Simple call:
```html
<body>
  <div id="treemapDiv"></div>
  <script>
    treeMap.create("treemapDiv", 600, 400, [6, 2, 1, 3, 6, 2, 4])
  </script>
</body>
```
For more about usage have look at file <a href="https://github.com/ivanuci/Treemap-chart/blob/main/example.html">example.html</a>.

## Config
Possible definitions with treeMap.config...
```html
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
    gradient: gradient,   // gradient.set(["blue", "green", "red"])
    text: {
        size: 12,         // percent of rectangle (square) side
        margin: 5,        // percent of rectangle side
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
```
