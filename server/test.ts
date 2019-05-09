import {
  ArgdownApplication,
  IArgdownRequest,
  ParserPlugin,
  ModelPlugin,
  ColorPlugin,
  ClosedGroupPlugin,
  PreselectionPlugin,
  StatementSelectionPlugin,
  ArgumentSelectionPlugin,
  MapPlugin,
  GroupPlugin,
  DotExportPlugin,
  HtmlExportPlugin
  } from "@argdown/core";
  
  const app = new ArgdownApplication();
  
  const parserPlugin = new ParserPlugin();
  app.addPlugin(parserPlugin, "parse-input");
  
  const modelPlugin = new ModelPlugin();
  app.addPlugin(modelPlugin, "build-model");
  
  const colorPlugin = new ColorPlugin();
  app.addPlugin(colorPlugin, "build-model");

  const preselectionPlugin = new PreselectionPlugin();
  app.addPlugin(preselectionPlugin, "build-map");

  const statementSelectionPlugin = new StatementSelectionPlugin();
  app.addPlugin(statementSelectionPlugin, "build-map");
  
  const argumentSelectionPlugin = new ArgumentSelectionPlugin();
  app.addPlugin(argumentSelectionPlugin, "build-map");

  const mapPlugin = new MapPlugin();
  app.addPlugin(mapPlugin, "build-map");

  const groupPlugin = new GroupPlugin();
  app.addPlugin(groupPlugin, "build-map");

  const closedGroupPlugin = new ClosedGroupPlugin();
  app.addPlugin(closedGroupPlugin, "transform-closed-groups");

  const dotExport = new DotExportPlugin();
  app.addPlugin(dotExport, "export-dot");
  
  const htmlExportPlugin = new HtmlExportPlugin();
  app.addPlugin(htmlExportPlugin, "export-html");
  
  const input = `
  # My first Argdown document
  
  [S1]: a statement
     - [A1]: an argument
  `;
  const request:IArgdownRequest = {
   input,
   process: [ "parse-input", 
              "build-model", 
              "build-map",
              "transform-closed-groups",
              "colorize",
              "export-dot"
            ],
   logLevel: "verbose"
  }
  const response = app.run(request);
  console.log(response.dot);