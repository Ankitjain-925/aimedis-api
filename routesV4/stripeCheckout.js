require('dotenv').config();
var express             = require('express');
let router              = express.Router();
const configureStripe   = require('stripe');
const STRIPE_SECRET_KEY= process.env.LMS_STRIPE_SECRET_KEY_TEST
const stripe            = configureStripe(STRIPE_SECRET_KEY);

//For payment when enable then reset it.s
// const postStripeCharge = (res,id) => (stripeErr, stripeRes) => {
//     if (stripeErr) {
//       res.json({ status : 200, hassuccessed : false, message : 'Payment Failed' ,error : stripeErr})
//     } else {
//       paymentData = ({
//         amount         : stripeRes.amount,
//         amount_refunded: stripeRes.amount_refunded,
//         billing_details: stripeRes.billing_details,
//         Date           : stripeRes.created,
//         created        : moment.unix(stripeRes.created).format("MM/DD/YYYY"),
//         currency       : stripeRes.currency,
//         id             : stripeRes.id,
//         source         : stripeRes.source,
//         balance_transaction   : stripeRes.balance_transaction,
//         description    : stripeRes.description,
//       })
//       if(id){
//         User.updateOne({ _id: id },{ $push: { paid_services: paymentData } },
//           { safe: true, upsert: true },  function (err, doc) {   
//             if (err && !doc) {
//                 res.json({ status : 200, hassuccessed : false, message : 'Payment Failed' ,error : err})
//                 } else {
//                 res.json({ status : 200, hassuccessed : true, message : 'Payment successfull',data : doc})
//             }
//           });
//       }
//     }
// }

// router.post('/', (req, res) => {
//     const token = (req.headers.token)
//     let legit = jwtconfig.verify(token)
//     var paymentData = {
//       created        : moment(new Date()).format("MM/DD/YYYY"),
//       description    : req.body.description,
//     }
//     User.updateOne({ _id: id },{ $push: { paid_services: paymentData } },
//       { safe: true, upsert: true },  function (err, doc) {   
//         if (err && !doc) {
//             res.json({ status : 200, hassuccessed : false, message : 'something went wrong' ,error : err})
//             } else {
//             res.json({ status : 200, hassuccessed : true, message : 'booked successfully',data : doc})
//         }
//       });
//     //stripe.charges.create(req.body, postStripeCharge(res,legit.id));
//   });

  router.post('/sub', async (req, res) => {
    const {email, payment_method, price_id} = req.body;
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
          expand: ['latest_invoice.payment_intent']
        });
        res.json({ status: 200, hassuccessed: true, msg: 'Payment successfully', data: subscription })
  }
  catch (err) {
    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
     
   }
   
  })
  
  
  router.delete('/sub/:sub_id', async (req, res) => {
      try{
          const deleted = await stripe.subscriptions.del(
              req.params.sub_id
            );
            res.json({ status: 200, hassuccessed: true, msg: 'Cancels successfully' })
      }
      catch (err) {
        res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
       }
    })
  
  router.get('/sub/:sub_id', async (req, res) => {
      try{
      const deleted = await stripe.subscriptions.retrieve(
          req.params.sub_id
        );
        const status = deleted.status === 'active' ? true: false;
        res.json({ status: 200, hassuccessed: true, msg: 'get subscription info', sub_status: status })
      }
      catch (err) {
        res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
      }
    })

module.exports = router;