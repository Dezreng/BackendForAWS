import 'source-map-support/register';
import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const BUCKET = 'arn:aws:s3:::task-5-egor'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	const s3 = new AWS.S3({region: "eu-west-1"});
	const { name } = event.queryStringParameters;

	const catalogPath = `uploaded/${name}`;

	const params ={
		Bucket: BUCKET,
		Key: catalogPath,
		Expires: 60,
		ContentType: 'text/csv'
	}

	try {
		const singURL = await s3.getSignedUrlPromise('putObject', params);

		if (!singURL) {
			return formatJSONResponse({ message: `Error` }, 400);
		}

		return formatJSONResponse( singURL, 200);

	} catch(err) {
		return formatJSONResponse({ message: err }, 500);
	}
}

export const main = middyfy(importProductsFile);
