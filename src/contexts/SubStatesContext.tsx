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

type Substate = {
    name: string,

    values: string[]
}

type SubstatesContextType = {
    substates: Substate[]

    addSubstate: (name: string) => void
    addSubstateValue: (name: string, value: string) => void
    removeSubstate: (name: string) => void
}

export const SubstatesContext = createContext<SubstatesContextType>(getLocalStorage("SubstatesContext") || {
    substates: [],

    addSubstate: (n) => { },
    addSubstateValue: (n) => { },
    removeSubstate: (n) => { },
});

export const SubstatesContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [substates, setSubStates] = useState<Substate[]>(getLocalStorage("Substates") || []);

    setLocalStorage("Substates", substates);

    const addSubstate = (name: string) => {
        setSubStates([
            ...substates,
            {
                name,

                values: []
            }
        ])
    }

    const addSubstateValue = (name: string, value: string) => {
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

    return (
        <SubstatesContext.Provider value={{
            substates: substates,
            addSubstate,
            addSubstateValue,
            removeSubstate
        }}>
            {children}
        </SubstatesContext.Provider>
    )
}