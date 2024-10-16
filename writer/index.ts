/*
AUTHOR: Ethan Schoonbee
EMAIL: schoonbeeethan@gmail.com
DATE CREATED: 15/10/2024
LAST MODIFIED: 16/10/2024
DESCRIPTION:
    This AWS Lambda function writes a log entry to a DynamoDB table named 'log-events'.
    It expects a JSON body containing a 'severity' and 'message' field, validates the input using Zod schema,
    and then saves the log entry with a generated unique ID and timestamp. The function returns a success
    response containing the log entry details upon successful insertion, or an error response if the operation fails.
*/


import * as AWS from 'aws-sdk';
import * as z from 'zod';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {APIGatewayProxyStructuredResultV2} from "aws-lambda/trigger/api-gateway-proxy";
import { v4 } from 'uuid';

// Enum to define the severity levels for log entries
enum LogSeverity {
    Info = "info",
    Warning = "warning",
    Error = "error"
}

// Zod schema to validate the structure of a log entry
const LogEntrySchema = z.object({
    severity: z.nativeEnum(LogSeverity), // Ensure severity value is defined in the enum
    message: z.string() // ensure message is string
});

// Type definition inferred from the Zod schema
type LogEntry = z.infer<typeof LogEntrySchema>;

// Create a new instance of DynamoDB DocumentClient to interact with DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

/**
 * Lambda function handler to write a new log entry to the DynamoDB table.
 * Validates the incoming request body and stores the log with a unique ID and timestamp.
 *
 * @param {APIGatewayProxyEventV2} event - The API Gateway event containing request details, including the log entry data.
 * @returns {Promise<APIGatewayProxyStructuredResultV2>} - A promise that resolves to the API Gateway response, indicating success or failure of the log write operation.
 */
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        // Validate HTTP method to only allow POST requests
        if (event.requestContext.http.method !== 'POST') {
            return {
                statusCode: 405, // Method not allowed
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Method Not Allowed. Please use POST.' })
            };
        }

        // Check event body exists
        if(!event.body) {
            throw new Error('Log entry missing from request body');
        }

        // Parse JSON string to JS object
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (error) {
            throw new Error('Invalid JSON in request body');
        }

        console.log('Incoming request body:', body);

        // Use zod schema to validate request body
        const validatedBody = LogEntrySchema.parse(body);

        // Generate timestamp and unique ID for log entry
        const dateTime = Date.now();
        const id = v4();

        // Extract severity and message from validated request body
        const { severity, message } = validatedBody;

        // Builds object to store in DynamoDB
        const params = {
            TableName: 'log-events', // Table for storing log events
            Item: {
                Id: id, // Log UUID
                Severity: severity, // Log severity
                Message: message, // Log message
                DateTime: dateTime // Log timestamp
            }
        };

        try {
            // Put object in DynamoDB using a 'promise' to ensure an asynchronous call
            await dynamoDB.put(params).promise();
        } catch (error) {
            // Throw error if insertion to DynamoDb fails
            throw new Error('Failed to insert log entry');
        }

        // Build response body to return log entry details
        const response = {
            id, // Log UUID
            severity, // Log severity
            message, // Log message
            dateTime // Log timestamp
        }

        // Send success response to client
        return {
            statusCode: 200, // Successful response
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
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
            body: JSON.stringify({ message: 'An unexpected error occurred while writing log entry' })
        };
    }
};
//____________________....oooOO0_END_OF_FILE_0OOooo....___________________