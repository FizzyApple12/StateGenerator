
import { Graph } from '../components/GraphEditor';
import connectionsTemplate from './ConnectionsTemplate.java?raw';
import { StateNodeData } from '../components/StateNode'
import prettier from 'prettier/standalone';
import babel from '@babel/parser';

export const generate = (graph:  Graph): string => {
    const connectionAdds = graph.connections.map((edge) => {
            const fromNode = graph.nodes.find((node) => node.id == edge.source);
            const toNode = graph.nodes.find((node) => node.id == edge.target);

            if (!fromNode || !toNode) return;

            const fromNodeData = fromNode.data as StateNodeData;
            const toNodeData = toNode.data as StateNodeData;

            return `add(new StateConnection<ArmState>(
                new ArmState(ShoulderState.${fromNodeData.values['ShoulderState']}, ForearmState.${fromNodeData.values['ForearmState']}, HopperState.${fromNodeData.values['HopperState']}),
                new ArmState(ShoulderState.${toNodeData.values['ShoulderState']}, ForearmState.${toNodeData.values['ForearmState']}, HopperState.${toNodeData.values['HopperState']})
            ));`
        }).join('\n');

    const newFile = connectionsTemplate.replace("{$$$StateAdds}", connectionAdds);

    return newFile;
}