import 'source-map-support/register';

import type { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as csv from 'csv-parser';

import { middyfy } from '@libs/lambda';

const BUCKET = 'task-egor-number-five'

const importFileParser = async (event: S3Event) => {
	 const s3 = new S3({ region: "eu-west-1" });

		event.Records.forEach((record) => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key,
    }).createReadStream();

    s3Stream
      .pipe(csv())
      .on('data', (data) => {
        console.log(data);
      })
      .on('end', async () => {
        console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

        await s3.copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed'),
        }).promise();

        console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

				console.log(`Delete from ${BUCKET}/${record.s3.object.key}`);

				await s3.deleteObject({
                        Bucket: BUCKET,
                        Key: record.s3.object.key,
                    }).promise();

				console.log('Delete confirm');
      });
  });
	
}

export const main = middyfy(importFileParser);
