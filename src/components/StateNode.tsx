import { Box, Card, Paper, Text, Image, Group, Badge, Button, Kbd } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Handle, Position, useStore, Node, WrapNodeProps, NodeProps } from 'reactflow';

export type StateNodeProps = NodeProps<{
    values: { [key: string]: string }
}>

export type ConnectionNodeIdState = {
    connectionNodeId: string | null
}

const connectionNodeIdSelector = (state: ConnectionNodeIdState) => state.connectionNodeId;

export const StateNode: FC<StateNodeProps> = ({ data, id, isConnectable }) => {
    const connectionNodeId = useStore(connectionNodeIdSelector);
    const isTarget = connectionNodeId && connectionNodeId !== id;

    return (
        <Card shadow="sm" radius="md" withBorder sx={(theme) => ({
            borderColor: isTarget ? 'lime' : theme.activeStyles.borderColor,
            backgroundColor: isTarget ? 'green' : theme.activeStyles.backgroundColor,
        })}>
            <Handle
                className="targetHandle"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 0,
                    transform: 'none',
                    border: 'none',
                    opacity: 0,
                    zIndex: 2
                }}
                position={Position.Right}
                type="source"
                isConnectable={isConnectable}
            />
            <Handle
                className="targetHandle"
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'blue',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 0,
                    transform: 'none',
                    border: 'none',
                    opacity: 0,
                    zIndex: isTarget ? 3 : 1
                }}
                position={Position.Left}
                type="target"
                isConnectable={isConnectable}
            />

            <Card shadow="sm" radius="md" withBorder sx={{
                zIndex: 4
            }}>
                {
                    Object.entries(data.values).map((entry) => (
                        <Group key={entry[0]} position="apart" mt="md" mb="xs">
                            <Text>
                                {entry[0]}
                            </Text>
                            <Kbd>
                                {entry[1]}
                            </Kbd>
                        </Group>
                    ))
                }
            </Card>
        </Card>
    );
}