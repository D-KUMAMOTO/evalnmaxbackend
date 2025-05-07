export interface ThankYouMessage {
  sender_employee_id: string;
  receiver_employee_id: string;
  message_id: string;
  message_content: string;
  message_date: string;
  status?: string;
  created_at: string;
  updated_at: string;
}
