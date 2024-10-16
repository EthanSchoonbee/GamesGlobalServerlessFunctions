import * as AWS from 'aws-sdk';
import * as z from 'zod';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {APIGatewayProxyStructuredResultV2} from "aws-lambda/trigger/api-gateway-proxy";
import { v4 } from 'uuid';

enum LogSeverity {
    Info = "info",
    Warning = "warning",
    Error = "error"
}

const LogEntrySchema = z.object({
    severity: z.nativeEnum(LogSeverity),
    message: z.string()
});

type LogEntry = z.infer<typeof LogEntrySchema>;

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    try {
        // Check event body exists
        if(!event.body) {
            throw new Error('Log entry missing from request body');
        }

        // Parse JSON string to JS object
        const body = JSON.parse(event.body);

        // Use zod schema to validate request body
        const validatedBody = LogEntrySchema.parse(body);

        // Generate timestamp and unique ID
        const dateTime = Date.now();
        const id = v4();

        const { severity, message } = validatedBody;

        // Builds object to store in DynamoDB
        const params = {
            TableName: 'log-events',
            Item: {
                Id: id,
                Severity: severity,
                Message: message,
                DateTime: dateTime
            }
        };

        try {
            // Put object in DynamoDB
            await dynamoDB.put(params).promise();
        } catch (error) {
            throw new Error('Faield to insert log entry')
        }

        // Build response body
        const response = {
            id,
            dateTime,
            severity,
            message
        }

        // Send success response to client
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
        };
    } catch (error) {

        console.log(error);
        // Send error response to client
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        };
    }
};