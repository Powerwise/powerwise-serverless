import * as AWS from 'aws-sdk';
import * as moment from 'moment-timezone';
import * as SparkPost from 'sparkpost';

const client = new SparkPost('652723242a73f42469fad3fd2d18e8b8a89022f0');
const dynamo = new AWS.DynamoDB.DocumentClient();
async function _create_event(event) {
  const data = event.body;
  console.log(`Creating Event ${data.timestamp}`);

  const userQuery = {
    TableName: `usersTable-${process.env.NODE_ENV}`,
    KeyConditionExpression: '#t = :ty',
    ExpressionAttributeNames: {'#t': 'type'},
    ExpressionAttributeValues: {':ty': 'user'}
  };
  let {Items}        = await dynamo.query(userQuery).promise();
  const users        = Array.isArray(Items) ? Items : [];
  const eventPayload = {
    TableName: `shedEventsTable-${process.env.NODE_ENV}`,
    Item:
        {timestamp: data.timestamp, duration: data.duration, responses: 0, requests: users.length},
  };
  let result: any = await dynamo.put(eventPayload).promise();
  console.log(JSON.stringify(Items, null, 2));
  let recipients = users.map(
      (user) => ({
        address: user['email'],
        'substitution_data': {
          cta_url: `${process.env.REDIRECT}/response/${data.timestamp}?email=${user['email']}`
        }
      }));
  console.log(`sending to ${recipients.length} users`);
  let email = {
    campaign_id: `powerwise-expected-event-${data.timestamp}`,
    substitution_data: {
      shed_expected_start_time:
          moment.tz('Australia/Adelaide').add(15, 'm').format('hh:mm a').toString(),
      'shed_duration_string': `${data.duration / 60} minutes`
    },
    metadata: {unique_id: data.timestamp},
    content: {template_id: 'powerwise-demo-event'}, recipients
  };
  await client.transmissions.send(email);
  return data;
} export function create_event(event, context, cb) {
  _create_event(event).then((evt) => {cb(null, evt)}).catch(cb)
}
