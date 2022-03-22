require("dotenv").config();
var express = require("express");
let router = express.Router();
var Payment = require("../schema/payment_schema");
var Cart = require("../schema/cart");
var jwtconfig = require("../jwttoken");
const configureStripe = require("stripe");
const { encrypt, decrypt } = require("./Cryptofile.js");
const STRIPE_SECRET_KEY = process.env.LMS_STRIPE_SECRET_KEY_TEST;
const stripe = configureStripe(STRIPE_SECRET_KEY);
var moment = require("moment");

//For payment when enable then reset it

const postStripeCharge = (res, id) => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(400).json({ message: "Payment Failed", error: stripeErr });
  } else {
    paymentData = {
      amount: stripeRes.amount,
      amount_refunded: stripeRes.amount_refunded,
      billing_details: stripeRes.billing_details,
      Date: stripeRes.created,
      created: moment.unix(stripeRes.created).format("MM/DD/YYYY"),
      currency: stripeRes.currency,
      id: stripeRes.id,
      source: stripeRes.source,
      balance_transaction: stripeRes.balance_transaction,
      description: stripeRes.description,
    };
    if (id) {
      res
        .status(200)
        .json({ message: "Payment Success", paymentData: paymentData });
    }
  }
};

router.post("/", (req, res) => {
  var token = req.body.source;
  stripe.charges.create(req.body, postStripeCharge(res, token));
});

router.post("/intent", async (req, res) => {
try{
  var PaymentIntent = await stripe.paymentIntents.create(req.body);
  res
  .status(200)
  .json({ message: "Payment Success", data: PaymentIntent.client_secret });
}
catch(stripeErr){
  res.status(400).json({ message: "Payment Failed", error: stripeErr });
}
});

router.post("/saveData", (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    // var data = {user_id : req.body.user_id, attachment : req.body.attachment, userName: req.body.userName, userType: req.body.userType, email: req.body.email,courseId : req.body.courseId, courseTitle:req.body.courseTitle, courseDesc : req.body.courseDesc, price: req.body.price}

    var data = {
      user_id: req.body.user_id,
      userName: req.body.userName,
      userType: req.body.userType,
      paymentData: encrypt(JSON.stringify(req.body.paymentData)),
      _enc_paymentData: true,
      orderlist: encrypt(JSON.stringify(req.body.orderlist)),
      _enc_orderlist: true,
    };

    var paymentData = new Payment(data);
    paymentData.save((err) => {
      if (err) {
        res
          .status(200)
          .json({ mess: "Error at Saving Data!", success: false, data: err });
      } else {
        Payment.find({ user_id: req.body.user_id }, function (err, result) {
          if (err) {
            res
              .status(400)
              .json({
                message: "Something went wrong",
                hassuccessed: false,
                err: err,
              });
          } else {
            const user_id = req.body.user_id;
            const messageToSearchWith = new Cart({ user_id });
            messageToSearchWith.encryptFieldsSync();
            Cart.update(
              {
                $or: [
                  { user_id: req.body.user_id },
                  { user_id: messageToSearchWith.user_id },
                ],
              },
              { $set: { cartList: [] } },
              function (err, affected) {
                res
                  .status(200)
                  .json({
                    message: "Get all succussfully",
                    hassuccessed: true,
                    data: result,
                  });
              }
            );
          }
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
});

router.post("/saveDataNotCart", (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    // var data = {user_id : req.body.user_id, attachment : req.body.attachment, userName: req.body.userName, userType: req.body.userType, email: req.body.email,courseId : req.body.courseId, courseTitle:req.body.courseTitle, courseDesc : req.body.courseDesc, price: req.body.price}

    var data = {
      user_id: req.body.user_id,
      userName: req.body.userName,
      userType: req.body.userType,
      isFree: true,
      orderlist: encrypt(JSON.stringify(req.body.orderlist)),
      _enc_orderlist: true,
    };

    var paymentData = new Payment(data);
    paymentData.save((err) => {
      if (err) {
        res
          .status(200)
          .json({ mess: "Error at Saving Data!", success: false, data: err });
      } else {
        Payment.find({ user_id: req.body.user_id }, function (err, result) {
          if (err) {
            res
              .status(400)
              .json({
                message: "Something went wrong",
                hassuccessed: false,
                err: err,
              });
          } else {
            res
              .status(200)
              .json({
                message: "Get all succussfully",
                hassuccessed: true,
                data: result,
              });
          }
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
});

module.exports = router;
