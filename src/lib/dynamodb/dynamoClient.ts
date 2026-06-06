import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = process.env.INVESTMENT_TABLE_NAME || 'investment';

// Initialize DynamoDB client outside handler for connection reuse
const dynamoClient = new DynamoDBClient({
  region: (process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-northeast-1') as string,
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {}),
});

export const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const tableName: string = TABLE_NAME;
