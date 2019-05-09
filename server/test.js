"use strict";
exports.__esModule = true;
var core_1 = require("@argdown/core");

function ArgDownToSVG(input) {
    var app = new core_1.ArgdownApplication();
    var parserPlugin = new core_1.ParserPlugin();
    app.addPlugin(parserPlugin, "parse-input");
    var modelPlugin = new core_1.ModelPlugin();
    app.addPlugin(modelPlugin, "build-model");
    var colorPlugin = new core_1.ColorPlugin();
    app.addPlugin(colorPlugin, "build-model");
    var preselectionPlugin = new core_1.PreselectionPlugin();
    app.addPlugin(preselectionPlugin, "build-map");
    var statementSelectionPlugin = new core_1.StatementSelectionPlugin();
    app.addPlugin(statementSelectionPlugin, "build-map");
    var argumentSelectionPlugin = new core_1.ArgumentSelectionPlugin();
    app.addPlugin(argumentSelectionPlugin, "build-map");
    var mapPlugin = new core_1.MapPlugin();
    app.addPlugin(mapPlugin, "build-map");
    var groupPlugin = new core_1.GroupPlugin();
    app.addPlugin(groupPlugin, "build-map");
    var closedGroupPlugin = new core_1.ClosedGroupPlugin();
    app.addPlugin(closedGroupPlugin, "transform-closed-groups");
    var dotExport = new core_1.DotExportPlugin();
    app.addPlugin(dotExport, "export-dot");
    var htmlExportPlugin = new core_1.HtmlExportPlugin();
    app.addPlugin(htmlExportPlugin, "export-html");
    var request = {
        input: input,
        process: ["parse-input",
            "build-model",
            "build-map",
            "transform-closed-groups",
            "colorize",
            "export-dot"
        ],
        logLevel: "verbose"
    };
    var response = app.run(request);
    console.log(response.dot);
}

export default ArgDownToSVG;