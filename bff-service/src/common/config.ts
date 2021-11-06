import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const config = {
  PORT: process.env['PORT'],
  PRODUCTS: process.env['PRODUCTS'],
  CART: process.env['CART'],
};
