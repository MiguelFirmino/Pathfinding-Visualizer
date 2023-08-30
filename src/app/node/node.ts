export interface Node {
    weight: number;
    parent: undefined | Node;
    neighbours?: Node[];
    distance: number;
    wasVisited: boolean;
    isBlocked: boolean;
    xPosition: number;
    yPosition: number;
}