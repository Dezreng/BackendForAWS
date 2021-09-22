// @ts-ignore: Unreachable code error
import AWSMock from 'aws-sdk-mock';
// @ts-ignore: Unreachable code error
import AWS from 'aws-sdk';

import { importProductsFile } from '../../functions/importProductsFile/handler'

describe('importProductsFile', () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };


  it('should return url with status 200', async () => {
    const name = 'test.csv';
    const expectedResult = {
      body: JSON.stringify(name),
      statusCode: 200,
      headers,
    } as any;

		AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (_action, _params, callback) => {
        callback(null, name);
        });

		const result = await importProductsFile({ queryStringParameters: { name } })

    expect(result).toEqual(expectedResult);

		AWSMock.restore();
  });

  it('should return error message with status 500', async () => {
    const name = 'test.csv';
    const expectedResult = {
      body: JSON.stringify({ message: 'Internal server error' }),
      statusCode: 500,
      headers,
    } as any;

    AWSMock.mock('S3', 'getSignedUrl', (_: any, __: any, callback: any) => callback('error'));

    expect(await importProductsFile({ queryStringParameters: { name } })).toEqual(expectedResult);
  });
});