import { Evaluation, EvaluationItemResult } from '../types/Evaluation';
import { ValidationError } from '../libs/error';

export const validateEvaluation = (data: any): Evaluation => {
  if (!data.employee_id) {
    throw new ValidationError('Missing required field: employee_id');
  }
  if (!data.evaluation_date) {
    throw new ValidationError('Missing required field: evaluation_date');
  }
  if (!data.evaluator_id) {
    throw new ValidationError('Missing required field: evaluator_id');
  }
  if (!Array.isArray(data.evaluation_items) || data.evaluation_items.length === 0) {
    throw new ValidationError('evaluation_items must be a non-empty array');
  }

  data.evaluation_items.forEach((item: any, index: number) => {
    if (!item.evaluation_item_id) {
      throw new ValidationError(`Missing evaluation_item_id in evaluation_items[${index}]`);
    }
    if (typeof item.score !== 'number' || item.score < 1 || item.score > 5) {
      throw new ValidationError(`Invalid score in evaluation_items[${index}]: must be a number between 1 and 5`);
    }
  });

  const validStatuses = ['draft', 'completed', 'reviewed'];
  if (data.status && validStatuses.indexOf(data.status) === -1) {
    throw new ValidationError('Invalid status: must be one of draft, completed, reviewed');
  }

  return {
    employee_id: data.employee_id,
    evaluation_date: data.evaluation_date,
    evaluation_items: data.evaluation_items,
    evaluator_id: data.evaluator_id,
    comments: data.comments,
    status: data.status || 'draft',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};
