import { MazeCell, MazeConfig } from '../types';
export interface GeneratedMaze {
    cells: MazeCell[][];
    solutionPath: [number, number][];
    startCoord: [number, number];
    finishCoord: [number, number];
}
export declare function generateMaze(config: MazeConfig): GeneratedMaze;
