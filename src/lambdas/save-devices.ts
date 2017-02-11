import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _save_device(event) {
  const data   = event.body;
  const params = {
    TableName: `usersTable-${process.env.NODE_ENV}`,
    Key: {email: data.email},
    UpdateExpression: 'set #a = :x',
    ExpressionAttributeNames: {'#a': 'devices'},
    ExpressionAttributeValues: {
      ':x': data.devices,
    }
  };
  let Item = await dynamo.update(params).promise();
  console.log(`${data.email} saved devices ${Item}`);
  return Item;
};
export function save_devices(event, context, cb) {
  _save_device(event).then((user) => {cb(null, user)}).catch(cb)
}
