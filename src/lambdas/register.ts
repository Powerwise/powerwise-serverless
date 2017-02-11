import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _register(event) {
  const data = event.body;
  console.log(`Registration of user with email ${data.email}`);
  const params = {
    TableName: `usersTable-${process.env.NODE_ENV}`,
    Item: {email: data.email, devices: [], postcode: data.postcode, type: 'user'},
  };
  let {Item} =
      await dynamo.get({TableName: `usersTable-${process.env.NODE_ENV}`, Key: {email: data.email}})
          .promise();
  if (Item) {
    console.log(`user found ${Item}`);
    return Item;
  } else {
    console.log(`user not found: creating`);
    let result: any = await dynamo.put(params).promise();
    console.log(`user created ${result}`);
    return result.Item;
  }
} export function register(event, context, cb) {
  _register(event).then((user) => {cb(null, user)}).catch(cb)
}
