import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import { create } from "zustand";
import { Graph } from "./GraphEditor";

const localStorageKeys = {
    activeWorkspace: "active-workspace",
};

const useGraphWorkspaces = create<{
    persistedGraphWorkspaces: Record<string, Graph>;
    setPersistedGraphWorkspaces: (newDBValues: Record<string, Graph>) => void;
}>()((set) => ({
    persistedGraphWorkspaces: {},
    setPersistedGraphWorkspaces: (newDBValues) => set(newDBValues),
}));

const defaultGraph = () => ({
    connections: [],
    nodes: [],
});

const GraphContext = createContext<{ graph: Graph }>({} as any);

export const useGraph = () => useContext(GraphContext);

export const GraphProvider: FC<PropsWithChildren> = ({ children }) => {
    const [currentGraphValue, setCurrentGraphValue] = useState<Graph>(
        defaultGraph()
    );
    const { persistedGraphWorkspaces, setPersistedGraphWorkspaces } =
        useGraphWorkspaces((state) => state);

    const [activeWorkspace, setActiveWorkspace] = useState<
        string | undefined
    >();

    useEffect(() => {
        if (!activeWorkspace) return;

        setCurrentGraphValue(persistedGraphWorkspaces[activeWorkspace]);
    }, [persistedGraphWorkspaces, activeWorkspace]);

    useEffect(() => {
        if (activeWorkspace) {
            localStorage.setItem(
                localStorageKeys.activeWorkspace,
                activeWorkspace
            );
            return;
        }

        const localStorageValue = localStorage.getItem(
            localStorageKeys.activeWorkspace
        );

        if (localStorageValue) {
            setActiveWorkspace(localStorageValue);
        }
    }, [activeWorkspace]);

    return (
        <GraphContext.Provider value={{ graph: currentGraphValue }}>
            {children}
        </GraphContext.Provider>
    );
};
