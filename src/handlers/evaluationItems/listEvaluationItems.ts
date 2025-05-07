// src/handlers/evaluationItems/listEvaluationItems.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const tableName = process.env.EVAL_ITEMS_TABLE!;
    const indexName = process.env.EVAL_ITEMS_GSI_NAME || 'GSI1';
    const group = event.queryStringParameters?.evaluation_group;
    let items;

    if (group) {
      // GSI を使ってグループ単位で query
      const result = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: indexName,
          KeyConditionExpression: '#group = :group',
          ExpressionAttributeNames: { '#group': 'evaluation_group' },
          ExpressionAttributeValues: { ':group': group },
        })
      );
      items = result.Items;
    } else {
      // 全件取得
      const result = await docClient.send(
        new ScanCommand({ TableName: tableName })
      );
      items = result.Items;
    }

    return success(items);
  } catch (err: any) {
    return failure(err.statusCode || 500, err.message || 'Internal Server Error');
  }
};
