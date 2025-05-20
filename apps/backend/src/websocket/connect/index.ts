import { APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
// import { S3 } from 'aws-sdk'; // S3を使用していないためコメントアウト

const logger = new Logger();

/**
 * WebSocket接続時のハンドラー
 * 接続情報を記録する
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('WebSocket connect event received', { event });

  try {
    const connectionId = event.requestContext.connectionId; // ログ出力のために必要なら残す

    // ルームIDをクエリパラメータから取得
    const roomId = event.queryStringParameters?.roomId;

    if (!roomId) {
      logger.warn('RoomID is missing in connect handler', {
        connectionId,
        queryStringParameters: event.queryStringParameters,
      });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'ルームIDが必要です' }),
      };
    }

    logger.info('Connection successful', { connectionId, roomId });
    // S3にconnection情報を保存する処理を実装する
    // TODO: 接続情報の保存処理

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '接続成功' }),
    };
  } catch (error) {
    logger.error('Error processing connect event', {
      errorDetails: error as Error,
      eventReceived: event,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
};
