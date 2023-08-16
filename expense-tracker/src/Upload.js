import React, { useEffect, useState } from 'react';
import AWS from "aws-sdk";
import axios from 'axios';

function Upload() {

  const[file, setFile] = useState(null);
  const[fileUploadStatus, setFileUploadStatus] = useState(false)
 
  const uploadFile = async() => {
    const S3_Bucket = "expensereceipts123";
    const REGION = "us-east-1";

    // S3 Credentials
    AWS.config.update({
        accessKeyId: "ASIAWIVCLCSQJ3NKZO5V",
        secretAccessKey: "1N02vVOFXSp0m+aXW5fy+gxlCDVhBGn3E2tb8BYX",
        sessionToken: "FwoGZXIvYXdzEPn//////////wEaDCuAt5gJVyg6x8ePciLAATnEB8n6tNeemvZivbIYVD3RCkUaLzSHbxoNzeTwycgkKw5LIZmfsk2hjo462s7PQgQ/5IzhOSh2/mAvRD55M/PCLJYBQmSkKxyNEwfMGsxWDZXIBHkbIxd8hFYXYjeTfG8itc/OqGdWReuz6JLfKhTW/d4PG82fjZC6BiywnDyX0EBMGmQeeGsTryO4MMjkBuEc73wi1apuW0jrTvwrxK0iPYUKasBxbZMQQijaLx1D8QQ5mTp6T4hewcKbG2hh+SjZnZGmBjIt1jomxoz185dKpR9gxXsBTCwwSawQ8tt4MTr4K+FFADUbYesr0iJ8T09DIgGF"
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

    // Files Parameters for Pdf
    // const paramsPdf = {
    //     Bucket: S3_Bucket,
    //     Key: file.name,
    //     Body: file,
    //     ContentType:'application/pdf',
    //     ContentDisposition: 'inline'
    // };
    
    // Uploading file to s3
    if(file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg"){
        var uploadImage = s3.putObject(paramsImage).on("httpUploadProgress", (evt) => {
            // File uploading progress
            console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
        }).promise();
    
        await uploadImage.then((err, data) => {
            console.log(err);
            alert("File uploaded successfully.");
            axios.get("https://qy4n8pmnya.execute-api.us-east-1.amazonaws.com/dev/demo").then((res) => {
                console.log("Expense Details")
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    // else if(file.type === "application/pdf"){
    //     var uploadPdf = s3.putObject(paramsPdf).on("httpUploadProgress", (evt) => {
    //         // File uploading progress
    //         console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
    //     }).promise();
    
    //     await uploadPdf.then((err, data) => {
    //         console.log(err);
    //         alert("File uploaded successfully.");
    //         setFileUploadStatus(true);
    //     })
    // }
  }

  const getExpenses = async ()=> {
    axios.get("https://qy4n8pmnya.execute-api.us-east-1.amazonaws.com/dev/getexpenses").then((res)=> {
        console.log(res);
    }).catch((err)=> {
        console.log(err);
    })
  }
  
  useEffect(()=> {
    getExpenses();
  }, []);

  return (
   <div>
        <input 
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload</button>
   </div>
  )
}

export default Upload

// https://qy4n8pmnya.execute-api.us-east-1.amazonaws.com/dev/latest-expense
