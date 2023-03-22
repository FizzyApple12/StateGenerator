import { ActionIcon, Box, Button, Menu, MultiSelect, Popover, Select, Text, TextInput } from "@mantine/core";
import { IconNewSection, IconVariablePlus, IconZoomIn, IconZoomOut, IconAspectRatio, IconLockAccess, IconLockAccessOff } from "@tabler/icons-react";
import { FC, useContext, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    ControlButton,
    Controls, MiniMap,
    Node, applyEdgeChanges, Edge, applyNodeChanges, addEdge, useReactFlow, MarkerType, NodeTypes, EdgeTypes
} from "reactflow";
import "reactflow/dist/style.css";
import z from "zod";
import GraphEditorControls from "./GraphEditorControls";
import { modals } from "@mantine/modals";
import { SubstatesContext } from "../contexts/SubStatesContext";
import { StateNode } from "./StateNode";
import { FloatingEdge } from "./FloatingEdge";
import { FloatingConnectionLine } from "./FloatingConnectionLine";
import hash from 'object-hash';

export type Graph = {
    name: string,

    nodes: Node[],

    connections: Edge[],
};

type GraphEditorParams = {
    graph: Graph;
    onChange: (graph: Graph) => void;
};

const nodeTypes: NodeTypes = {
    stateNode: StateNode,
};

const edgeTypes: EdgeTypes = {
    floating: FloatingEdge,
};

const defaultEdgeOptions = {
    type: 'floating',
    markerEnd: {
        type: MarkerType.ArrowClosed,
    },
};

export const GraphEditor: FC<GraphEditorParams> = ({ graph, onChange }) => {
    const [opened, setOpened] = useState(false);

    const [values, setValues] = useState<{ [key: string]: string }>({});

    const {
        substates,
    } = useContext(SubstatesContext);

    const addNode = () => {
        onChange({
            ...graph,
            nodes: applyNodeChanges([{
                type: "add",
                item: {
                    id: hash(values),
                    position: { x: 0, y: 0 },
                    type: 'stateNode',
                    data: {
                        values: values
                    },
                    dragging: true
                }
            }], graph.nodes)
        })

        setValues({});
        setOpened(false);
    }

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
                onNodesChange={(nodeChanges) =>
                    onChange({
                        ...graph,
                        nodes: applyNodeChanges(nodeChanges, graph.nodes)
                    })
                }
                onEdgesChange={(edgeChanges) =>
                    onChange({
                        ...graph,
                        connections: applyEdgeChanges(edgeChanges, graph.connections)
                    })
                }
                onConnect={(connection) =>
                    onChange({
                        ...graph,
                        connections: addEdge(connection, graph.connections)
                    })
                }
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineComponent={FloatingConnectionLine}
            >

                <Popover opened={opened} position="right">
                    <Popover.Target>
                        <GraphEditorControls onToggleAddMenu={() => setOpened(!opened)} />
                    </Popover.Target>
                    <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
                        <Text>Add New State</Text>

                        {
                            substates.map((substate) => (
                                <Select key={substate.name} label={substate.name} data={substate.values} value={values[substate.name]} onChange={(value) => {
                                    if (value) {
                                        setValues({
                                            ...values,
                                            [substate.name]: value
                                        })
                                    }
                                }} />
                            ))
                        }

                        <Button onClick={addNode} disabled={
                            !substates.map((substate) => values[substate.name]).reduce((previous, current) => (current) ? previous : false, true)
                        } fullWidth mt={16}>Add</Button>
                    </Popover.Dropdown>
                </Popover>

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
