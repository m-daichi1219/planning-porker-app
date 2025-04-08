# AWS CDK ローカル環境構築手順

このドキュメントでは、ローカル環境からAWS CDKを使用してインフラをデプロイするための環境構築手順を説明します。

## 1. 前提条件

以下のツールが事前にインストールされていることを確認してください：

- **Node.js (LTS バージョン)**: AWS CDKはNode.js上で動作します
- **npm または yarn**: パッケージマネージャ
- **Git**: ソースコード管理
- **AWS CLI**: AWS認証情報の設定に使用

## 2. AWS アカウントの設定

### 2.1 AWS CLIのインストール

まだインストールしていない場合は、[AWS CLIの公式ドキュメント](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html)に従ってインストールしてください。

### 2.2 AWS認証情報の設定

IAMユーザーを作成し、アクセスキーとシークレットアクセスキーを取得してください。その後、以下のコマンドを実行して認証情報を設定します：

```bash
aws configure
```

プロンプトに従って情報を入力します：

```
AWS Access Key ID [None]: <あなたのアクセスキー>
AWS Secret Access Key [None]: <あなたのシークレットアクセスキー>
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

複数の環境（開発・ステージング・本番）を使い分ける場合は、AWS CLIのプロファイル機能を使用します：

```bash
aws configure --profile dev
aws configure --profile prod
```

### 2.3 IAM権限の設定

AWS CDKを使用するユーザーには、最低限以下の権限が必要です：

- CloudFormation関連の権限
- デプロイするリソースに対する権限（S3、Lambda、APIGateway等）
- IAMロールの作成権限（必要に応じて）

本番環境への権限は最小限に抑え、必要な権限のみを付与するようにしてください。

## 3. AWS CDKのインストールと設定

### 3.1 AWS CDKのグローバルインストール

以下のコマンドを実行して、AWS CDK CLIをグローバルにインストールします：

```bash
npm install -g aws-cdk
```

インストールを確認します：

```bash
cdk --version
```

### 3.2 プロジェクトのセットアップ

既存のAWS CDKプロジェクトをクローンする場合：

```bash
git clone <リポジトリURL>
cd <プロジェクトディレクトリ>
npm install
```

新しいAWS CDKプロジェクトを作成する場合：

```bash
mkdir my-cdk-project
cd my-cdk-project
cdk init app --language typescript
```

### 3.3 AWS CDK Bootstrapの実行

AWS CDKを初めて使用する場合、または新しいAWSアカウント/リージョンでデプロイする場合は、CDK Bootstrapを実行する必要があります：

```bash
# デフォルトプロファイルを使用
cdk bootstrap

# 特定のプロファイルを使用
cdk bootstrap --profile dev
```

これにより、CDKが必要とするリソース（S3バケットやIAMロールなど）が作成されます。

## 4. Planning Pokerアプリのデプロイ手順

### 4.1 プロジェクトのセットアップ

Planning Pokerアプリケーションのリポジトリをクローンし、依存関係をインストールします：

```bash
git clone <Planning-Pokerリポジトリ>
cd planning-porker-app
npm install
```

### 4.2 バックエンドのデプロイ

バックエンドディレクトリに移動し、必要なパッケージをインストールします：

```bash
cd apps/backend
npm install
```

AWS CDKを使ってCloudFormationテンプレートを生成し、内容を確認します：

```bash
npm run cdk:synth
```

AWS環境にデプロイします：

```bash
npm run cdk:deploy
```

または、特定の環境にデプロイする場合：

```bash
npm run cdk:deploy -- --profile dev
```

### 4.3 デプロイの確認

デプロイ完了後、以下の出力値をメモしておきます：

- WebSocket API URLエンドポイント

AWS Management Consoleにログインし、CloudFormationスタックが正常に作成されたことを確認します。

## 5. トラブルシューティング

### 5.1 一般的な問題と解決策

#### 認証エラー

```
Unable to locate credentials
```

解決策: AWS CLIの設定を確認し、`aws configure`または`~/.aws/credentials`ファイルを正しく設定してください。

#### 権限エラー

```
User is not authorized to perform: iam:CreateRole
```

解決策: IAMユーザーに必要な権限を追加するか、管理者に権限の追加を依頼してください。

#### Bootstrapエラー

```
CDK bootstrap stack version X required. Please run 'cdk bootstrap'
```

解決策: 指示に従って`cdk bootstrap`コマンドを実行してください。

### 5.2 ログの確認

デプロイに問題がある場合、以下のログを確認してください：

- CloudFormationのイベントログ（AWS Management Console）
- CDKのデプロイログ（ターミナル出力）

## 6. 開発のベストプラクティス

- **変更前のテスト**: `cdk diff`コマンドを使用して変更内容を事前に確認
- **スナップショットテスト**: プロジェクトのテストスイートを実行して、インフラの一貫性を検証
- **環境の分離**: 開発、ステージング、本番環境の設定を明確に分離
- **シークレット管理**: 機密情報はAWS Systems Managerパラメータストアなどのサービスを使用
- **バージョン管理**: CDKとその依存関係のバージョンを一貫して管理

## 7. 参考リソース

- [AWS CDK 公式ドキュメント](https://docs.aws.amazon.com/cdk/latest/guide/home.html)
- [AWS CDK TypeScriptリファレンス](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
- [AWS CDK Workshop](https://cdkworkshop.com/)
- [Planning Poker アプリのアーキテクチャ設計](../アーキテクチャ設計.md)
