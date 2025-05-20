import { APIGatewayProxyHandler } from 'aws-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

/**
 * WebSocketメッセージ受信時のデフォルトハンドラー
 * メッセージを処理し、必要に応じて返信する
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('WebSocket message event received', { event });

  try {
    const connectionId = event.requestContext.connectionId;
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;

    // メッセージの内容を解析
    const body = JSON.parse(event.body || '{}');
    const { action, data } = body;

    // APIゲートウェイの管理APIを初期化
    const apigwManagementApi = new ApiGatewayManagementApi({
      endpoint: `${domain}/${stage}`,
    });

    // アクションに応じた処理を実行
    switch (action) {
      case 'vote':
        // 投票処理
        if (connectionId) {
          await handleVote(connectionId, data, apigwManagementApi, logger);
        } else {
          logger.warn('ConnectionID is missing for vote action', {
            requestContext: event.requestContext,
          });
          return { statusCode: 400, body: 'ConnectionID is missing' };
        }
        break;

      case 'reveal_votes':
        // 投票結果の公開処理
        if (connectionId) {
          await handleRevealVotes(connectionId, data, apigwManagementApi, logger);
        } else {
          logger.warn('ConnectionID is missing for reveal_votes action', {
            requestContext: event.requestContext,
          });
          return { statusCode: 400, body: 'ConnectionID is missing' };
        }
        break;

      case 'reset_votes':
        // 投票のリセット処理
        if (connectionId) {
          await handleResetVotes(connectionId, data, apigwManagementApi, logger);
        } else {
          logger.warn('ConnectionID is missing for reset_votes action', {
            requestContext: event.requestContext,
          });
          return { statusCode: 400, body: 'ConnectionID is missing' };
        }
        break;

      default:
        // 不明なアクション
        if (connectionId) {
          await sendToClient(apigwManagementApi, connectionId, {
            type: 'error',
            message: '不明なアクションです',
          });
          logger.info('Sent error for unknown action to client', { connectionId, action });
        } else {
          logger.warn('ConnectionID is missing for unknown action', {
            requestContext: event.requestContext,
            action,
          });
          return { statusCode: 400, body: 'ConnectionID is missing' };
        }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'メッセージ処理成功' }),
    };
  } catch (error) {
    logger.error('Error processing message in default handler', {
      errorDetails: error as Error,
      eventReceived: event,
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'サーバーエラーが発生しました' }),
    };
  }
};

// 投票データの型定義
interface VoteData {
  value: string;
  roomId: string;
  userId: string;
}

// 投票結果のペイロード型定義
interface VoteResultPayload {
  type: string;
  data: {
    votes: Array<{
      userId: string;
      value: string;
    }>;
  };
}

// メッセージペイロードの型定義
interface MessagePayload {
  type: string;
  message: string;
}

/**
 * 投票処理を行う
 */
async function handleVote(
  connectionId: string,
  data: VoteData,
  api: ApiGatewayManagementApi,
  loggerInstance: Logger, // loggerインスタンスを受け取る
): Promise<void> {
  // 投票データをS3に保存し、他の接続者に通知する
  // 実装予定
  loggerInstance.info('Processing vote', { connectionId, data });

  // クライアントに確認メッセージを送信
  await sendToClient(api, connectionId, {
    type: 'vote_confirmation',
    message: '投票を受け付けました',
  });
}

/**
 * 投票結果の公開処理を行う
 */
async function handleRevealVotes(
  connectionId: string,
  data: { roomId: string },
  api: ApiGatewayManagementApi,
  loggerInstance: Logger, // loggerインスタンスを受け取る
): Promise<void> {
  // S3から投票データを取得し、すべての接続者に結果を送信する
  // 実装予定
  loggerInstance.info('Processing reveal votes', { connectionId, data });

  // テスト用のダミーデータ
  const dummyResults = {
    votes: [
      { userId: 'user1', value: '3' },
      { userId: 'user2', value: '5' },
      { userId: 'user3', value: '8' },
    ],
  };

  // クライアントに結果を送信
  await sendToClient(api, connectionId, {
    type: 'vote_results',
    data: dummyResults,
  });
}

/**
 * 投票のリセット処理を行う
 */
async function handleResetVotes(
  connectionId: string,
  data: { roomId: string },
  api: ApiGatewayManagementApi,
  loggerInstance: Logger, // loggerインスタンスを受け取る
): Promise<void> {
  // S3の投票データをリセットし、すべての接続者に通知する
  // 実装予定
  loggerInstance.info('Processing reset votes', { connectionId, data });

  // クライアントにリセット通知を送信
  await sendToClient(api, connectionId, {
    type: 'votes_reset',
    message: '投票がリセットされました',
  });
}

/**
 * WebSocketクライアントにメッセージを送信する
 */
async function sendToClient(
  api: ApiGatewayManagementApi,
  connectionId: string,
  payload: MessagePayload | VoteResultPayload,
): Promise<void> {
  try {
    await api
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
    logger.debug('Message sent to client', { connectionId, payloadType: payload.type });
  } catch (error) {
    logger.error('Failed to send message to client', {
      errorDetails: error as Error,
      connectionIdContext: connectionId,
    });
    // 必要に応じてエラーを再スローするか、ハンドリングする
    // throw error; // 例えば、呼び出し元でこのエラーを処理したい場合
  }
}
