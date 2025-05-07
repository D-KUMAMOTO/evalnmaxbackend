export interface FeedbackResult {
  receiver_employee_id: string;
  evaluation_item_id: string;
  feedback_score: number;
  feedback_comments: string;
  feedback_date: string;
  feedback_provider: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}
