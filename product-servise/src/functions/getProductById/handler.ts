import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof Object> = async (event) => {
	try {
		const mock = require('../../libs/db/mock.json');
		const product = await mock.body.filter(element => {
			if (element.id === event.pathParameters.productId){
				return element;
			}
		});
		if (product.length < 1) {
			return formatJSONResponse({ message: "Not Found Product" }, 404);
		} else {
			return formatJSONResponse(product, 200);
		}
	} catch(err) {
		return formatJSONResponse({ messege: err }, 404);
	}
}

export const main = middyfy(getProductsById);
