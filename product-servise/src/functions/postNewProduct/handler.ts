import 'source-map-support/register';
import { dbOptions, Client } from '@libs/connect';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import schemas from './schemas';

export const postNewProduct: ValidatedEventAPIGatewayProxyEvent<typeof schemas> = async (event) => {
	const client = new Client(dbOptions);
	await client.connect();
	console.log('Body', event.body.product);
	
	try {
		// @ts-ignore: Unreachable code error
		const {count, price, title, description}  = event.body.product;

		await client.query('BEGIN')

		const resFromProductDB = await client.query(`insert into products (title, description, price) values ('${title}', '${description}', ${price}) returning id`)
		
		const primaryKeyID = resFromProductDB.rows[0].id;
    const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
    await client.query(addReqToStockDB);

		const result = await client.query(`select id, count, price, title, description from products p left join stocks s on p.id = s.product_id where id in ('${primaryKeyID}')`);

		await client.query('COMMIT');

		return formatJSONResponse({newProduct: result.rows[0]}, 201);
	} catch(err) {
		await client.query('ROLLBACK')
		if (err.name === 'SyntaxError' || err.code === '42703') {
			return formatJSONResponse({ message: "Parameters set incorrectly"}, 400);
		} else {
			return formatJSONResponse({ message: "Error"}, 500);
		}
	} finally {
		await client.end()
	}
}

export const main = middyfy(postNewProduct);
