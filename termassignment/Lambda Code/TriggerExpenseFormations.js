const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
try {
  const params = {
    TableName: 'ExpenseTableFormation',
  };
  const data = await dynamodb.scan(params).promise();
  let total = 0; 

  data.Items.forEach((item) => {
    total += Number(item.RoundedTotal); 
  });

  const message = `Total monthly expenses: $${total}`;
  const topicArn = process.env.SNS_TOPIC_ARN; 

  const snsParams = {
    Message: message,
    TopicArn: topicArn,
  };

  await sns.publish(snsParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Message sent successfully' }),
  };
} catch (error) {
  console.error('Error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Error processing expenses or sending message' }),
  };
}
};
