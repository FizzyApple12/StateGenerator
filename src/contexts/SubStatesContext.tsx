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

export type Substate = {
    name: string,

    values: string[]
}

type SubstatesContextType = {
    substates: Substate[]

    setSubStates: (substates: Substate[]) => void
    addSubstate: (name: string, value: string[]) => void
    addToSubstate: (name: string, value: string) => void
    removeSubstate: (name: string) => void
    removeFromSubstate: (name: string, value: string) => void
}

export const SubstatesContext = createContext<SubstatesContextType>(getLocalStorage("SubstatesContext") || {
    substates: [],

    setSubStates: (n) => {},
    addSubstate: (n, j) => { },
    addToSubstate: (n) => { },
    removeSubstate: (n) => { },
    removeFromSubstate: (n, j) => { },
});

export const SubstatesContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [substates, setSubStates] = useState<Substate[]>(getLocalStorage("Substates") || []);

    setLocalStorage("Substates", substates);

    const addSubstate = (name: string, values: string[]) => {
        const substate = substates.findIndex((value) => value.name == name);
        if (substate >= 0) {
            let newSubstates = substates;

            newSubstates[substate] = {
                name,
                values
            };

            setSubStates(newSubstates)

            return;
        }

        setSubStates([
            ...substates,
            {
                name,
                values
            }
        ])
    }

    const addToSubstate = (name: string, value: string) => {
        setSubStates(substates.map((substate) => {
            if (substate.name == name) {
                return {
                    name,

                    values: [
                        ...substate.values,
                        value
                    ]
                }
            }

            return substate;
        }));
    }

    const removeSubstate = (name: string) => {
        setSubStates(substates.filter((substate) => substate.name != name));
    }

    const removeFromSubstate = (name: string, value: string) => {
        setSubStates(substates.map((substate) => {
            if (substate.name == name) {
                return {
                    name,

                    values: substate.values.filter((substateValue) => substateValue != value)
                }
            }

            return substate;
        }));
    }

    return (
        <SubstatesContext.Provider value={{
            substates: substates,
            setSubStates,
            addSubstate,
            addToSubstate,
            removeSubstate,
            removeFromSubstate
        }}>
            {children}
        </SubstatesContext.Provider>
    )
}