import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerCallback, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Resource: resource,
                Effect: effect,
            }
        ]
    }
});


const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _context, callback: APIGatewayAuthorizerCallback) => {
	console.log("**********Get logs of event: ", event);

    if (event.type !== 'TOKEN') {
        callback('Unauthorized')
    };

    try {
        const encoded = event.authorizationToken.split(' ')[1];
        const buff = Buffer.from(encoded, 'base64');
        const [ username, password ] = buff.toString('utf-8').split(':');
        const storedPassword = process.env[username];

				if (!username || !password) callback('Unauthorized');

        const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        const policy = generatePolicy(encoded, event.methodArn, effect);
        callback(null, policy);
    } catch (e) {
        console.log(`*******CHECK ERROR ${e}`);
        callback(`Unauthorized: ${e.message}`);
    }
}

export const main = middyfy(basicAuthorizer);
