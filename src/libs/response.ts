// src/libs/response.ts
// APIレスポンスの共通フォーマットを提供

export const success = (body: any) => ({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  export const failure = (statusCode: number, message: string) => ({
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: message }),
  });
  