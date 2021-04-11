require('dotenv').config();
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_VALUE)
  .table('products');


exports.handler = async(event,context) => {
    const { id } = event.queryStringParameters;
    
    if(id){
        try{
            const product = await airtable.retrieve(id);
            console.log(product)
            if(product.error){
                return {
                    statusCode: 404,
                    body: `No Product with id: ${id} found.`,
                }
            }
            return {
                statusCode: 200,
                body: JSON.stringify(product),
            }
        } catch(err) {
            return {
                statusCode: 500,
                body: 'Server Error',
            }
        }
    }
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
