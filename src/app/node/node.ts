export interface Node {
    weight: number;
    parent: undefined | Node;
    neighbours?: Array<{ node: Node, relativeDistance: number }>;
    pathDistance: number;
    heuristicDistance: number;
    isVisited: boolean;
    isBlocked: boolean;
    isProspected: boolean;
    xPosition: number;
    yPosition: number;
}