var express = require("express");
let router = express.Router();
var nodemailer = require("nodemailer");
const mailchimp = require("@mailchimp/mailchimp_marketing")
const md5 = require("md5")




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
  if (req.body.email !== "") {
    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Contact and Support Message",
      html:
        "<div><b>Name -</b>&nbsp;" +
        req.body.first_name +
        "&nbsp;" +
        req.body.last_name +
        "</div><div><b>Company Name-</b>&nbsp;" +
        req.body.company_name +
        "</div><div><b>Option:-</b>&nbsp;" +
        req.body.option +
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
  } else {
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });

  }
});



router.post("/MarketingMail2", function (req, res) {
  if (req.body.email !== "") {

    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Investor Relation Request",
      html:

        "<div><b>Name:-</b>&nbsp" +

        req.body.first_name +
        "&nbsp;" +
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
  } else {
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
  }
});

router.post("/MarketingMail3", function (req, res) {
  if (req.body.email != "") {
    let mailOptions = {
      from: req.body.email,
      to: "vaibhav.webnexus@gmail.com",
      subject: "Contact and Support Message",
      html:
        "<div><b>Name:-</b>&nbsp;" +
        req.body.first_name +
        "&nbsp;" +
        req.body.last_name +
        "</div><div><b>Option:-&nbsp;</b>" +
        req.body.option +
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
  } else {
    console.log("no email")
    res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
  }
});



router.post('/subscribe', (req, res) => {

  mailchimp.setConfig({
    apiKey: 'cdc28513af7095e5fe5a349065cd58a3-us20',
    server: 'us20',
  });

  const { email } = req.body
  if (email != "") {
    const subscriberHash = md5(email.toLowerCase());
    const listId = '8f2e5a6770';

    const response = mailchimp.lists.setListMember(
      listId,
      subscriberHash,
      {
        email_address: email,
        status_if_new: 'subscribed',
      }
    );
    res.json({
      status: 200,
      message: "New Subscription",
      hassuccessed: true,
    });
  }
  else {
    res.json({
      status: 200,
      message: "Email required",
      hassuccessed: false,
    });
  }
})


module.exports = router;

