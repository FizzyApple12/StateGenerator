import { forwardRef, memo, useEffect, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';
import cc from 'classcat';
import { useStore, useStoreApi, useReactFlow, Panel } from '@reactflow/core';
import { ActionIcon } from '@mantine/core';
import { IconAspectRatio, IconVariablePlus, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { Controls } from 'reactflow';

type GraphEditorControlsParams = {
    onToggleAddMenu: () => void;
}

const GraphEditorControls = forwardRef<HTMLButtonElement, GraphEditorControlsParams>(({
    onToggleAddMenu
}, ref) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    const onZoomInHandler = () => {
        zoomIn();
    };

    const onZoomOutHandler = () => {
        zoomOut();
    };

    const onFitViewHandler = () => {
        fitView(undefined);
    };

    return (
        <Panel
            className={cc(['react-flow__controls'])}
            position='bottom-left'
            data-testid="rf__controls"
        >
            <Controls showZoom={false} showFitView={false} showInteractive={false}>
                <ActionIcon onClick={onZoomInHandler} variant="outline" size={32} sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    <IconZoomIn />
                </ActionIcon >
                <ActionIcon onClick={onZoomOutHandler} variant="outline" size={32} radius={0}>
                    <IconZoomOut />
                </ActionIcon>
                <ActionIcon onClick={onFitViewHandler} variant="outline" size={32} radius={0}>
                    <IconAspectRatio />
                </ActionIcon>
                <ActionIcon onClick={onToggleAddMenu} ref={ref} variant="outline" size={32} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <IconVariablePlus />
                </ActionIcon>
            </Controls>
        </Panel>
    );
});

GraphEditorControls.displayName = 'Controls';

export default memo(GraphEditorControls);