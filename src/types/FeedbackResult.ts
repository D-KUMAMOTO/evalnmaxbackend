export interface FeedbackResult {
  receiver_employee_id: string;
  feedback_date: string;
  sender_employee_id: string;
  feedback_content: string;
  rating: number;
  category?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}
