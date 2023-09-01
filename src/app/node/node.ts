export interface Node {
    weight: number;
    parent: undefined | Node;
    neighbours?: Array<{ node: Node, relativeDistance: number }>;
    distance: number;
    wasVisited: boolean;
    isPath?: boolean;
    isBlocked: boolean;
    xPosition: number;
    yPosition: number;
}