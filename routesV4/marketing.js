var express = require("express");
let router = express.Router();
var nodemailer = require("nodemailer");



var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 25,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

router.post("/MarketingMail", function (req, res) {
  if(req.body.email !==""){
    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Contact and Support Message",
      html:
        "<div><b>Name -</b>&nbsp;" +
        req.body.first_name +
        "&nbsp;"+
        req.body.last_name +
        "</div><div><b>Company Name-</b>&nbsp;"+
        req.body.company_name+
        "</div><div><b>Option:-</b>&nbsp;"+
        req.body.option+
        "<div>"
    };
    let sendmail = transporter.sendMail(mailOptions);
    if (sendmail) {
      console.log("emailsend")
      res.json({
        status: 200,
        message: "Mail sent Successfully",
        hassuccessed: true,
      });
    } else {
      console.log("err")
      res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
    }
  }else{
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });

  }
  });



router.post("/MarketingMail2", function (req, res) {
  if(req.body.email !==""){
    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Investor Relation Request",
      html:
        "<div><b>Name:-</b>&nbsp" +
        req.body.first_name +
        "&nbsp;"+
        req.body.last_name +
        "</div>"
    };
    let sendmail = transporter.sendMail(mailOptions);
    if (sendmail) {
      res.json({
        status: 200,
        message: "Mail sent Successfully",
        hassuccessed: true,
      });
    } else {
      res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
    }
  }else{
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
  }
  });

router.post("/MarketingMail3", function (req, res) {
  if(req.body.email!=""){
    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Contact and Support Message",
      html:
        "<div><b>Name:-</b>&nbsp;" +
        req.body.first_name +
        "&nbsp;" +
        req.body.last_name +
        "</div><div><b>Option:-&nbsp;</b>"+
        req.body.option+
        "</div>"
    };
    let sendmail = transporter.sendMail(mailOptions);
    if (sendmail) {
      res.json({
        status: 200,
        message: "Mail sent Successfully",
        hassuccessed: true,
      });
    } else {
      res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
    }
  }else{
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
  }
  });
    



module.exports = router;

