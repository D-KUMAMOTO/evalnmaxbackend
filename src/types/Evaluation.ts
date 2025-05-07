export interface Evaluation {
  employee_id: string;
  evaluation_date: string;
  evaluation_items: EvaluationItemResult[];
  evaluator_id: string;
  comments?: string;
  status: 'draft' | 'completed' | 'reviewed';
  created_at: string;
  updated_at: string;
}

export interface EvaluationItemResult {
  evaluation_item_id: string;
  score: number;
  comments?: string;
}
