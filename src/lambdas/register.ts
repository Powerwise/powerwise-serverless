import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
export function register(event, context, callback) {
  const data   = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {email: data.email, appliances: data.appliances, postcode: data.postcode},
  };
  dynamo.put(params, (error, result: any) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t register user.'));
      return;
    } else {
      callback(null, result.Item);
    }
  });
}
