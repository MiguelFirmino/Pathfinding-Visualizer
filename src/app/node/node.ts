export interface Node {
    weight: number;
    parent: undefined | Node;
    neighbours?: Node[];
    distance: number;
    wasVisited: boolean;
    isPath?: boolean;
    isBlocked: boolean;
    xPosition: number;
    yPosition: number;
}