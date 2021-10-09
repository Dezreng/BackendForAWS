import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import postNewProduct from '@functions/postNewProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-servise',
  frameworkVersion: '2',
	useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
			SNS_ARN: {
				Ref: "SNSTopic"
			},
    },
    lambdaHashingVersion: '20201221',
			iamRoleStatements: [
			{
    		Effect: 'Allow',
    		Action: ['sqs:*'],
    		Resource: "${cf:import-service-dev.SQSQueueArn}",
  		},
			{
    		Effect: 'Allow',
    		Action: ['sns:*'],
    		Resource: {
					Ref: "SNSTopic"
				},
  		}
		]
  },
  // import the function via paths
  functions: { getProductsList, getProductById, postNewProduct, catalogBatchProcess },
	resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
					TopicName: "createProductTopic"
        },
      },
			SNSSubscription: {
				Type: "AWS::SNS::Subscription",
				Properties: {
					Endpoint: "egor.layk@gmail.com",
					Protocol: "email",
					TopicArn: {
						Ref: "SNSTopic"
					},
					FilterPolicy: {
						price: [{numeric: ['<', 1000]}]
					}
				}
			},
			SNSSubscription2: {
				Type: "AWS::SNS::Subscription",
				Properties:{
					Endpoint: "egor.dezreng@gmail.com",
					Protocol: "email",
					TopicArn: {
						Ref: "SNSTopic"
					},
					FilterPolicy: {
						 price: [{numeric: ['>=', 1000]}]
					}
				}
			}
    }
  },
};

module.exports = serverlessConfiguration;
