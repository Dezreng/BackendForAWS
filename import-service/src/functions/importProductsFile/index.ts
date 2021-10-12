import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
					parameters: {
          	querystrings: {
            	name: true,
            },
          },
				}
      },
			authorizer: {
      	name: 'basicAuthorizer',
        arn: `arn:aws:lambda:eu-west-1:980410514160:function:authorization-service-dev-basicAuthorizer`,
        resultTtlInSeconds: 0,
        identitySource: 'method.request.header.Authorization',
        type: 'token',
      },
    }
  ]
}
