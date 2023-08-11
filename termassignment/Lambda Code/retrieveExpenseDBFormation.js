const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: 'ExpenseTableFormation',
    };

    const data = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data from the "Expenses" table' }),
    };
  }
};
