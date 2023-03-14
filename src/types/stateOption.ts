import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const stateOption = () => z.string().refine(() => true);

export const stateOptionDB = create<{
    stateOptions: string[];
    setStateOptions: (newStateOptions: string[]) => void;
}>()(
    persist(
        (set) => ({
            stateOptions: [""],
            setStateOptions: (newStateOptions) =>
                set({
                    stateOptions: z.array(stateOption()).parse(newStateOptions),
                }),
        }),
        { name: "state-options" }
    )
);
