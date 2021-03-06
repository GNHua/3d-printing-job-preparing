'use strict';

function disableButtons()
{
  document.getElementById("slice").disabled = true;
  document.getElementById("upload").disabled = true;
}

function enableButtons()
{
  document.getElementById("slice").disabled = false;
  document.getElementById("upload").disabled = false;
}

function setStatus(txt)
{
  document.getElementById("status").innerHTML = txt;
}

// Returns the scale ratio mm per stl unit
function getStlScale()
{
  return document.getElementById("mm").value;
}

module.exports = {'disableButtons': disableButtons,
                  'enableButtons': enableButtons,
                  'setStatus': setStatus,
                  'getStlScale': getStlScale};
