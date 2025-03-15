import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3バケットの作成（ルームデータの保存用）
    const roomDataBucket = new s3.Bucket(this, 'RoomDataBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用の設定（本番環境ではRETAINを検討）
      autoDeleteObjects: true, // 開発環境用の設定
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    // WebSocket API用のLambda関数
    const webSocketConnectHandler = new lambda.Function(this, 'WebSocketConnectHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset('dist/websocket'),
      handler: 'connect.handler',
      environment: {
        ROOM_DATA_BUCKET: roomDataBucket.bucketName,
      },
    });

    const webSocketDisconnectHandler = new lambda.Function(this, 'WebSocketDisconnectHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset('dist/websocket'),
      handler: 'disconnect.handler',
      environment: {
        ROOM_DATA_BUCKET: roomDataBucket.bucketName,
      },
    });

    const webSocketDefaultHandler = new lambda.Function(this, 'WebSocketDefaultHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset('dist/websocket'),
      handler: 'default.handler',
      environment: {
        ROOM_DATA_BUCKET: roomDataBucket.bucketName,
      },
    });

    // S3バケットへのアクセス権限をLambda関数に付与
    roomDataBucket.grantReadWrite(webSocketConnectHandler);
    roomDataBucket.grantReadWrite(webSocketDisconnectHandler);
    roomDataBucket.grantReadWrite(webSocketDefaultHandler);

    // WebSocket API Gatewayの作成
    const webSocketApi = new apigateway.WebSocketApi(this, 'PlanningPokerWebSocketApi', {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('ConnectIntegration', webSocketConnectHandler),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'DisconnectIntegration',
          webSocketDisconnectHandler,
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration('DefaultIntegration', webSocketDefaultHandler),
      },
    });

    const webSocketStage = new apigateway.WebSocketStage(this, 'PlanningPokerWebSocketStage', {
      webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    // WebSocket APIのURLをエクスポート
    new cdk.CfnOutput(this, 'WebSocketApiUrl', {
      value: webSocketStage.url,
      description: 'WebSocket API URL',
    });

    // TODO: REST API、CloudFront、その他のリソースを追加
  }
}
