import { ThankYouMessage } from '../types/ThankYouMessage';
import { ValidationError } from '../libs/error';

export const validateThankYouMessage = (data: any): ThankYouMessage => {
  if (!data.sender_employee_id) {
    throw new ValidationError('Missing required field: sender_employee_id');
  }
  if (!data.message_id && !data.message_content) {
    throw new ValidationError('Missing required field: either message_id or message_content must be provided');
  }
  if (!data.receiver_employee_id) {
    throw new ValidationError('Missing required field: receiver_employee_id');
  }
  if (!data.message_content) {
    throw new ValidationError('Missing required field: message_content');
  }

  const is_public = typeof data.is_public === 'boolean' ? data.is_public : true;

  return {
    sender_employee_id: data.sender_employee_id,
    message_id: data.message_id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    receiver_employee_id: data.receiver_employee_id,
    message_content: data.message_content,
    category: data.category,
    is_public: is_public,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
