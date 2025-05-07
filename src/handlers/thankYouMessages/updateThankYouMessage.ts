import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const message_id = event.pathParameters?.message_id;
    if (!message_id) {
      throw new ValidationError('Missing path parameter: message_id');
    }

    if (!event.body) {
      throw new ValidationError('Missing request body');
    }
    const data = JSON.parse(event.body);
    
    if (!data.sender_employee_id) {
      throw new ValidationError('Missing required field: sender_employee_id');
    }

    const now = new Date().toISOString();
    
    let updateExpression = 'SET updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': now
    };
    
    const updatableFields = [
      'receiver_employee_id',
      'message_content',
      'category',
      'is_public'
    ];
    
    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        updateExpression += `, ${field} = :${field}`;
        expressionAttributeValues[`:${field}`] = data[field];
      }
    });
    
    const result = await docClient.send(
      new UpdateCommand({
        TableName: process.env.THANK_YOU_MESSAGES_TABLE!,
        Key: {
          sender_employee_id: data.sender_employee_id,
          message_id: message_id
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
