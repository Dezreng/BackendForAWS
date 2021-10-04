import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { Client, dbOptions } from '../../libs/connect';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof Object> = async (event) => {
	const client = new Client(dbOptions);
	await client.connect();
	console.log('Body', event);
	console.log('Argument Path Parameters', event.pathParameters );
	console.log('Body', event.body );
	
	try {
		const result = await client.query(`select id, count, price, title, description from products p left join stocks s on p.id = s.product_id where id in ('${event.pathParameters.productId}')`);
		return formatJSONResponse(result.rows[0], 200);
	} catch(err) {
		if ( err.name === "error" ){
			return formatJSONResponse({ messege: err }, 404);
		} else {
			return formatJSONResponse({ messege: "Error" }, 500);
		}
	} finally {
		await client.end();
	}
}

export const main = middyfy(getProductsById);
