import { FC, PropsWithChildren, createContext, useState } from "react";
import { Graph } from "../components/GraphEditor";

const getLocalStorage = (key: string) => {
    const value = window.localStorage.getItem(key);

    if (!value) return undefined;

    return JSON.parse(value);
}

const setLocalStorage = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
}

type GraphContextType = {
    graph: Graph,

    availableGraphs: {
        name: string,
        index: number
    }[],

    selectActiveGraph: (graphNumber: number) => void,
    updateActiveGraph: (graph: Graph) => void,
    addGraph: (graphName: string) => void,
    removeGraph: (graphNumber: number) => void,
}

type WorkspaceType = {
    selectedGraph: number,

    mainGraph: Graph,

    subGraphs: Graph[],
}

export const GraphContext = createContext<GraphContextType>(getLocalStorage("GraphContext") || {
    graph: {
        name: "main",

        nodes: [],

        connections: [],
    },
    availableGraphs: [{
        name: "main",
        index: -1
    }],
    selectActiveGraph: (n) => { },
    updateActiveGraph: (n) => { },
    addGraph: (n) => { },
    removeGraph: (n) => { },
});

export const GraphContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [workspace, setWorkspace] = useState<WorkspaceType>(getLocalStorage("Workspace") || {
        selectedGraph: -1,

        mainGraph: {
            name: "main",

            nodes: [],

            connections: [],
        },

        subGraphs: []
    });
    
    setLocalStorage("Workspace", workspace);

    const selectActiveGraph = (graphNumber: number) => {
        setWorkspace({
            ...workspace,
            selectedGraph: graphNumber
        });
    }

    const updateActiveGraph = (graph: Graph) => {
        const filteredNodes = graph.nodes.filter((node, index, nodes) => {
            return nodes.findIndex((nodeCheck) => node.id == nodeCheck.id) == index;
        })

        const correctedGraph: Graph = {
            name: graph.name,

            nodes: filteredNodes,
            
            connections: graph.connections.filter((edge, index, edges) => {
                return (edges.findIndex((edgeCheck) => edge.target == edgeCheck.target && edge.source == edgeCheck.source) == index)
                    && filteredNodes.find((node) => node.id == edge.source)
                    && filteredNodes.find((node) => node.id == edge.target);
            })
        };

        if (workspace.selectedGraph == -1) {
            setWorkspace({
                ...workspace,
                mainGraph: correctedGraph
            });
        } else {
            setWorkspace({
                ...workspace,
                subGraphs: workspace.subGraphs.map((storedGraph, index) => {
                    if (index == workspace.selectedGraph) return correctedGraph;
                    return storedGraph;
                })
            });
        }
    }

    const addGraph = (graphName: string) => {
        setWorkspace({
            ...workspace,
            subGraphs: [
                ...workspace.subGraphs,
                {
                    name: graphName,

                    nodes: [],

                    connections: [],
                }
            ]
        });
    }

    const removeGraph = (index: number) => {
        setWorkspace({
            ...workspace,
            subGraphs: workspace.subGraphs.filter((subgraph, subgraphIndex) => subgraphIndex != index),
            selectedGraph: (workspace.selectedGraph == index) ? -1 : workspace.selectedGraph
        });
    }

    return (
        <GraphContext.Provider value={{
            graph: (workspace.selectedGraph == -1) ? workspace.mainGraph : workspace.subGraphs[workspace.selectedGraph],
            availableGraphs: workspace.subGraphs.map((graph, index) => ({
                name: graph.name,
                index: index
            })),
            selectActiveGraph,
            updateActiveGraph,
            addGraph,
            removeGraph
        }}>
            {children}
        </GraphContext.Provider>
    )
}