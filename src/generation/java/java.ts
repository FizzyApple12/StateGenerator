import { Graph } from "../../components/GraphEditor";
import connectionsTemplate from "./ConnectionsTemplate.java?raw";
import enumTemplate from "./EnumTemplate.java?raw";
import { StateNodeData } from "../../components/StateNode";
import prettier from "prettier/standalone";
import babel from "@babel/parser";
import { Substate } from "../../contexts/SubStatesContext";

export const generateConnections = (graph: Graph): string => {
    const connections = graph.connections
        .map((edge) => {
            const fromNode = graph.nodes.find((node) => node.id == edge.source);
            const toNode = graph.nodes.find((node) => node.id == edge.target);

            if (!fromNode || !toNode) return;

            const fromNodeData = fromNode.data as StateNodeData;
            const toNodeData = toNode.data as StateNodeData;

            return `add(new StateConnection<${graph.stateMachineName}State>(
                new ${graph.stateMachineName}State(${Object.entries(fromNodeData.values).map((value) => `${value[0]}.${value[1]}`).join(", ")}),
                new ${graph.stateMachineName}State(${Object.entries(fromNodeData.values).map((value) => `${value[0]}.${value[1]}`).join(", ")})
            ));`;
        })
        .join("\n");

    const newFile = connectionsTemplate.replace(
        "{$Connections}",
        connections
    ).replace(
        "{$ClassName}",
        `${graph.stateMachineName}Connections`
    ).replace(
        "{$StateName}",
        `${graph.stateMachineName}State`
    );

    return newFile;

    //return prettier.format(newFile, { parser: "java", plugins: [ prettierPluginJava ] });
};

export const generateState = (substate: Substate): string => {
    const states = substate.values.join(",\n    ");

    const newFile = enumTemplate.replace(
        "{$States}",
        states
    ).replace(
        "{$EnumName}",
        `${substate.name}`
    );

    return newFile;

    //return prettier.format(newFile, { parser: "java", plugins: [ prettierPluginJava ] });
};

export const parseEnum = (data: string): [string, string[]] | undefined => {
    const enumName = data.match(/(?<=(enum\s+))(\w+)(?=\s*{)/gm)?.at(0);
    const enumData = data.match(/(?<=(enum\s+\w+\s*{))([\s\S]+)(?=})/gm)?.at(0);

    if (!enumName || !enumData) return;

    const enumFields = enumData.match(/((?<=^(\s*))(?=[\s\S]*)\w+)/gm);

    if (!enumFields || enumFields.length == 0) return;

    return [enumName, enumFields];
};
