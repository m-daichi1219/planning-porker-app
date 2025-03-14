# バックエンド実装のTODOリスト

## 1. プロジェクト構成

- [ ] `package.json` の設定（TypeScript, AWS SDK, WebSocket関連パッケージ）
- [ ] `tsconfig.json` の設定（フロントエンドと同様の厳格な型チェック）
- [ ] `.gitignore` の設定（node_modules, dist, .env等）
- [ ] ESLintとPrettierの設定（フロントエンドと統一）
- [ ] Turborepoの設定（フロントエンドと連携）

## 2. AWS CDKの設定

- [ ] `bin/app.ts` - CDKアプリケーションのエントリーポイント
- [ ] `lib/backend-stack.ts` - メインのCDKスタック定義
- [ ] `lib/constructs/api-gateway.ts` - WebSocket API Gateway構成
- [ ] `lib/constructs/lambda.ts` - Lambda関数の構成
- [ ] `lib/constructs/s3.ts` - S3バケット構成（データ保存用）
- [ ] `lib/constructs/cloudfront.ts` - CloudFront構成
- [ ] `lib/constructs/iam.ts` - IAMポリシー設定
- [ ] `test` - CDKスナップショットテスト

//\*_
todo: ファイル階層を修正する。技術的な要素で区切られているためドメイン知識毎に階層を作成する
_/

## 3. Lambda関数の実装

- [ ] `src/websocket/connect.ts` - WebSocket接続ハンドラー
- [ ] `src/websocket/disconnect.ts` - WebSocket切断ハンドラー
- [ ] `src/websocket/default.ts` - デフォルトハンドラー
- [ ] `src/room/create-room.ts` - ルーム作成ハンドラー
- [ ] `src/room/join-room.ts` - ルーム参加ハンドラー
- [ ] `src/vote/submit-vote.ts` - 投票処理ハンドラー
- [ ] `src/vote/reveal-votes.ts` - 投票結果公開ハンドラー
- [ ] `src/vote/reset-votes.ts` - 投票リセットハンドラー

## 4. ドメインロジックの実装

- [ ] `src/domain/models/room.ts` - ルームモデル
- [ ] `src/domain/models/vote.ts` - 投票モデル
- [ ] `src/domain/models/participant.ts` - 参加者モデル
- [ ] `src/domain/services/room-service.ts` - ルーム操作サービス
- [ ] `src/domain/services/vote-service.ts` - 投票操作サービス
- [ ] `src/domain/services/participant-service.ts` - 参加者管理サービス

## 5. インフラストラクチャレイヤーの実装

- [ ] `src/infrastructure/repositories/room-repository.ts` - S3を使ったルーム情報の保存・取得
- [ ] `src/infrastructure/repositories/connection-repository.ts` - 接続情報の管理
- [ ] `src/infrastructure/websocket/connection-manager.ts` - WebSocket接続管理
- [ ] `src/infrastructure/websocket/message-sender.ts` - WebSocketメッセージ送信

## 6. 共通ユーティリティの実装

- [ ] `src/utils/logger.ts` - ロギングユーティリティ
- [ ] `src/utils/error-handler.ts` - エラーハンドリング
- [ ] `src/utils/response.ts` - レスポンス形式の標準化
- [ ] `src/utils/uuid.ts` - UUID生成ユーティリティ
- [ ] `src/utils/json.ts` - JSON操作ユーティリティ

## 7. API定義とインターフェース

- [ ] `src/types/api.ts` - API入出力の型定義
- [ ] `src/types/websocket.ts` - WebSocketメッセージの型定義
- [ ] `src/types/events.ts` - イベント型定義
- [ ] `../shared` - フロントエンドとバックエンド間で共有する型定義

## 8. テスト実装（テスト方針設計に基づく）

### Small テスト（単体テスト）

- [ ] `tests/unit/domain` - ドメインロジックのユニットテスト
- [ ] `tests/unit/infrastructure` - インフラストラクチャのユニットテスト
- [ ] `tests/unit/handlers` - ハンドラーのユニットテスト

### Medium テスト（結合テスト）

- [ ] `tests/integration` - 複数モジュール間の結合テスト
- [ ] `tests/infra` - CDKスナップショットテスト

### Large テスト（E2Eテスト）

- [ ] `tests/e2e` - システム全体のE2Eテスト
- [ ] `tests/fixtures` - テスト用データ

## 9. CI/CD設定

- [ ] GitHub Actionsワークフローの設定（フロントエンドと統合）
- [ ] デプロイスクリプトの作成
- [ ] 環境変数の設定（開発/本番環境）
- [ ] CDKデプロイパイプラインの構築
- [ ] テスト自動化の設定

## 10. ドキュメント

- [ ] `README.md` - バックエンド実装の説明
- [ ] WebSocket API仕様書の作成
- [ ] デプロイ手順の文書化
- [ ] アーキテクチャ図の更新
- [ ] テスト実行方法の文書化

## 11. フロントエンドとの連携

- [ ] `../frontend/src/composables/room/useCreateRoom.ts` の実装を完成させる
- [ ] `../frontend/src/composables/websocket/useWebSocket.ts` の実装
- [ ] `../frontend/src/composables/room/useJoinRoom.ts` の実装
- [ ] `../frontend/src/composables/vote/useVote.ts` の実装

## 12. セキュリティ設定

- [ ] IAMポリシーの最小権限設定
- [ ] API Gatewayのアクセス制御設定
- [ ] S3バケットのアクセス制限設定
- [ ] WebSocketセキュリティの実装（UUIDによるルーム識別）
- [ ] HTTPS強制の設定
