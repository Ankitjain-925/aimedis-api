const express = require('express');
const app= express();
const fs= require("fs")
const bodyParser = require('body-parser');
const cors= require('cors')
const pdf = require('dynamic-html-pdf');
var html = fs.readFileSync('Userdata.html', 'utf8');
app.use(express.json());
app.use(cors());
const Port= 5000;

app.post('/download', (req, res)=>{
    var patientData= req.body
    var trackID = patientData.Dieseases
    delete trackID["track_id"];
    delete trackID["created_by"];
    trackID["created_by"] = trackID["created_by_temp"]
    delete trackID["created_by_temp"];
    console.log(trackID)
    // var patientDieseases = req.body.Dieseases
    pdfCreater(patientData);
    // console.log("123456789",patientData.user.first_name ,"vhskghkjksdhb", patientDieseases )
})

const pdfCreater=(patientData)=>{
// var patient=[
//     {
//     name:  patientData.patientData.name,
//     email: patientData.patientData.email,
//     DOB: patientData.patientData.birthday,
//     Mobile: patientData.patientData.mobile
//     }
// ]
// let Dignose =[{Dieseases:patientData.Dieseases}]
let dignoseKeys= Object.keys(patientData.Dieseases),
    dignoseValues= Object.values(patientData.Dieseases)
// console.log("KEY", dignoseKeys,dignoseValues)
var document = { 
    type: 'file',// 'file' or 'buffer'
    template: html,
    context: {
        type: patientData.Dieseases.type,
        // patient: patient,
        Dignose_Key: dignoseKeys,
        Dignose_Value: dignoseValues
    },
    path: `./${patientData.patientData.user.first_name} ${patientData.Dieseases.type}.pdf`    // it is not required if type is buffer
};

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header:'./aimedis.png'
};

pdf.create(document, options).then(res => {
        console.log("PDF creater Response ",res)
    }).catch(error => {
        console.error(error)
    });
}
app.listen(Port, ()=>{console.log("Server is running on", Port+" Port number")})

