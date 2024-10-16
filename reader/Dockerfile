#AUTHOR: Ethan Schoonbee
#EMAIL: schoonbeeethan@gmail.com
#DATE CREATED: 15/10/2024
#LAST MODIFIED: 15/10/2024


# Use the official Node.js 20 Alpine image as the base for the build stage
FROM node:20-alpine as build
# Set the working directory inside the container to /app
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./
# Install the npm dependencies specified in package.json
RUN npm install
# Copy the rest of the application files to the working directory
COPY . .
# Build the application using the npm build script
RUN npm run build

# Start a new stage from the AWS Lambda Node.js 20 image for deployment
FROM public.ecr.aws/lambda/nodejs:20
# Set the working directory inside the Lambda environment
WORKDIR ${LAMBDA_TASK_ROOT}
# Copy the built application files from the build stage to the Lambda working directory
COPY --from=build /app/dist .
# Copy the node_modules from the build stage to the Lambda environment
COPY --from=build /app/node_modules ./node_modules
# Specify the command to run when the Lambda function is invoked
CMD ["index.handler"]
#____________________....oooOO0_END_OF_FILE_0OOooo....____________________