import { ThankYouMessage } from '../types/ThankYouMessage';
import { ValidationError } from '../libs/error';

export const validateThankYouMessage = (data: any): ThankYouMessage => {
  if (!data.sender_employee_id) {
    throw new ValidationError('Missing required field: sender_employee_id');
  }
  if (!data.receiver_employee_id) {
    throw new ValidationError('Missing required field: receiver_employee_id');
  }
  if (!data.message_content) {
    throw new ValidationError('Missing required field: message_content');
  }
  if (!data.message_date) {
    throw new ValidationError('Missing required field: message_date');
  }

  return {
    sender_employee_id: data.sender_employee_id,
    receiver_employee_id: data.receiver_employee_id,
    message_id: data.message_id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    message_content: data.message_content,
    message_date: data.message_date,
    status: data.status || 'sent',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
