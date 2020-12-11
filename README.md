# Treemap-chart
Treemap chart have always seemed interesting to me. I browsed a little, found this algorithm https://www.win.tue.nl/~vanwijk/stm.pdf and decided to try to program it ...

<p align="center">
  <img src="https://github.com/ivanuci/Treemap-chart/blob/main/example.gif" alt="example.gif">
</p>

## Usage

### Include in html:
 * <script type="text/javascript" src="treemap.min.js"></script> <!-- optional -->

### Simple call:
<body>
  <div id="treemapDiv"></div>
  <script>
    treeMap.create("treemapDiv", 600, 400, [6, 2, 1, 3, 6, 2, 4])
  </script>
</body>

For more about usage have look at file example.html.
