# ExpenseEase

Expense Analyzer Application is a cloud-based platform developed for efficient tracking and analysis of personal expenses. It offers a streamlined approach to manage spending patterns and financial insights. The application utilizes various AWS services to process receipts, store data, and provide user-friendly interfaces for expense management.


### Features
Expense Analyzer Application boasts the following key features:

- Receipt Upload and Analysis: Upload and process receipt images using AWS Textract to extract relevant information.
- Expense Storage: Store receipts securely in AWS S3 and structured data in DynamoDB.
- Expense Display and Analysis: Fetch and display expenses using React frontend and AWS Lambda backend.
- Email Notifications: Send weekly spending summaries using AWS SNS and EventBridge.

### Usage

Utilize the Expense Analyzer Application as follows:

- Users can upload images of their receipts, which will be processed to extract key information such as date, vendor, and amount.
- The extracted information is stored securely in DynamoDB for future reference.
- Users can view their expenses through the React-based frontend, accessing their data from the DynamoDB using AWS Lambda.
- Email notifications provide users with weekly summaries of their spending patterns.

### Architecture Diagram

![Architecture for ExpenseEase](https://github.com/sarthak3136/ExpenseEase/blob/main/ExpenseArchitecture.png)

The application uses the IP address of the EC2 instance provisioned from the CloudFormation along with the port 3000 of the react to run the expense analyzer application. The user will upload the bill or receipts either in image or pdf format. The object uploaded will be stored in S3 Bucket which will trigger the Receipt Extractor Lambda, responsible for extracting the information with the help of AWS Textract. The extracted information will be stored in DynamoDB. After the object has been successfully uploaded in S3 and information extracted, it will trigger API Gateway URL in frontend to fetch the expense uploaded along with recent expenses. 

### Contributing

Contributions are always welcome! Follow these steps to contribute:

1. **Fork** the repository.
2. Create a new branch:
```bash
git checkout -b new-feature
```
3. Make your changes and commit them:
```bash
git commit -m "Commit name"
```
4. Push to the new branch:
```bash
git push origin new-feature
```
5. Create a pull request on GitHub.
    
