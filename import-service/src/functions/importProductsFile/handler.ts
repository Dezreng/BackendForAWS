import 'source-map-support/register';
import { S3 } from 'aws-sdk';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const BUCKET = 'task-egor-number-five'

const importProductsFile = async (event) => {
	try {
		const s3 = new S3({region: "eu-west-1"});
		const { name } = event.queryStringParameters;

		const params = {
			Bucket: BUCKET,
			Key: `uploaded/${name}`,
			Expires: 60,
			ContentType: 'text/csv'
		};

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
