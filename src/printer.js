'use strict';

let resolution = {"x": 2560, "y": 1600};
let width_mm = 2560 * 0.0076;

function aspectRatio()
{
    return resolution.x / resolution.y;
}

function pixels()
{
    return resolution.x * resolution.y;
}

// Returns a scale ratio of OpenGL units per mm
function getGLscale()
{
    return 2 * aspectRatio() / width_mm;
}

module.exports = {'resolution': resolution,
                  'aspectRatio': aspectRatio,
                  'pixels': pixels,
                  'getGLscale': getGLscale};
