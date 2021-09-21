import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
		region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
		iamRoleStatements: [
  		{
    		Effect: 'Allow',
    		Action: ['s3:ListBucket'],
    		Resource: {
      		"Ref": "arn:aws:s3:::task-5-egor",
    		},
  		},
			{
    		Effect: 'Allow',
    		Action: ['s3:'],
    		Resource: {
      		"Ref": "arn:aws:s3:::task-5-egor/",
    		},
  		}
]
  },
  // import the function via paths
  functions: { importProductsFile },
};

module.exports = serverlessConfiguration;
