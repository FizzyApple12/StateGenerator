import React, { FC } from "react";
import {
    ConnectionLineComponentProps,
    MarkerType,
    getBezierPath,
    Node
} from "reactflow";

import { flipPosition180, getEdgeParams } from "./NodeUtils";

export const FloatingConnectionLine: FC<ConnectionLineComponentProps> = ({
    fromNode,
    fromX,
    fromY,
    toX,
    toY,
    connectionLineStyle,
    fromPosition,
    toPosition,
}) => {
    if (!fromNode) {
        return null;
    }

    const fakeTargetNode: Node<any> = {
        id: "connection-target",
        width: 1,
        height: 1,
        data: {},
        position: { x: toX, y: toY },
        positionAbsolute: { x: toX, y: toY },
    };

    const { sx, sy, tx, ty, sourcePos } = getEdgeParams(fromNode, fakeTargetNode);

    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: flipPosition180(sourcePos),
        targetX: tx,
        targetY: ty,
    });

    return (
        <path
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={MarkerType.ArrowClosed}
            style={connectionLineStyle}
        />
    );
};
