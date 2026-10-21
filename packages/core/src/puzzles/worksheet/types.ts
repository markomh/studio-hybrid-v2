export type WorksheetTopic = 'addition' | 'subtraction' | 'multiplication' | 'pattern';

export type WorksheetGrade = 1 | 2 | 3 | 4 | 5 | 6;

export interface WorksheetOptions {
  topic: WorksheetTopic;
  grade: WorksheetGrade;
  problemCount: number;
  seed: number;
}

export interface WorksheetProblem {
  id: string;
  prompt: string;
  answer: string;
}

export interface WorksheetResult {
  problems: WorksheetProblem[];
}

export class WorksheetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorksheetValidationError';
  }
}
