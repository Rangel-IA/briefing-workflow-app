export type QuestionType = 'single' | 'multiple' | 'composite';

export interface CompositeGroup {
  label: string;
  options: string[];
}

export interface Question {
  id: number;
  title: string;
  options?: string[];
  groups?: CompositeGroup[];
  rationale: string;
  type: QuestionType;
}
