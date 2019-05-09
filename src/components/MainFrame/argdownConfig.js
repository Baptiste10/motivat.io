import {
    StatementSelectionMode,
    LabelMode
} from '@argdown/core'

import _ from "lodash"

import { dagreDefaultSettings } from "@argdown/map-views";
import { vizJsDefaultSettings } from "@argdown/map-views";

export default {
    selection: {
        excludeDisconnected: true,
        statementSelectionMode: StatementSelectionMode.WITH_TITLE
    },
    map: {
        statementLabelMode: LabelMode.HIDE_UNTITLED,
        argumentLabelMode: LabelMode.HIDE_UNTITLED
    },
    group: {
        groupDepth: 2
    },
    dot: {
        graphVizSettings: {
            rankdir: "BT",
            concentrate: "false",
            ratio: "auto",
            size: "10,10"
        }
    },
    dagre: _.defaultsDeep({}, dagreDefaultSettings),
    vizJs: _.defaultsDeep({}, vizJsDefaultSettings),
    model: {
        removeTagsFromText: false
    },
    logLevel: "error"
}