import { FeedbackResult } from '../types/FeedbackResult';
import { ValidationError } from '../libs/error';

export const validateFeedbackResult = (data: any): FeedbackResult => {
  if (!data.receiver_employee_id) {
    throw new ValidationError('Missing required field: receiver_employee_id');
  }
  if (!data.feedback_date) {
    throw new ValidationError('Missing required field: feedback_date');
  }
  if (!data.sender_employee_id) {
    throw new ValidationError('Missing required field: sender_employee_id');
  }
  if (!data.feedback_content) {
    throw new ValidationError('Missing required field: feedback_content');
  }
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    throw new ValidationError('Invalid rating: must be a number between 1 and 5');
  }

  const is_anonymous = typeof data.is_anonymous === 'boolean' ? data.is_anonymous : false;

  return {
    receiver_employee_id: data.receiver_employee_id,
    feedback_date: data.feedback_date,
    sender_employee_id: data.sender_employee_id,
    feedback_content: data.feedback_content,
    rating: data.rating,
    category: data.category,
    is_anonymous: is_anonymous,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
