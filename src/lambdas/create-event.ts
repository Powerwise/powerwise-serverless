import * as AWS from 'aws-sdk';
import * as moment from 'moment-timezone';
import * as SparkPost from 'sparkpost';

const client = new SparkPost();
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _create_event(event) {
  const data = event.body;
  console.log(`Creating Event ${data.timestamp}`);
  const eventPayload = {
    TableName: `shedEventsTable-${process.env.NODE_ENV}`,
    Item: {timestamp: data.timestamp, duration: data.duration},
  };
  const userQuery = {
    TableName: `usersTable-${process.env.NODE_ENV}`,
    KeyConditionExpression: '#t = :ty',
    ExpressionAttributeNames: {'#t': 'type'},
    ExpressionAttributeValues: {':ty': 'user'}
  };
  let result: any = await dynamo.put(eventPayload).promise();
  let {Items}     = await dynamo.query(userQuery).promise();
  console.log(JSON.stringify(Items, null, 2));
  let recipients = (Array.isArray(Items) ? Items : []).map((user) => ({address: user['email']}));
  console.log(`sending to ${recipients.length} users`);
  await client.transmissions.send({
    transmissionBody: {
      campaign_id: `powerwise-expected-event-${data.timestamp}`,
      substitution_data: {
        shed_expected_start_time: moment.tz('Australia/Adelaide').format('hh:mm a'),
        'shed_duration_string': `${data.duration / 60} minutes`
      },
      metadata: {unique_id: data.timestamp},
      content: {template_id: 'powerwise-expected-event'}, recipients
    }
  });
  return data;
} export function create_event(event, context, cb) {
  _create_event(event).then((evt) => {cb(null, evt)}).catch(cb)
}
