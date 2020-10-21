
var express             = require('express');
let router              = express.Router();
var User                = require('../schema/user.js');
var jwtconfig           = require('../jwttoken');
const configureStripe   = require('stripe');
const STRIPE_SECRET_KEY = 'sk_test_hUobT4GcGe95zN3uOC9MvqlF00vdthTPvO'
const stripe            = configureStripe(STRIPE_SECRET_KEY);
var moment              = require('moment');
//For payment when enable then reset it.s
const postStripeCharge = (res,id) => (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.json({ status : 200, hassuccessed : false, message : 'Payment Failed' ,error : stripeErr})
    } else {
      paymentData = ({
        amount         : stripeRes.amount,
        amount_refunded: stripeRes.amount_refunded,
        billing_details: stripeRes.billing_details,
        Date           : stripeRes.created,
        created        : moment.unix(stripeRes.created).format("MM/DD/YYYY"),
        currency       : stripeRes.currency,
        id             : stripeRes.id,
        source         : stripeRes.source,
        balance_transaction   : stripeRes.balance_transaction,
        description    : stripeRes.description,
      })
      if(id){
        User.updateOne({ _id: id },{ $push: { paid_services: paymentData } },
          { safe: true, upsert: true },  function (err, doc) {   
            if (err && !doc) {
                res.json({ status : 200, hassuccessed : false, message : 'Payment Failed' ,error : err})
                } else {
                res.json({ status : 200, hassuccessed : true, message : 'Payment successfull',data : doc})
            }
          });
      }
    }
}

router.post('/', (req, res) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var paymentData = {
      created        : moment(new Date()).format("MM/DD/YYYY"),
      description    : req.body.description,
    }
    User.updateOne({ _id: id },{ $push: { paid_services: paymentData } },
      { safe: true, upsert: true },  function (err, doc) {   
        if (err && !doc) {
            res.json({ status : 200, hassuccessed : false, message : 'something went wrong' ,error : err})
            } else {
            res.json({ status : 200, hassuccessed : true, message : 'booked successfully',data : doc})
        }
      });
    //stripe.charges.create(req.body, postStripeCharge(res,legit.id));
  });


module.exports = router;