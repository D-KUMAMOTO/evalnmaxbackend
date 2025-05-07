// src/libs/dynamoClient.ts
// DynamoDBクライアントの初期化
// AWS SDK v3 の DynamoDBDocumentClient をラップして全Lambdaで共通利用

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb";

// オプション: marshall/unmarshall の設定（undefined 値の除去など）
const translateConfig: TranslateConfig = {
  marshallOptions: {
    removeUndefinedValues: true,
  },
};

// 低レベルのDynamoDBClientを初期化
const ddbClient = new DynamoDBClient({});

// ドキュメントクライアントを作成
export const docClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);
