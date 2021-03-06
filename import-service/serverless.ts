import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';


const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
	useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
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
			SQS_URL: {
				Ref: "SQSQueue"
			},
    },
    lambdaHashingVersion: '20201221',
		iamRoleStatements: [
  		{
    		Effect: 'Allow',
    		Action: ['s3:ListBucket'],
    		Resource: ["arn:aws:s3:::task-egor-number-five"],
  		},
			{
    		Effect: 'Allow',
    		Action: ['s3:*'],
    		Resource: ["arn:aws:s3:::task-egor-number-five/*"],
  		},
			{
    		Effect: 'Allow',
    		Action: ['sqs:*'],
    		Resource: {
					'Fn::GetAtt': ["SQSQueue", "Arn"]
				},
  		}
		]
  },
  functions: { importProductsFile, importFileParser },
	resources: {
    Resources: {
      ImportFileS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'task-egor-number-five',
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: true,
            RestrictPublicBuckets: true,
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT'],
              },
            ],
          },
        },
      },
			SQSQueue: {
				Type: "AWS::SQS::Queue",
				Properties: {
					QueueName: "catalogItemsQueue"
				}
			},
			GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
    },
    Outputs: {
      ImportFileBucketOutput: {
        Value: {
          Ref: 'ImportFileS3Bucket',
        },
      },
			SQSQueueArn: {
				Value: {
					'Fn::GetAtt': ["SQSQueue", "Arn"],
				}
			},
			SQSQueue: {
				Value: {
					Ref: "SQSQueue"
				}
			}
    },
  },
};

module.exports = serverlessConfiguration;
