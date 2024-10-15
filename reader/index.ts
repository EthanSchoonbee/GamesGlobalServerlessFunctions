import * as AWS from 'aws-sdk';
import * as z from 'zod';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {APIGatewayProxyStructuredResultV2} from "aws-lambda/trigger/api-gateway-proxy";

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        const queryParameters = {
            TableName: 'log-events'
        };

        // Fetch DynamoDB records
        const result = await dynamoDB.scan(queryParameters).promise();
        const logEventRecords = result.Items?? [];

        // Sort by DateTime
        const sortedLogEventRecords = logEventRecords.sort((a, b) => b.DateTime - a.DateTime);

        // Take top 100 records
        const top100LogEventRecords = sortedLogEventRecords.slice(0, 100);

        // Send success response to client
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(top100LogEventRecords),
        };
    } catch (error) {
        // Send error response to client
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        };
    }
};