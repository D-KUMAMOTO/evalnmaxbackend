import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { NotFoundError } from '../../libs/error';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const employee_id = event.pathParameters?.employee_id;
    if (!employee_id) {
      return failure(400, "Missing path parameter 'employee_id'");
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.EMPLOYEES_TABLE!,
        Key: { employee_id },
      })
    );

    if (!result.Item) {
      throw new NotFoundError(`Employee '${employee_id}' not found`);
    }

    return success(result.Item);
  } catch (err: any) {
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    return failure(500, err.message || 'Internal Server Error');
  }
};
