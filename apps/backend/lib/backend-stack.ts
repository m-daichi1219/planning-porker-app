import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as fs from 'fs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

/**
 * Planning Pokerアプリケーションのバックエンドスタック
 * WebSocket APIとS3バケットをセットアップする
 */
export class BackendStack extends cdk.Stack {
  public readonly webSocketApi: apigatewayv2.WebSocketApi;
  public readonly roomDataBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3バケットの作成（ルームデータの保存用）
    this.roomDataBucket = new s3.Bucket(this, 'RoomDataBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用の設定（本番環境ではRETAINを検討）
      autoDeleteObjects: true, // 開発環境用の設定
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30), // 30日後に削除
          id: 'DeleteAfter30Days',
        },
      ],
    });

    // WebSocket API用のLambda関数
    const connectHandler = this.createLambdaFunction('ConnectHandler', 'websocket/connect');
    const disconnectHandler = this.createLambdaFunction(
      'DisconnectHandler',
      'websocket/disconnect',
    );
    const defaultHandler = this.createLambdaFunction('DefaultHandler', 'websocket/default');

    // S3バケットへのアクセス権限をLambda関数に付与
    this.roomDataBucket.grantReadWrite(connectHandler);
    this.roomDataBucket.grantReadWrite(disconnectHandler);
    this.roomDataBucket.grantReadWrite(defaultHandler);

    // WebSocket APIの作成
    this.webSocketApi = new apigatewayv2.WebSocketApi(this, 'PlanningPokerWebSocketApi', {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('ConnectIntegration', connectHandler),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration('DisconnectIntegration', disconnectHandler),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration('DefaultIntegration', defaultHandler),
      },
    });

    // WebSocket APIのステージをデプロイ
    new apigatewayv2.WebSocketStage(this, 'PlanningPokerWebSocketStage', {
      webSocketApi: this.webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    // WebSocket APIのURLをスタック出力として設定
    new cdk.CfnOutput(this, 'WebSocketApiUrl', {
      value: this.webSocketApi.apiEndpoint,
      description: 'WebSocket API URL',
    });

    // メッセージングのドキュメントを出力（開発者向け）
    new cdk.CfnOutput(this, 'WebSocketDocumentation', {
      value:
        'WebSocketのメッセージは以下の形式で送信してください: { "action": "actionName", "data": {} }',
      description: 'WebSocket API使用方法',
    });

    // APIコールバック用のポリシーを設定
    const apiCallbackPolicy = new iam.PolicyStatement({
      actions: ['execute-api:ManageConnections'],
      resources: ['*'], // デプロイ後にARNが確定したら制限する
    });

    // Lambda関数に権限を付与
    connectHandler.addToRolePolicy(apiCallbackPolicy);
    disconnectHandler.addToRolePolicy(apiCallbackPolicy);
    defaultHandler.addToRolePolicy(apiCallbackPolicy);
  }

  /**
   * Lambda関数を作成するヘルパーメソッド
   */
  private createLambdaFunction(id: string, handlerPath: string): lambda.Function {
    // 開発環境かテスト環境かを判定（テスト環境ではdistフォルダが存在しない場合がある）
    const distPath = path.join(__dirname, '..', 'dist', handlerPath);
    const isTest = process.env.NODE_ENV === 'test' || !fs.existsSync(distPath);

    if (isTest) {
      // テスト環境では警告を出すだけ（fromAssetはモックされるため実際のパスは重要ではない）
      console.log(`テスト環境のため、モックコードを使用します: ${handlerPath}`);
    }

    // fromAssetを使用（テスト中はモックされる）

    return new NodejsFunction(this, id, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(`dist/${handlerPath}`),
      environment: {
        ROOM_DATA_BUCKET: this.roomDataBucket.bucketName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });
  }
}
