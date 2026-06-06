import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.INVESTMENT_TABLE_NAME || 'investment';

const accessKeyId = process.env.DB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.DB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

const clientConfig: DynamoDBClientConfig = {
  region: (process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-northeast-1') as string,
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {}),
};

if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
  };
}

// Initialize DynamoDB client outside handler for connection reuse
const dynamoClient = new DynamoDBClient(clientConfig);

export const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const tableName: string = TABLE_NAME;
