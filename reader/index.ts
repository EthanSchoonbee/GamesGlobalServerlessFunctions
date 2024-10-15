/*
AUTHOR: Ethan Schoonbee
EMAIL: schoonbeeethan@gmail.com
DATE CREATED: 15/10/2024
LAST MODIFIED: 15
 */

import * as AWS from 'aws-sdk';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {APIGatewayProxyStructuredResultV2} from "aws-lambda/trigger/api-gateway-proxy";

// Create a new instance of DynamoDB DocumentClient to interact with DynamoDB
// Specify the AWS region where  the DynamoDB table is located
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

// Lambda function handler for fetching TOP 100 logs in descending order of DateTime
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        // Validate HTTP method to only allow  GET requests
        if (event.requestContext.http.method !== 'GET') {
            return {
                statusCode: 405, // Method not allowed
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Method Not Allowed. Please use GET.' })
            };
        }

        // Define parameters for the DynamoDB scan operation
        // Specify the table name from which to fetch records
        const queryParameters = {
            TableName: 'log-events'
        };

        // Fetch All DynamoDB log records using 'promise' to ensure an asynchronous call
        const result = await dynamoDB.scan(queryParameters).promise();

        // Fetch log records from the 'Items' property of the result
        // Fallback on an empty array if no items are retrieved
        const logEventRecords = result.Items?? [];

        // Sort log events by DateTime in descending order (most recent first)
        const sortedLogEventRecords = logEventRecords.sort((a, b) => b.DateTime - a.DateTime);

        // Take top 100 log records
        const top100LogEventRecords = sortedLogEventRecords.slice(0, 100);

        // Send success response to client with the sorted and filtered list in JSON format
        return {
            statusCode: 200, // Success with response
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(top100LogEventRecords),
        };
    } catch (error) {
        // Handle errors during processing and send generic error response to client
        return {
            statusCode: 500, // Generic error response
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Failed to fetch log records. Please try again later.' })
        };
    }
};
//____________________....oooOO0_END_OF_FILE_0OOooo....____________________