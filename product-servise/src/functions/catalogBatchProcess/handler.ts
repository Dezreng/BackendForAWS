import 'source-map-support/register';
import { SNS } from 'aws-sdk';
import { dbOptions, Client } from '@libs/connect';
import { formatJSONResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

export const catalogBatchProcess = async (event) => {

	const client = new Client(dbOptions);
	await client.connect();
	console.log(`EVENT  ${JSON.stringify(event)}`);
	const items = await event.Records.map(({body}) => body );
	let result;
	
	try {

		for (let item of items) {
		const {count, price, title, description}  = JSON.parse(item);

		await client.query('BEGIN')

		const resFromProductDB = await client.query(`insert into products (title, description, price) values ('${title}', '${description}', ${price}) returning id`)
		
		const primaryKeyID = resFromProductDB.rows[0].id;
    const addReqToStockDB =  `insert into stocks (product_id, count ) values ('${primaryKeyID}', ${count})`;
    await client.query(addReqToStockDB);

		const res = await client.query(`select id, count, price, title, description from products p left join stocks s on p.id = s.product_id where id in ('${primaryKeyID}')`);

		await client.query('COMMIT');

		const sns = new SNS({region: 'eu-west-1'});

		const filteredPrice = (Number(price) > 999) ? 'moreThousand' : 'lessThousand';

		console.log(`RESULT ${filteredPrice}`);
		const params = {
                Subject: 'Products have been created in your DB',
                Message: `${JSON.stringify(item)}`,
                TopicArn: process.env.SNS_ARN,
                MessageAttributes: {
                    price: {
                        DataType: 'Number',
                        StringValue: `${res.rows[0].price}`,
                    }
                }
            };
		result = await sns.publish(params).promise();
		}

		return formatJSONResponse({newProduct: result}, 200);
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

export const main = middyfy(catalogBatchProcess);
