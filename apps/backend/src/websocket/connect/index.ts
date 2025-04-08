import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

/**
 * WebSocket接続時のハンドラー
 * 接続情報を記録する
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('WebSocket接続イベント:', JSON.stringify(event));

  try {
    const connectionId = event.requestContext.connectionId;
    const s3 = new S3();

    // ルームIDをクエリパラメータから取得
    const roomId = event.queryStringParameters?.roomId;

    if (!roomId) {
      console.error('ルームIDが指定されていません');
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'ルームIDが必要です' }),
      };
    }

    // S3にconnection情報を保存する処理を実装する
    // TODO: 接続情報の保存処理

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '接続成功' }),
    };
  } catch (error) {
    console.error('接続処理中にエラーが発生しました:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
};
