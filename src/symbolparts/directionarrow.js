//Direction Arrow ########################################################################
var ms = require("../ms.js");

module.exports = function directionarrow() {
  var drawArray1 = [];
  var drawArray2 = [];
  var bbox = this.properties.baseGeometry.bbox;
  if (this.properties.baseGeometry.g == "") {
    // in the case we don't have any frame
    bbox = this.bbox; //Set bbox to the current symbols bounds
  }
  var gbbox = new ms.BBox();
  var color =
    this.colors.iconColor[this.properties.affiliation] ||
    this.colors.iconColor["Friend"];

  if (this._options.infoFields) {
    if (this._options.direction && this._options.direction != "") {
      //Movement indicator
      //The length of the lines in a direction of movement indicator is a bit discussed but I use one frame height. (=100px)
      var arrowLength = 95;
      var arrow = [
        {
          type: "rotate",
          degree: this._options.direction,
          x: 100,
          y: 100,
          draw: [
            {
              type: "path",
              fill: color,
              stroke: color,
              strokewidth: this._options.strokeWidth,
              d: "M100,100 l0,-" + (arrowLength - 20) + " -5,3 5,-15 5,15 -5,-3"
            }
          ]
        }
      ];

      gbbox.y1 = Math.min(
        100 -
          Math.cos(this._options.direction / 360 * Math.PI * 2) * arrowLength,
        100
      );
      gbbox.y2 = Math.max(
        100 -
          Math.cos(this._options.direction / 360 * Math.PI * 2) * arrowLength,
        100
      );
      gbbox.x1 = Math.min(
        100 +
          Math.sin(this._options.direction / 360 * Math.PI * 2) * arrowLength,
        100
      );
      gbbox.x2 = Math.max(
        100 +
          Math.sin(this._options.direction / 360 * Math.PI * 2) * arrowLength,
        100
      );

      if (
        this.properties.baseDimension == "Ground" ||
        this.properties.baseDimension == ""
      ) {
        arrow = [
          { type: "translate", x: 0, y: bbox.y2, draw: arrow },
          {
            type: "path",
            fill: color,
            stroke: color,
            strokewidth: this._options.strokeWidth,
            d: "M 100," + bbox.y2 + "l0," + 100
          }
        ];
        gbbox.y2 += bbox.y2 + parseFloat(this._options.strokeWidth);
      }
      //outline
      if (this._options.outlineWidth > 0)
        drawArray1.push(
          ms.outline(
            arrow,
            this._options.outlineWidth,
            this._options.strokeWidth,
            this._options.outlineColor
          )
        );
      //geometry
      drawArray2.push(arrow);
    }
  }
  return { pre: drawArray1, post: drawArray2, bbox: gbbox };
};
