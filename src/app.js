import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

let viewport = require('./viewport.js');

require('./upload.js');
require('./slicer.js');

function main()
{
  viewport.init();
}

main();
