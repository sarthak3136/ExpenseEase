import React, {useState, useEffect, Fragment} from 'react'
import expenseDoodle from './expense-3.png'
import Button from '@mui/material/Button';
import addExpenseImage from './addExpenseImage.png'
import { TextField, Box, InputLabel, MenuItem, Select, Autocomplete, Table, TableBody, TableHead, TableContainer, TableRow, Typography, Paper } from '@mui/material';
import AWS from "aws-sdk";
import axios from 'axios';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

function Expense() {
    const[file, setFile] = useState(null);
    const[fileName, setFileName] = useState("");
    const options = ['The Godfather', 'Pulp Fiction'];
    const[allExpenses, setAllExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [apiGatewayUrl, setApiGatewayUrl] = useState('');

    async function uploadFileChange(e){
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const handleSubmit = async(event)=> {
        event.preventDefault();
        const S3_Bucket = "expense-receipts-s3bucket";
        const REGION = "us-east-1";
    
        // S3 Credentials
        AWS.config.update({
            accessKeyId: "ASIAWIVCLCSQFJ67VUHH",
            secretAccessKey: "wL+AWjYuDKu34+FBb5b+pb2rWPZ+dTPj490ooBIr",
            sessionToken: "FwoGZXIvYXdzEFkaDKiJ1xEIWf88S77BZiLAAUxFHmhZpxxLyxWVtnaOYOOlDyQov8vSuloYrCTY4RO0wCbrv5jwIMuHctZFWdSlbtkmNEUZ2Fg0bfU4cwSyZ5/vdXTxQmHIs4vaCJFkiJXfv72cXijAbEEVuQMfCQ7iqOfmYpecEIeF7AfsU339O2AkpNQzwxLqQnGvbbfLXYBLiL+bjMOu01vA58G3uMHu4JSGRDyEeMykKoEsNk6GhH6c1h3v7PZiAPB3DHMTPPEjcAJObWE8AQK2yl+2SokgLyi8uqamBjItkJwNpumw3K3tI3brKvEWTqAnBLBdzYz32wqqxItoYva9rSZ9tilyITgYuDI8"
        })
        const s3 = new AWS.S3({
            params: {Bucket: S3_Bucket},
            region: REGION,
        });
    
        // Files Parameters for Image
        const paramsImage = {
            Bucket: S3_Bucket,
            Key: file.name,
            Body: file,
            ContentType:'image/png'
        };

        if(file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg"){
            var uploadImage = s3.putObject(paramsImage).on("httpUploadProgress", (evt) => {
                // File uploading progress
                console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
            }).promise();
        
            await uploadImage.then((err, data) => {
                console.log(err);
                alert("File uploaded successfully.");
            })
        }
    }

    const getExpenses = async () => {
        AWS.config.update({
            region: 'us-east-1',
            accessKeyId: "ASIAWIVCLCSQFJ67VUHH",
            secretAccessKey: "wL+AWjYuDKu34+FBb5b+pb2rWPZ+dTPj490ooBIr",
            sessionToken: "FwoGZXIvYXdzEFkaDKiJ1xEIWf88S77BZiLAAUxFHmhZpxxLyxWVtnaOYOOlDyQov8vSuloYrCTY4RO0wCbrv5jwIMuHctZFWdSlbtkmNEUZ2Fg0bfU4cwSyZ5/vdXTxQmHIs4vaCJFkiJXfv72cXijAbEEVuQMfCQ7iqOfmYpecEIeF7AfsU339O2AkpNQzwxLqQnGvbbfLXYBLiL+bjMOu01vA58G3uMHu4JSGRDyEeMykKoEsNk6GhH6c1h3v7PZiAPB3DHMTPPEjcAJObWE8AQK2yl+2SokgLyi8uqamBjItkJwNpumw3K3tI3brKvEWTqAnBLBdzYz32wqqxItoYva9rSZ9tilyITgYuDI8"
        })
        const ssm = new AWS.SSM();
        const parameterName = '/ExpenseApp/ApiGatewayURL';
        var apiUrl = ""
        try {
            const params = {
                Name: parameterName,
                WithDecryption: false, 
            };
            const response = await ssm.getParameter(params).promise();
            apiUrl = response.Parameter.Value;
            console.log(response.Parameter.Value)
            setApiGatewayUrl(response.Parameter.Value);
        } catch (error) {
            console.error('Error fetching API Gateway URL from SSM:', error);
        }
        
    
        const url = apiUrl + "/expenseformation"
        console.log(url)
        axios
          .get(url)
          .then((res) => {
            setAllExpenses(res.data);
            const total = res.data.reduce((acc, expense) => acc + parseFloat(expense.RoundedTotal), 0);
            setTotalExpense(total);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      };

    useEffect(()=> {
        getExpenses();
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
    
  return (
    <div className='main-div' style={{border: '3px solid red'}}>
        <div className='front-image-div'>
            <span className='analyze-all'>Analyze All</span>
            <span className='financial-clarity'>Financial Clarity at Your Fingertips, </span>
            <span className='embrace'> Embrace Smarter Expense Tracking!</span>
            <span className='expense-keyword'>Expenses</span>
            <img alt ="expense" className='expenseDoodle' src = {expenseDoodle}></img>
            <Button variant='contained' className='readMore' style={{backgroundColor: '#dc3545', position: 'absolute', top: '350px', left: '100px'}}>Read more</Button>
        </div>

        <div className='add-expense'>
            <img alt ="expense" className='addExpenseDoodle' src = {addExpenseImage}></img>
            <div>
                <Box width="30%" p={4} sx={{ backgroundColor: '#F7F7FC', borderRadius: '15px', position: 'absolute', top: '45px', left: '35px'}}>
                    <h2>Upload Receipts</h2>
                    <form>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            margin="normal"
                        />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={options}
                            fullWidth
                            sx={{marginTop: '10px'}}
                            renderInput={(params) => <TextField {...params} label="Receipt Type" />}
                        />
                        <Button variant="outlined" sx={{marginTop: '17px'}} component="label" fullWidth>
                            Upload a file
                            <input 
                                type="file"
                                hidden
                                onChange={e => uploadFileChange(e)}
                            />
                        </Button>
                        <p>{fileName}</p>
                        <TextField
                            label="Any Notes"
                            name="notes"
                            fullWidth
                        />
                        <Box mt={2} display="flex">
                            <Button variant="contained" onClick={handleSubmit} style={{marginLeft: '80px'}} color="primary" type="submit">
                            Submit
                            </Button>
                            <Button variant="contained" style={{marginLeft: '90px'}} color="secondary">
                            Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </div>
        </div>

        <div className='expense-table'>
        <h2 style={{position: 'absolute', top: '50px', left: '44%', fontSize: '30px'}}>All Expenses</h2>
        <TableContainer style={{height: "auto", width: "70%", position: 'absolute', top: '20%', left:'15%'}}component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ fontSize: '20px'}}>Index</StyledTableCell>
                            <StyledTableCell style={{ fontSize: '20px'}}>Invoice Receipt Date</StyledTableCell>
                            <StyledTableCell style={{ fontSize: '20px'}}>Vendor Name</StyledTableCell>
                            <StyledTableCell style={{ fontSize: '20px'}}>Vendor Address</StyledTableCell>
                            <StyledTableCell style={{ fontSize: '20px'}}>Rounded Total</StyledTableCell>
                            <StyledTableCell style={{ fontSize: '20px'}}>Download Receipt</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {allExpenses.map((expense, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>{index+1}</StyledTableCell>
                            <StyledTableCell>{expense.InvoiceReceiptDate}</StyledTableCell>
                            <StyledTableCell>{expense.VendorName}</StyledTableCell>
                            <StyledTableCell>{expense.VendorAddress}</StyledTableCell>
                            <StyledTableCell>{expense.RoundedTotal}</StyledTableCell>
                            <StyledTableCell>
                            <a href={expense.DownloadURL} target="_blank" rel="noopener noreferrer">
                                Download
                            </a>
                            </StyledTableCell>
                        </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <span style={{fontSize: '20px'}}>Total Expense:</span> ${totalExpense}
        </div>
    </div>
  )
}

export default Expense

