import { main as getProductById } from "../../functions/getProductById/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { main as getProducsList } from "../../functions/getProductsList/handler";

describe('Unit test for app handler', function () {
    it('verifies successful response', async () => {
        const event: APIGatewayProxyEvent = {} as any
				const dataBody = require('../../libs/db/mock.json');

				// @ts-ignore: Unreachable code error
        const result = await getProducsList(event);

				// @ts-ignore: Unreachable code error
        expect(result.statusCode).toBe(200);

				// @ts-ignore: Unreachable code error
        expect(result.body).toBe(JSON.stringify(dataBody.body));
    });

		it('ById', async () => {
        const event: APIGatewayProxyEvent = {
					pathParameters: {
						productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
					}
				} as any
				const dataBody = require('../../libs/db/mock.json');
				const product = await dataBody.body.filter(element => {
					if (element.id === event.pathParameters.productId){
					return element;
					}
				});

				// @ts-ignore: Unreachable code error
        const result = await getProductById(event);

				// @ts-ignore: Unreachable code error
        expect(result.statusCode).toBe(200);

				// @ts-ignore: Unreachable code error
        expect(result.body).toBe(JSON.stringify(product));
    });

		it('Not Found ProductById', async () => {
        const event: APIGatewayProxyEvent = {
					pathParameters: {
						productId: '1'
					}
				} as any

				// @ts-ignore: Unreachable code error
        const result = await getProductById(event);

				// @ts-ignore: Unreachable code error
        expect(result.statusCode).toBe(404);

				// @ts-ignore: Unreachable code error
        expect(result.body).toBe(JSON.stringify({ message: "Not Found Product" }));
    });
});