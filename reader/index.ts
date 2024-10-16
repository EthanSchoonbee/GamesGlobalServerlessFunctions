/*
AUTHOR: Ethan Schoonbee
EMAIL: schoonbeeethan@gmail.com
DATE CREATED: 15/10/2024
LAST MODIFIED: 16/10/2024
DESCRIPTION:
    This AWS Lambda function retrieves the latest 100 log entries from a DynamoDB table named 'log-events'.
    It ensures that only GET requests are processed and sorts the logs in descending order based on the 'DateTime' field.
    The logs are fetched using the AWS SDK for DynamoDB, and the function returns the sorted records as a JSON response.
*/

import * as AWS from 'aws-sdk';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {APIGatewayProxyStructuredResultV2} from "aws-lambda/trigger/api-gateway-proxy";

// Create a new instance of DynamoDB DocumentClient to interact with DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

/**
 * Lambda function handler to fetch the top 100 log entries from DynamoDB.
 * Accepts only GET requests and retrieves logs in descending order of their DateTime attribute.
 *
 * @param {APIGatewayProxyEventV2} event - The API Gateway event containing request details.
 * @returns {Promise<APIGatewayProxyStructuredResultV2>} - A promise that resolves to the API Gateway response.
 */
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {

        console.log(event);

        // Validate HTTP method to only allow  GET requests
        if (event.requestContext.http.method !== 'GET') {
            return {
                statusCode: 405, // Method not allowed
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Method Not Allowed. Please use GET.' })
            };
        }

        // Define parameters for the DynamoDB scan operation
        const queryParameters = {
            TableName: 'log-events' // Table name to fetch log entries from
        };

        console.log(queryParameters);

        // Fetch All DynamoDB log records using a 'promise' to ensure an asynchronous call
        const result = await dynamoDB.scan(queryParameters).promise();

        console.log(result);

        // Fetch log records from the 'Items' property of the result
        // Fallback on an empty array if no items are retrieved
        const logEventRecords = result.Items?? [];

        // Sort log events by DateTime in descending order (most recent first)
        const sortedLogEventRecords = logEventRecords.sort((a, b) => b.DateTime - a.DateTime);

        // Take top 100 log records
        const top100LogEventRecords = sortedLogEventRecords.slice(0, 100);

        // Send success response to client with the sorted and filtered list in JSON format
        return {
            statusCode: 200, // Successful response
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(top100LogEventRecords), // Convert JS object to JSON
        };
    } catch (error) {
        // Narrowing the type of error to check if it's an instance of Error
        if (error instanceof Error) {
            console.log(error.message);
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: error.message })
            };
        }

        // Handle cases where the error is not an instance of Error
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'An unexpected error occurred while retrieving log entries' })
        };
    }
};
//____________________....oooOO0_END_OF_FILE_0OOooo....___________________