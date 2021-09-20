import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { dbOptions, Client } from '@libs/connect';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof Object> = async (event) => {
	const client = new Client(dbOptions);
	await client.connect();
	console.log('Event', event);
	console.log('Argument Path Parameters', event.pathParameters );
	console.log('Body', event.body );
	
	try {
		const result = await client.query(`select id, count, price, title, description
      from products p left join stocks s on p.id = s.product_id`);
  	return formatJSONResponse(result.rows, 200);
	} catch(err) {
		return formatJSONResponse({ message: err }, 500);
	} finally {
		await client.end();
	}
}

export const main = middyfy(getProductsList);
