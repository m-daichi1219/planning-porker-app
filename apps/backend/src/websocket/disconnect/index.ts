import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

/**
 * WebSocket切断時のハンドラー
 * 保存されていた接続情報を削除する
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('WebSocket切断イベント:', JSON.stringify(event));

  try {
    const connectionId = event.requestContext.connectionId;
    const s3 = new S3();

    // connectionIdに紐づくルーム情報を取得し、接続情報を削除する
    // TODO: 接続情報の削除処理

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '切断成功' }),
    };
  } catch (error) {
    console.error('切断処理中にエラーが発生しました:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
};
