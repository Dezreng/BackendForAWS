import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof Object> = async (_event) => {
	try {
		const mock = await require('../../libs/db/mock.json');
  	return formatJSONResponse(mock.body, 200);
	} catch(err) {
		return formatJSONResponse({ message: err }, 404);
	}
}

export const main = middyfy(getProductsList);
