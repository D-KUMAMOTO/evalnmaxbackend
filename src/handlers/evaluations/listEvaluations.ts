import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const employee_id = event.pathParameters?.employee_id;
    if (!employee_id) {
      throw new ValidationError('Missing path parameter: employee_id');
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: process.env.EVAL_HISTORY_TABLE!,
        KeyConditionExpression: 'employee_id = :employee_id',
        ExpressionAttributeValues: {
          ':employee_id': employee_id,
        },
        ScanIndexForward: false, // 降順（最新の評価が先頭）
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.Items || []),
    };
  } catch (err: any) {
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    return failure(500, err.message || 'Internal Server Error');
  }
};
