import { ActionIcon, Box } from "@mantine/core";
import { IconNewSection, IconVariablePlus, IconZoomIn, IconZoomOut, IconAspectRatio, IconLockAccess, IconLockAccessOff } from "@tabler/icons-react";
import { FC } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    ControlButton,
    Controls, MiniMap,
    Node, applyEdgeChanges, Edge, applyNodeChanges, addEdge
} from "reactflow";
import "reactflow/dist/style.css";
import z from "zod";

export const StateType = () => z.string();
export type StateType = z.infer<ReturnType<typeof StateType>>;

export const StateValue = () => z.string();
export type StateValue = z.infer<ReturnType<typeof StateValue>>;

export type Graph = {
    nodes: Node[],

    connections: Edge[],
};

type GraphEditorParams = {
    graph: Graph;
    onChange: (graph: Graph) => void;
};

export const GraphEditor: FC<GraphEditorParams> = ({ graph, onChange }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
            }}
        >
            <ReactFlow
                nodes={graph.nodes}
                edges={graph.connections}
                onNodesChange={(nodeChanges) => {
                    graph.nodes = applyNodeChanges(nodeChanges, graph.nodes);

                    onChange(graph);
                }}
                onEdgesChange={(edgeChanges) => {
                    graph.connections = applyEdgeChanges(edgeChanges, graph.connections);

                    onChange(graph);
                }}
                onConnect={(connection) => {
                    graph.connections = addEdge(connection, graph.connections);

                    onChange(graph);
                }}
                
            >
                <Controls showZoom={false} showFitView={false} showInteractive={false}>
                    <ActionIcon variant="outline" size={32} sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
                        <IconZoomIn/>
                    </ActionIcon >
                    <ActionIcon variant="outline" size={32} radius={0}>
                        <IconZoomOut/>
                    </ActionIcon>
                    <ActionIcon variant="outline" size={32} radius={0}>
                        <IconAspectRatio/>
                    </ActionIcon>
                    <ActionIcon variant="outline" size={32} radius={0}>
                        <IconLockAccess/>
                        <IconLockAccessOff/>
                    </ActionIcon>
                    <ActionIcon variant="outline" size={32} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0}}>
                        <IconVariablePlus/>
                    </ActionIcon>
                </Controls>

                <MiniMap />

                <Background
                    variant={BackgroundVariant.Dots}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
        </Box>
    );
};
