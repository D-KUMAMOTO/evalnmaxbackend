// src/handlers/evaluationItems/createEvaluationItem.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';
import { randomUUID } from 'crypto';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      throw new ValidationError('Missing request body');
    }
    const data = JSON.parse(event.body);
    const { evaluation_name } = data;

    // 必須フィールド検証
    if (!evaluation_name) {
      throw new ValidationError('Missing required field: evaluation_name');
    }

    // UUID とタイムスタンプ
    const evaluation_item_id = randomUUID();
    const now = new Date().toISOString();

    // アイテム構築（オプションデータも含む）
    const item = {
      evaluation_item_id,
      evaluation_name,
      ...data,             // evaluation_group 等のオプション属性
      created_at: now,
      updated_at: now,
    };

    // DynamoDB に登録
    await docClient.send(
      new PutCommand({
        TableName: process.env.EVAL_ITEMS_TABLE!,
        Item: item,
      })
    );

    // 201 Created レスポンス
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    };
  } catch (err: any) {
    if (err.statusCode) {
      return failure(err.statusCode, err.message);
    }
    return failure(500, err.message || 'Internal Server Error');
  }
};
