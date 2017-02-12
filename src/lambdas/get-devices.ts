import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _getDevices(event) {
  const data   = event.body;
  const params = {
    TableName: `sheddingMappingTable-${process.env.NODE_ENV}`,
    KeyConditionExpression: '#eventId = :eventId',
    ExpressionAttributeNames: {'#eventId': 'eventId'},
    ExpressionAttributeValues: {':eventId': data.eventId}
  };
  let {Items} = await dynamo.query(params).promise();
  return Items;
};
export function getDevices(event, context, cb) {
  _getDevices(event).then((user) => {cb(null, user)}).catch(cb)
}
