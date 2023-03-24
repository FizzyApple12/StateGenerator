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

    updateGraph: (graph: Graph) => void,
}

export const GraphContext = createContext<GraphContextType>(getLocalStorage("GraphContext") || {
    graph: {
        nodes: [],

        connections: [],
    },
    updateGraph: (n) => { },
});

export const GraphContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [graph, setGraph] = useState<Graph>(getLocalStorage("Graph") || {
        nodes: [],

        connections: [],
    });
    
    setLocalStorage("Graph", graph);

    const updateGraph = (graph: Graph) => {
        const filteredNodes = graph.nodes.filter((node, index, nodes) => {
            return nodes.findIndex((nodeCheck) => node.id == nodeCheck.id) == index;
        })

        setGraph({
            stateMachineName: graph.stateMachineName,

            nodes: filteredNodes,
            
            connections: graph.connections.filter((edge, index, edges) => {
                return (edges.findIndex((edgeCheck) => edge.target == edgeCheck.target && edge.source == edgeCheck.source) == index)
                    && filteredNodes.find((node) => node.id == edge.source)
                    && filteredNodes.find((node) => node.id == edge.target);
            })
        });
    }

    return (
        <GraphContext.Provider value={{
            graph,
            updateGraph,
        }}>
            {children}
        </GraphContext.Provider>
    )
}