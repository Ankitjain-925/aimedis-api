var express = require("express");
let router = express.Router();
const axios = require("axios");
var nodemailer = require("nodemailer");
const mailchimp = require("@mailchimp/mailchimp_marketing")
const md5 = require("md5")
var application_forms = require("../schema/applicationform.js");
var join_forms = require("../schema/joinform.js");




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
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email !== "") {
        let mailOptions = {
          from: req.body.email,
          to: "contact@aimedis.com",
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
        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });

      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    }
    else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});

router.post("/MarketingMail2", function (req, res) {
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email !== "") {

        let mailOptions = {
          from: req.body.email,
          to: "investorrelations@aimedis.com ",
          subject: "Investor Relation Request",
          html:

            "<div><b>Name:-</b>&nbsp" +

            req.body.first_name +
            "&nbsp;" +
            req.body.last_name +
            "</div>"
        };


        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });

      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    }
    else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});

router.post("/MarketingMail3", function (req, res) {
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email != "") {
        let mailOptions = {
          from: req.body.email,
          to: "contact@aimedis.com",
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

        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });

      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    }
    else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});

router.post('/subscribe', (req, res) => {
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
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
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
})

router.post("/avalonMail1", function (req, res) {
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email != "") {
        let mailOptions = {
          from: 'inquiries@aimedis.com',
          to: 'steve.ambrose@aimedis.com, michael.kaldasch@aimedis.com, ben.elidrissi@aimedis.com',
          subject: "New Inquiry - Avalon",
          html:
            "<div><b>Interested :-&nbsp;</b>" +
            req.body.interested +
            "</div><div><b>Represent :-&nbsp;</b>" +
            req.body.represent +
            "</div><div><b>E-mail :-&nbsp;</b>" +
            req.body.email +
            "</div>"
        };

        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });

      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});

router.post("/avalonMail2", function (req, res) {
  const response_key = req.body.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email != "") {
        let mailOptions = {
          from: 'inquiries@aimedis.com',
          to: 'steve.ambrose@aimedis.com,  michael.kaldasch@aimedis.com, ben.elidrissi@aimedis.com',
          subject: "New Inquiry - Avalon",
          html:
            "<div><b>Name:-</b>&nbsp;" +
            req.body.first_name +
            "&nbsp;" +
            req.body.last_name +
            "</div><div><b>Interested :-&nbsp;</b>" +
            req.body.interested +
            "</div><div><b>Represent :-&nbsp;</b>" +
            req.body.represent +
            "</div><div><b>Company Name :-&nbsp;</b>" +
            req.body.company_name +
            "</div><div><b>E-mail :-&nbsp;</b>" +
            req.body.email +
            "</div>"
        };

        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });
      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});

router.post("/Addjoinform", function (req, res, next) {
  const token = req.headers.token;
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };

 axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
 
      var adddata = new join_forms(req.body)
      adddata.save(function (err, user_data) {
          if (err && !user_data) {
              res.json({ status: 200,  hassuccessed: false, message: "Something went wrong.", error: err });
          } else {
              res.json({
                  status: 200,
                  message: "Added Successfully",
                  hassuccessed: true,
              });
          }
      });

    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
  

});

router.delete('/deleteJoinForm/:FormId', function (req, res, next) {
  join_forms.findOneAndRemove({ _id: req.params.FormId }, function (err, data12) {
      if (err) {
          res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
      } else {
          res.json({ status: 200, hassuccessed: true, msg: 'JoinForm is Deleted' });
      }
  })
})


router.post("/Addapplicationform", function (req, res, next) {
  const response_key = req.headers.token;
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };

 axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      var adddata = new application_forms(req.body)
      adddata.save(function (err, user_data) {
          if (err && !user_data) {
              res.json({ status: 200,  hassuccessed: false, message: "Something went wrong.", error: err });
          } else {
              res.json({
                  status: 200,
                  message: "Added Successfully",
                  hassuccessed: true,
              });
          }
      });
  } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });

});

router.delete('/deleteApplicationForm/:FormId', function (req, res, next) {
  application_forms.findOneAndRemove({ _id: req.params.FormId }, function (err, data12) {
      if (err) {
          res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
      } else {
          res.json({ status: 200, hassuccessed: true, msg: 'ApplicationForm is Deleted' });
      }
  })
})

router.post("/contact", function (req, res) {
  const response_key = req.headers.token;
  // Making POST request to verify captcha
  var config = {
    method: "post",
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`,
  };
  axios(config).then(function (google_response) {
    if (google_response.data.success == true) {
      if (req.body.email != "") {
        let mailOptions = {
          from: 'contact@aimedis.com',
          to: 'vaibhav.webnexus@gmail.com',
          subject: "New Inquiry - Staff",
          html:
            "<div><b>Interested :-&nbsp;</b>" +
            req.body.interested +
            "</div>"+
            "<div><b>E-mail :-&nbsp;</b>" +
            req.body.email +
            "</div><div><b>Message:-&nbsp;</b>"+
            req.body.Message+
            "</div>"
        };
        console.log("mailOptions",mailOptions)

        transporter.sendMail(mailOptions).then(() => {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        }).catch((err) => {
      console.log("er",err)
          res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false, data: err });
        });

      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  })
    .catch(function (error) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    });
});


module.exports = router;

