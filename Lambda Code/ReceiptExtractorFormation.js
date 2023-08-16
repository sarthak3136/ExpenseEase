const AWS = require('aws-sdk');
const textract = new AWS.Textract();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  // Get the S3 bucket and object information from the event
  console.log(event);
  console.log("Execution Started");
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // Set up AWS Textract parameters
  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key,
      },
    },
  };

  const downloadUrl = await s3.getSignedUrlPromise('getObject', {
    Bucket: bucket,
    Key: key,
    Expires: 60480,
  });

  try {
    // Call AWS Textract to analyze the expense document
    const data = await textract.analyzeExpense(params).promise();
    console.log(data);

    // Log the arrays
    console.log('Summary Fields:', data.ExpenseDocuments[0].SummaryFields);
    const summaryFields = data.ExpenseDocuments[0]?.SummaryFields || [];

    const extractField = (fieldName) => summaryFields.find(field => field.Type.Text === fieldName)?.ValueDetection?.Text;
    let vendorName = extractField('VENDOR_NAME');
    let vendorAddress = extractField('VENDOR_ADDRESS');
    let roundedTotal = extractField('TOTAL') ?? extractField('TOTAL' && 'ROUNDED TOTAL:');
    let invoiceReceiptDate = extractField('INVOICE_RECEIPT_DATE');

    // Log the extracted values
    console.log('VENDOR_NAME:', vendorName);
    console.log('VENDOR_ADDRESS:', vendorAddress);
    console.log('Rounded Total:', roundedTotal);
    console.log('Invoice Receipt Date:', invoiceReceiptDate);

    // Check if any of the variables are undefined and set them to default values
    if (vendorName === undefined || vendorName === "") {
      vendorName = "NAN";
    }
    if (vendorAddress === undefined || vendorAddress === "") {
      vendorAddress = "NAN";
    }
    if (roundedTotal === undefined || roundedTotal === "") {
      roundedTotal = "NAN";
    }
    if (invoiceReceiptDate === undefined || invoiceReceiptDate === "") {
      invoiceReceiptDate = "NAN";
    }

    // Call the putInDatabase function with the extracted or default values
    await putInDatabase(vendorName, vendorAddress, roundedTotal, invoiceReceiptDate, downloadUrl);
    console.log("Updated!");

    return {
      statusCode: 200,
      body: JSON.stringify({ expense: "Too much problems" }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing the expense document with Textract' }),
    };
  }
};

async function putInDatabase(vendorName, vendorAddress, roundedTotal, invoiceReceiptDate, downloadUrl) {
  console.log("Passed to Function");
  console.log(vendorName);
  console.log(vendorAddress);
  console.log(roundedTotal);
  console.log(invoiceReceiptDate);

  const item = {
    timeStamp: new Date().toISOString(),
    VendorName: vendorName,
    VendorAddress: vendorAddress,
    RoundedTotal: roundedTotal,
    InvoiceReceiptDate: invoiceReceiptDate,
    DownloadURL: downloadUrl,
  };

  const dbParams = {
    TableName: 'ExpenseTableFormation',
    Item: item,
  };

  await dynamodb.put(dbParams).promise();
}
