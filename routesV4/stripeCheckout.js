require("dotenv").config();
var express = require("express");
let router = express.Router();
const configureStripe = require("stripe");
const STRIPE_SECRET_KEY = process.env.LMS_STRIPE_SECRET_KEY_TEST;
const stripe = configureStripe(STRIPE_SECRET_KEY);

router.post("/sub", async (req, res) => {
  const { email, payment_method, price_id } = req.body;
  try {
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      expand: ["latest_invoice.payment_intent"],
    });
    res.json({
      status: 200,
      hassuccessed: true,
      msg: "Payment successfully",
      data: subscription,
    });
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Something went wrong",
      error: err,
    });
  }
});

router.delete("/sub/:sub_id", async (req, res) => {
  try {
    const deleted = await stripe.subscriptions.del(req.params.sub_id);
    res.json({ status: 200, hassuccessed: true, msg: "Cancels successfully" });
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Something went wrong",
      error: err,
    });
  }
});

router.get("/sub/:sub_id", async (req, res) => {
  try {
    const deleted = await stripe.subscriptions.retrieve(req.params.sub_id);
    const status = deleted.status === "active" ? true : false;
    res.json({
      status: 200,
      hassuccessed: true,
      msg: "get subscription info",
      sub_status: status,
    });
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Something went wrong",
      error: err,
    });
  }
});

module.exports = router;
