export default {
  type: "object",
  properties: {
    product: {
			count: Number,
    	price: Number,
    	title: String,
    	description: String
		}
  },
  required: ['product']
} as const;