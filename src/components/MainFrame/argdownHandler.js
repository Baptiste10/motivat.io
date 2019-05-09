import _ from "lodash"
import {
    ArgdownApplication,
    ParserPlugin,
    ModelPlugin,
    RegroupPlugin,
    ClosedGroupPlugin,
    ColorPlugin,
    HtmlExportPlugin,
    JSONExportPlugin,
    DataPlugin,
    PreselectionPlugin,
    StatementSelectionPlugin,
    ArgumentSelectionPlugin,
    MapPlugin,
    GroupPlugin,
    DotExportPlugin,
    GraphMLExportPlugin
} from "@argdown/core";

import { VizJsMap } from '@argdown/map-views'

import config from './argdownConfig'

const app = new ArgdownApplication();
const parserPlugin = new ParserPlugin();
const dataPlugin = new DataPlugin();
const modelPlugin = new ModelPlugin();
const regroupPlugin = new RegroupPlugin();
const colorPlugin = new ColorPlugin();

const htmlExport = new HtmlExportPlugin({
    headless: true
});
const jsonExport = new JSONExportPlugin({
    removeEmbeddedRelations: true
});
const preselectionPlugin = new PreselectionPlugin();
const statementSelectionPlugin = new StatementSelectionPlugin();
const argumentSelectionPlugin = new ArgumentSelectionPlugin();
const mapPlugin = new MapPlugin();
const groupPlugin = new GroupPlugin();
const dotExport = new DotExportPlugin();
const graphMLExport = new GraphMLExportPlugin();

app.addPlugin(parserPlugin, "parse-input");
app.addPlugin(dataPlugin, "build-model");
app.addPlugin(modelPlugin, "build-model");
app.addPlugin(regroupPlugin, "build-model");
app.addPlugin(colorPlugin, "colorize");
app.addPlugin(preselectionPlugin, "build-map");
app.addPlugin(statementSelectionPlugin, "build-map");
app.addPlugin(argumentSelectionPlugin, "build-map");
app.addPlugin(mapPlugin, "build-map");
app.addPlugin(groupPlugin, "build-map");
app.addPlugin(new ClosedGroupPlugin(), "transform-closed-groups");
app.addPlugin(htmlExport, "export-html");
app.addPlugin(dotExport, "export-dot");
app.addPlugin(graphMLExport, "export-graphml");
app.addPlugin(jsonExport, "export-json");


export default class ArgdownHandler {
    constructor(input) {
        const request = {
            input,
            process: ["parse-input", "build-model", "export-html"],
            logLevel: "verbose"
        }

        try {
            this.data = app.run(request);
        } catch (e) {
            if (request.logLevel === "verbose") {
                console.log(e);
            }
            return {};
        }
    }

    getHtml() {
        if (!this.data.ast) {
            return null;
        }
        const request = _.defaultsDeep({
                process: ["colorize", "export-html"]
            },
            this.data.frontMatter,
            config
        );
        const response = app.run(request, this.data);
        return response.html;
    }

    getDot() {
        if (!this.data.ast) {
            return null;
        }
        const request = _.defaultsDeep({
                process: [
                    "build-map",
                    "transform-closed-groups",
                    "colorize",
                    "export-dot"
                ]
            },
            this.data.frontMatter,
            config
        );
        const response = app.run(request, this.data);
        return response.dot;
    }

    generateImage (svgContainer) {
        this.viz = new VizJsMap(svgContainer, {
            workerURL: "/full.render.js"
        });

        this.viz.render({
            dot: this.getDot(),
            settings: config.vizJs
        })
    }
}