import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateGrid } from "./stateGridTypes";

export const useStateGridDB = create<{
    masterGrid: StateGrid;
    stateGrids: StateGrid[];
    push: (newMatch: StateGrid) => void;
    clear: () => void;
}>()(
    persist(
        (set) => ({
            masterGrid: {
                states: [],
                connections: []
            },
            stateGrids: [],
            push: (newMatch) =>
                set((get) => ({
                    stateGrids: [
                        ...get.stateGrids,
                        newMatch
                    ],
                })),
            clear: () => set({ 
                stateGrids: [
                    {
                        states: [],
                        connections: []
                    } 
                ] 
            }),
        }),
        { name: "match-db" }
    )
);
