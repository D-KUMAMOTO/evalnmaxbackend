import { FeedbackResult } from '../types/FeedbackResult';
import { ValidationError } from '../libs/error';

export const validateFeedbackResult = (data: any): FeedbackResult => {
  if (!data.receiver_employee_id) {
    throw new ValidationError('Missing required field: receiver_employee_id');
  }
  if (!data.evaluation_item_id) {
    throw new ValidationError('Missing required field: evaluation_item_id');
  }
  if (!data.feedback_score) {
    throw new ValidationError('Missing required field: feedback_score');
  }
  if (!data.feedback_comments) {
    throw new ValidationError('Missing required field: feedback_comments');
  }
  if (!data.feedback_date) {
    throw new ValidationError('Missing required field: feedback_date');
  }
  if (!data.feedback_provider) {
    throw new ValidationError('Missing required field: feedback_provider');
  }
  if (typeof data.feedback_score !== 'number' || data.feedback_score < 1 || data.feedback_score > 5) {
    throw new ValidationError('Invalid feedback_score: must be a number between 1 and 5');
  }

  return {
    receiver_employee_id: data.receiver_employee_id,
    evaluation_item_id: data.evaluation_item_id,
    feedback_score: data.feedback_score,
    feedback_comments: data.feedback_comments,
    feedback_date: data.feedback_date,
    feedback_provider: data.feedback_provider,
    department_id: data.department_id,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
