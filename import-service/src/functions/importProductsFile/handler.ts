import 'source-map-support/register';
import { S3 } from 'aws-sdk';

import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

const BUCKET = 'task-egor-number-five'

const importProductsFile = async (event) => {
	try {
		const { name } = event.queryStringParameters;

		if (name && name.lenght !== 0) {
		const s3 = new S3({region: "eu-west-1"});

		const params = {
			Bucket: BUCKET,
			Key: `uploaded/${name}`,
			Expires: 60,
			ContentType: 'text/csv'
		};

		const singURL = await s3.getSignedUrlPromise('putObject', params);

		return formatJSONResponse( singURL, 200);
		} else {
			return formatJSONResponse( { message: "Bad request" }, 400);
		}
	} catch(err) {
		return formatJSONResponse({ message: "Internal server error" }, 500);
	}
}

export { importProductsFile }; 
export const main = middyfy(importProductsFile);
