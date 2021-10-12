import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"

export type ValidatedEventAPIGatewayProxyEvent = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}
