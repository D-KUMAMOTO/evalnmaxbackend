import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';
import { validateFeedbackResult } from '../../schemas/feedbackResultSchema';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      throw new ValidationError('Missing request body');
    }
    const data = JSON.parse(event.body);
    
    const validatedData = validateFeedbackResult(data);
    
    await docClient.send(
      new PutCommand({
        TableName: process.env.FEEDBACK_RESULTS_TABLE!,
        Item: validatedData,
      })
    );
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    };
  } catch (err: any) {
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    return failure(500, err.message || 'Internal Server Error');
  }
};
