FROM node:20-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=build /app/dist .
COPY --from=build /app/node_modules ./node_modules
CMD ["index.handler"]