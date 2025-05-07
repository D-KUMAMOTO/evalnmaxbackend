import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const employee_id = event.pathParameters?.employee_id;
    if (!employee_id) {
      throw new ValidationError('Missing path parameter: employee_id');
    }

    if (!event.body) {
      throw new ValidationError('Missing request body');
    }
    const data = JSON.parse(event.body);
    
    if (!data.evaluation_item_id) {
      throw new ValidationError('Missing required field: evaluation_item_id');
    }

    const now = new Date().toISOString();
    
    let updateExpression = 'SET updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': now
    };
    
    const updatableFields = [
      'feedback_score',
      'feedback_comments',
      'feedback_date',
      'feedback_provider',
      'department_id'
    ];
    
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        updateExpression += `, ${field} = :${field}`;
        expressionAttributeValues[`:${field}`] = data[field];
      }
    });
    
    const result = await docClient.send(
      new UpdateCommand({
        TableName: process.env.FEEDBACK_RESULTS_TABLE!,
        Key: {
          receiver_employee_id: employee_id,
          evaluation_item_id: data.evaluation_item_id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })
    );
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (err: any) {
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    return failure(500, err.message || 'Internal Server Error');
  }
};
