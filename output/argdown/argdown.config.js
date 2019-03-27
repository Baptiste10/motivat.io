const path = require("path");
const SvgToPngExport = require("argdown-png-export").SvgToPngExport;

let pluginSettings = {
  outputDir: path.resolve(__dirname, "./png/"), // the folder where you want to store your png files
  width: 2000, // the width of the pdf file (if height <= width)
  height: 2000, // the height of the pdf file (if width <= height)
  density: 300 // the dpi (pixel per inch density)
};
const pngExport = new SvgToPngExport(pluginSettings);

module.exports = {
  config: {
    plugins: [{ plugin: pngExport, processor: "export-png" }], // adds our plugin to the processor 'export-png'
    processes: { // processes defined here can be executed by using `argdown run [processName]`
        "export-png": ["preprocessor", "parse-input", "build-model", "export-dot", "export-svg", "export-png"]
    },
    process: "export-png" // the process to run if you simply call `argdown`
  }
};