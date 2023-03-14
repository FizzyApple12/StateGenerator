import { z } from "zod";

export const StateNode = () =>
    z.object({
        state: z.string().array()
    })
export type StateNode = z.infer<ReturnType<typeof StateNode>>;

export const StateGrid = () =>
    z.object({
        states: StateNode().array(),
        
        connections: z.number().array()
    });
export type StateGrid = z.infer<ReturnType<typeof StateGrid>>;
