'use strict';

let fs = require('fs');
let path = require('path');
let _ = require('underscore');
let s = require('underscore.string');
_.mixin(s.exports());

let viewport = require('./viewport.js');
let printer = require('./printer.js');
let ui = require('./ui.js');
let png = require('./png/png.js');

const fileInput = document.getElementById('upload');

function next(i, n)
{
  if (i <= n)
  {
    let glData = viewport.getSliceAt(i / n);
    let grayscaleData = new Uint8Array(printer.pixels());
    for(let j=0; j<printer.pixels(); j++) {
      grayscaleData[j] = glData[4*j];
    }

    let index = _.lpad(i.toString(), 6, '0');
    let slicesPath = path.join(path.dirname(fileInput.files[0].path), 'slices');
    if (!fs.existsSync(slicesPath)){
      fs.mkdirSync(slicesPath);
    }
    let fn = path.join(slicesPath, 'out' + index + '.png');
    png.save(fn, grayscaleData, printer.resolution.x, printer.resolution.y);
    requestAnimationFrame(function() { next(i + 1, n); });
  }
  else
  {
    ui.setStatus("");
    ui.enableButtons();
  }
}

// Assign callback to the "slices" button
document.getElementById("slice").onclick = function(event)
{
  if (!viewport.hasModel())
  {
    ui.setStatus("No model loaded!");
    return;
  }

  ui.disableButtons();

  let layerThicknessMicron = document.getElementById("height").value;
  let bounds = viewport.getBounds();

  // We map 3 inches to +/-1 on the X axis, so we use that ratio
  // to convert to Z in inches
  let zrange_mm = (bounds.zmax - bounds.zmin) / printer.getGLscale();
  let count = Math.floor((zrange_mm * 1000 + 0.01) / layerThicknessMicron);

  ui.setStatus("Slicing...");
  next(1, count);
}
