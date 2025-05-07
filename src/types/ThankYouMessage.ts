export interface ThankYouMessage {
  sender_employee_id: string;
  message_id: string;
  receiver_employee_id: string;
  message_content: string;
  category?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
