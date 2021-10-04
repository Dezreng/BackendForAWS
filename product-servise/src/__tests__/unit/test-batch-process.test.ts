import { APIGatewayProxyEvent } from "aws-lambda";
// @ts-ignore: Unreachable code error
import AWSMock from 'aws-sdk-mock';
// @ts-ignore: Unreachable code error
import AWS from 'aws-sdk';
import { main as catalogBatchProcess } from '../../functions/catalogBatchProcess/handler';

const setMockEvent = data => ({
    Records: [
        {
            body: JSON.stringify(data),
        },
    ]
    });

jest.mock('pg', () => {
    const Client = {
        connect: jest.fn(),
        query: jest.fn(() => ({
            rows: [{   
                price: 100,
                title: 'Test SNS',
                description: 'Test SNS',
                count: 5 
            }],
        })),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => Client) };
});

describe('Unit test for app batch process', function () {
    it('to be return the "succsess" if all OK', async () => {
        const event: APIGatewayProxyEvent = {
					price: 100,
          title: 'Test SNS',
          description: 'Test SNS',
          count: 5
				} as any

				AWSMock.setSDKInstance(AWS);
				AWSMock.mock('SNS', 'publish', (_params, callback) => {
            callback(undefined, 'Data sent successfully'); // Mocked response returns ‘success’ always
            });

				// @ts-ignore: Unreachable code error
        const result = await catalogBatchProcess(setMockEvent(event));

				// @ts-ignore: Unreachable code error
				const { newProduct } = JSON.parse(result.body);

				expect(newProduct).toBe('Data sent successfully');

				AWSMock.restore();
    });

		it('to be return the "status code 400" and message "Product data is invalid" if data is not valid', async () => {
        const event: APIGatewayProxyEvent = {
					price: 'fgfd',
          title: 'Test SNS',
          description: 'Test SNS',
          count: '12' 
				} as any

				// @ts-ignore: Unreachable code error
				const result = await catalogBatchProcess(setMockEvent(event));

				// @ts-ignore: Unreachable code error
        const { message } = JSON.parse(result.body);

				// @ts-ignore: Unreachable code error
        expect(result.statusCode).toBe(400);
        expect(message).toBe('Error');
				
        AWSMock.restore();
    });
});