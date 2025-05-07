// src/handlers/evaluationItems/updateEvaluationItem.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const evaluation_item_id = event.pathParameters?.evaluation_item_id;
    if (!evaluation_item_id) {
      return failure(400, "Missing path parameter 'evaluation_item_id'");
    }
    if (!event.body) {
      return failure(400, 'Missing request body');
    }

    const data = JSON.parse(event.body);
    // 更新可能なフィールド
    const allowedFields = ['evaluation_name', 'evaluation_group'];
    const keysToUpdate = Object.keys(data).filter((k) => allowedFields.includes(k));
    if (keysToUpdate.length === 0) {
      return failure(400, 'No updatable fields provided');
    }

    // 現在時刻
    const now = new Date().toISOString();
    const ExpressionAttributeNames: Record<string, string> = {};
    const ExpressionAttributeValues: Record<string, any> = {};
    const updateExpressions: string[] = [];

    keysToUpdate.forEach((field) => {
      ExpressionAttributeNames[`#${field}`] = field;
      ExpressionAttributeValues[`:${field}`] = data[field as keyof typeof data];
      updateExpressions.push(`#${field} = :${field}`);
    });
    // updated_at を追加
    ExpressionAttributeNames['#updated_at'] = 'updated_at';
    ExpressionAttributeValues[':updated_at'] = now;
    updateExpressions.push('#updated_at = :updated_at');

    const params = {
      TableName: process.env.EVAL_ITEMS_TABLE!,
      Key: { evaluation_item_id },
      UpdateExpression: 'SET ' + updateExpressions.join(', '),
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const,
      ConditionExpression: 'attribute_exists(evaluation_item_id)',
    };

    const result = await docClient.send(new UpdateCommand(params));
    return success(result.Attributes);
  } catch (err: any) {
    // レコードが存在しない場合
    if (err.name === 'ConditionalCheckFailedException') {
      return failure(404, `Evaluation item '${event.pathParameters?.evaluation_item_id}' not found`);
    }
    // 業務エラー
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    // その他のエラー
    return failure(500, err.message || 'Internal Server Error');
  }
};
