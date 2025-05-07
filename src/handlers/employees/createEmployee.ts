// src/handlers/employees/createEmployee.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { docClient } from '../../libs/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { success, failure } from '../../libs/response';
import { ValidationError } from '../../libs/error';
import { v4 as uuidv4 } from 'uuid';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      throw new ValidationError('Missing request body');
    }
    const data = JSON.parse(event.body);
    const { employee_name, email, department_id, role, hire_date, status, retirement_date } = data;

    // 必須項目のバリデーション
    if (!employee_name || !email || !department_id || !role || !hire_date) {
      throw new ValidationError('Missing required fields: employee_name, email, department_id, role, hire_date');
    }

    // UUID とタイムスタンプ生成
    const employee_id = uuidv4();
    const now = new Date().toISOString();

    const item = {
      employee_id,
      employee_name,
      email,
      department_id,
      role,
      hire_date,
      status: status || 'active',
      retirement_date: retirement_date || null,
      created_at: now,
      updated_at: now,
    };

    // DynamoDB に登録
    await docClient.send(
      new PutCommand({
        TableName: process.env.EMPLOYEES_TABLE!,
        Item: item,
      })
    );

    // 201 Created を返却
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
