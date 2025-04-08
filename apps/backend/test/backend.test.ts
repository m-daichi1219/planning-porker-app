import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BackendStack } from '../lib/backend-stack';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Match } from 'aws-cdk-lib/assertions';

// Lambda Functionのコードアセットをモック
vi.mock('aws-cdk-lib/aws-lambda', async (importOriginal) => {
  // 型を指定してactualを取得
  const actual = (await importOriginal()) as typeof lambda;

  return {
    ...actual,
    Code: {
      ...actual.Code,
      fromAsset: vi.fn().mockImplementation(() => ({
        bind: () => ({
          s3Location: {
            bucketName: 'test-bucket',
            objectKey: 'test-key',
          },
        }),
        bindToResource: vi.fn(),
        isInline: false,
      })),
    },
  };
});

/**
 * CDKのスナップショットテスト
 * スタックのリソースが期待通りに生成されているか確認する
 */
describe('Backend Stack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const app = new cdk.App();
  const stack = new BackendStack(app, 'TestPlanningPokerBackendStack');
  const template = Template.fromStack(stack);

  describe('S3リソースの検証', () => {
    it('S3バケットがバージョニング有効で作成されている', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: {
          Status: 'Enabled',
        },
      });
    });

    it('S3バケットがパブリックアクセスをブロックする設定になっている', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    it('S3バケットに30日の有効期限ルールが設定されている', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([
            Match.objectLike({
              ExpirationInDays: 30,
              Id: 'DeleteAfter30Days',
            }),
          ]),
        },
      });
    });
  });

  describe('WebSocket APIの検証', () => {
    it('WebSocket APIがプロトコルタイプとルート選択式で正しく設定されている', () => {
      template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
        ProtocolType: 'WEBSOCKET',
        RouteSelectionExpression: '$request.body.action',
      });
    });

    it('WebSocket APIに$connectルートが定義されている', () => {
      template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
        RouteKey: '$connect',
      });
    });

    it('WebSocket APIに$disconnectルートが定義されている', () => {
      template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
        RouteKey: '$disconnect',
      });
    });

    it('WebSocket APIに$defaultルートが定義されている', () => {
      template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
        RouteKey: '$default',
      });
    });

    it('WebSocket APIにprodステージが自動デプロイ設定で作成されている', () => {
      template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
        StageName: 'prod',
        AutoDeploy: true,
      });
    });
  });

  describe('Lambda関数の検証', () => {
    it('Lambda関数がNode.js 22.xランタイムで作成されている', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.handler',
        Runtime: 'nodejs22.x',
      });
    });

    it('Lambda関数がS3バケット名を環境変数として持っている', () => {
      template.hasResourceProperties('AWS::Lambda::Function', {
        Environment: {
          Variables: {
            ROOM_DATA_BUCKET: {
              Ref: Match.stringLikeRegexp('RoomDataBucket'),
            },
          },
        },
      });
    });

    it('合計で5つのLambda関数が作成されている', () => {
      template.resourceCountIs('AWS::Lambda::Function', 5);
    });
  });

  describe('IAMポリシーの検証', () => {
    it('Lambda関数にWebSocket接続を管理する権限が付与されている', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: 'execute-api:ManageConnections',
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });

    it('Lambda関数にS3バケットの読み書き権限が付与されている', () => {
      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              Effect: 'Allow',
            }),
          ]),
        },
      });
    });
  });

  it('スタックの全体構造が前回のスナップショットと一致している', () => {
    // スナップショットを作成してスタックの全体構造を比較
    expect(template.toJSON()).toMatchSnapshot();
  });
});
