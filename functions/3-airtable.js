require('dotenv').config();
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_VALUE)
  .table('products');

exports.handler = async(event,context) => {
    try{
        const { records } = await airtable.list();
        const products = records.map(
            product => {
                const { id } = product;
                const { name, image, price } = product.fields;
                const url = image[0].url;
                return { id, name, url, price }
            }
        );
        return {
            statusCode: 200,
            body: JSON.stringify(products),
        }
    } catch(err) {
        return{
            statusCode: 500,
            body: 'Server Error'
        }
    }
}