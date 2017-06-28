//Base Geometry for the Symbol ###########################################################
var ms = require("../ms.js");

module.exports = function basegeometry() {
  var modifier;
  var drawArray1 = [];
  var drawArray2 = [];
  var frameColor = this.colors.frameColor[this.properties.affiliation];

  //If unframed but with icon, then just return.
  if (!this.properties.frame && this._options.icon) {
    return [];
  }

  //Clone the base geometry
  var geom = { type: this.properties.baseGeometry.g.type };
  switch (geom.type) {
    case "path":
      geom.d = this.properties.baseGeometry.g.d;
      break;
    case "circle":
      geom.cx = this.properties.baseGeometry.g.cx;
      geom.cy = this.properties.baseGeometry.g.cy;
      geom.r = this.properties.baseGeometry.g.r;
  }
  geom.fill = this.colors.fillColor[this.properties.affiliation];
  geom.fillopacity = this._options.fillOpacity;
  geom.stroke = frameColor;
  geom.strokewidth = this._options.size >= 10 ? this._options.strokeWidth : 10;
  //outline
  if (this._options.frame && this._options.outlineWidth > 0) {
    var outline;
    if (geom.type == "path" && this._options.fill && !this._options.monoColor) {
      outline = { type: this.properties.baseGeometry.g.type };
      outline.d = this.properties.baseGeometry.g.d + " Z"; //Making sure the path is closed
      outline.strokewidth = this._options.size >= 10
        ? this._options.strokeWidth
        : 10;
    } else {
      outline = geom;
    }
    drawArray1.push(
      ms.outline(
        outline,
        this._options.outlineWidth,
        this._options.strokeWidth,
        this._options.outlineColor
      )
    );
  }
  //Add a dashed outline to the frame if we are using monocolor and the status is not present.
  if (
    (this._options.monoColor != "" || !this._options.fill) &&
    this.properties.notpresent
  )
    geom.strokedasharray = this.properties.notpresent;
  drawArray2.push(geom);

  // Dismounted Individual
  if (this.properties.dismounted) {
    modifier = {
      Neutral: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 92.6 140.1 L 92.6 151.6 L 100 155 L 108 151.3 L 108 140.1 L 92.6 140.1 z "
      },
      Unknown: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 92.5 147.1 L 92.5 156.5 L 99.8 162 L 107.5 156.3 L 107.5 147.1 L 92.5 147.1 z "
      }
    };
    if (modifier.hasOwnProperty(this.properties.affiliation))
      drawArray2.push(modifier[this.properties.affiliation]);
  }
  // Space Modifiers
  if (this.properties.space) {
    modifier = {
      Friend: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 100,30 C 90,30 80,35 68.65625,50 l 62.6875,0 C 120,35 110,30 100,30"
      },
      Hostile: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M67,50 L100,20 133,50 z"
      },
      Neutral: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M45,50 l0,-20 110,0 0,20 z"
      },
      Unknown: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 100 22.5 C 85 22.5 70 31.669211 66 50 L 134 50 C 130 31.669204 115 22.5 100 22.5 z"
      }
    };
    drawArray2.push(modifier[this.properties.affiliation]);
  }
  // Modifiers for activity.
  if (this.properties.activity) {
    modifier = {
      Friend: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "m 160,135 0,15 15,0 0,-15 z m -135,0 15,0 0,15 -15,0 z m 135,-85 0,15 15,0 0,-15 z m -135,0 15,0 0,15 -15,0 z"
      },
      Hostile: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 100 28 L 89.40625 38.59375 L 100 49.21875 L 110.59375 38.59375 L 100 28 z M 38.6875 89.3125 L 28.0625 99.9375 L 38.6875 110.53125 L 49.28125 99.9375 L 38.6875 89.3125 z M 161.40625 89.40625 L 150.78125 100 L 161.40625 110.59375 L 172 100 L 161.40625 89.40625 z M 99.9375 150.71875 L 89.3125 161.3125 L 99.9375 171.9375 L 110.53125 161.3125 L 99.9375 150.71875"
      },
      Neutral: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "m 140,140 15,0 0,15 -15,0 z m -80,0 0,15 -15,0 0,-15 z m 80,-80 0,-15 15,0 0,15 z m -80,0 -15,0 0,-15 15,0 z"
      },
      Unknown: {
        type: "path",
        stroke: false,
        fill: frameColor,
        d: "M 107.96875 31.46875 L 92.03125 31.71875 L 92.03125 46.4375 L 107.71875 46.4375 L 107.96875 31.46875 z M 47.03125 92.5 L 31.09375 92.75 L 31.09375 107.5 L 46.78125 107.5 L 47.03125 92.5 z M 168.4375 92.5 L 152.5 92.75 L 152.5 107.5 L 168.1875 107.5 L 168.4375 92.5 z M 107.96875 153.5625 L 92.03125 153.8125 L 92.03125 168.53125 L 107.71875 168.53125 L 107.96875 153.5625 z"
      }
    };
    drawArray2.push(modifier[this.properties.affiliation]);
  }
  //Add a dashed outline to the frame if the status is not present.
  if (
    this._options.fill &&
    this._options.frame &&
    this.properties.notpresent &&
    !this.properties.unframed
  ) {
    //Clone the base geometry
    geom = { type: this.properties.baseGeometry.g.type };
    switch (geom.type) {
      case "path":
        geom.d = this.properties.baseGeometry.g.d;
        break;
      case "circle":
        geom.cx = this.properties.baseGeometry.g.cx;
        geom.cy = this.properties.baseGeometry.g.cy;
        geom.r = this.properties.baseGeometry.g.r;
    }
    geom.fill = false;
    geom.stroke = this.colors.white[this.properties.affiliation];
    geom.strokewidth = parseFloat(this._options.strokeWidth) + 1;
    geom.strokedasharray = this.properties.notpresent;
    drawArray2.push(geom);
  }
  return {
    pre: drawArray1,
    post: drawArray2,
    bbox: this.properties.baseGeometry.bbox
  };
};
