import { APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
// import { S3 } from 'aws-sdk'; // S3を使用していないためコメントアウト

const logger = new Logger();

/**
 * WebSocket切断時のハンドラー
 * 保存されていた接続情報を削除する
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('WebSocket disconnect event received', { event });
  const connectionId = event.requestContext.connectionId; // ログ出力のために必要なら取得

  try {
    // const connectionId = event.requestContext.connectionId;
    // const s3 = new S3();

    // connectionIdに紐づくルーム情報を取得し、接続情報を削除する
    // TODO: 接続情報の削除処理
    logger.info('Disconnection processed successfully', { connectionId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '切断成功' }),
    };
  } catch (error) {
    logger.error('Error processing disconnect event', {
      errorDetails: error as Error,
      connectionId,
      eventReceived: event,
    });
    // console.error('切断処理中にエラーが発生しました:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
};
