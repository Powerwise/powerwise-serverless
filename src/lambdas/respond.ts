import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _respond(event) {
  const data = event.body;
  let items = data.devices.map((device) => {
    return {
      PutRequest: {
        Item: {deviceId: device.id, eventId: data.eventId, killowats: device.killowats, device}
      }
    }
  });
  var params = {RequestItems: {[`sheddingMappingTable-${process.env.NODE_ENV}`]: items}};
  let update = {
    TableName: `shedEventsTable-${process.env.NODE_ENV}`,
    Key: {timestamp: data.eventId},
    UpdateExpression: 'set #a = #a + :x',
    ExpressionAttributeNames: {'#a': 'responses'},
    ExpressionAttributeValues: {':x': 1}
  };
  // Update response counter.
  dynamo.update(update);
  let result = await dynamo.batchWrite(params).promise();
  return data;
};
export function respond(event, context, cb) {
  _respond(event).then((user) => {cb(null, user)}).catch(cb)
}
