const mongooseFieldEncryption =
  require("mongoose-field-encryption").fieldEncryption;
const { encrypt, decrypt } = require("./Cryptofile.js");
let express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  jwtconfig = require("../jwttoken"),
  app = express(),
  Schema = require("../schema/lms_schema");
Wishlist = require("../schema/wishlist_schema");
var Payment = require("../schema/payment_schema");
var Rating = require("../schema/lms_rating");
var Cart = require("../schema/cart.js");

var AllCourse = [];

router.post("/addLms", (req, res) => {
  var lmsSchema = new Schema(req.body);
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    lmsSchema.save((err, result) => {
      if (result) {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Successfully data Uploaded !",
          result: result,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Problem in Inserting data",
          error: err,
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

router.post("/getVideoList", (req, res, next) => {
  AllCourse = [];
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Schema.find(
      { permission: { $elemMatch: { $in: [req.body.user_type] } } },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          forEachPromise(result, getAllrating).then((result) => {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "User is found",
              data: AllCourse,
            });
          });
          // res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

function forEachPromise(items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}

function getAllrating(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      Rating.aggregate([
        { $match: { courseID: `${data._id}` } },
        {
          $group: {
            _id: "$courseID",
            average: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ])
        .exec()
        .then(function (doc3) {
          var new_data = data;
          if (doc3 && doc3.length > 0) {
            new_data.courseContent = doc3[0];
          }
          AllCourse.push(new_data);
          resolve(AllCourse);
        });
    });
  });
}

router.post("/getFilteredVideoList", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Schema.find(
      {
        permission: { $elemMatch: { $in: [req.body.user_type] } },
        topic: { $elemMatch: { $in: [req.body.keyword] } },
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/getlanguageBasedVideoList", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Schema.find(
      {
        permission: { $elemMatch: { $in: [req.body.user_type] } },
        language: req.body.language,
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/getCart", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.body.user_id;
    const messageToSearchWith = new Cart({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Cart.findOne(
      {
        $or: [
          { user_id: req.body.user_id },
          { user_id: messageToSearchWith.user_id },
        ],
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/addtocart", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    // Find the document
    const user_id = req.body.user_id;
    const messageToSearchWith = new Cart({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Cart.updateOne(
      {
        $or: [
          { user_id: req.body.user_id },
          { user_id: messageToSearchWith.user_id },
        ],
      },
      req.body,
      { upsert: true, new: true, setDefaultsOnInsert: true },
      function (error, result) {
        if (error) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: error,
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            message: "Setting Updated",
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

//remove CART
router.delete("/removeCart/:UserId/:CourseId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.params.UserId;
    const messageToSearchWith = new Cart({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Cart.updateOne(
      {
        $or: [
          { user_id: req.params.UserId },
          { user_id: messageToSearchWith.user_id },
        ],
      },
      { $pull: { cartList: { courseId: req.params.CourseId } } },
      { multi: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Track record is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "track is deleted",
            });
          }
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/addtowishlist", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var wishlists = new Wishlist(req.body);
    wishlists.save((err) => {
      if (err) {
        res
          .status(200)
          .json({ mess: "Error at Saving Data!", success: false, data: err });
      } else {
        Wishlist.find({ user_id: req.body.user_id }, function (err, result) {
          if (err) {
            res.json({
              status: 200,
              message: "Something went wrong",
              hassuccessed: false,
              err: err,
            });
          } else {
            res.json({
              status: 200,
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

router.get("/AverageRating", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Rating.aggregate(
      [
        {
          $group: {
            _id: "$courseID",
            average: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ],
      function (err, result) {
        res.json({
          status: 200,
          message: "Get all succussfully",
          hassuccessed: true,
          data: result,
        });
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/getWishlist", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.body.user_id;
    const messageToSearchWith = new Wishlist({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Wishlist.find(
      {
        $or: [
          { user_id: messageToSearchWith.user_id },
          { user_id: req.body.user_id },
        ],
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.get("/getAllLms", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Schema.find({}, function (err, result) {
      if (err) {
        res.json({
          status: 200,
          message: "Something went wrong",
          hassuccessed: false,
          err: err,
        });
      } else {
        res.json({
          status: 200,
          message: "Get all course",
          hassuccessed: true,
          data: result,
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

// Model.update(query, { name: 'jason bourne' }, options, callback);
router.post("/editLms/:_id", (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Schema.updateOne({ _id: req.params._id }, req.body)
      .then((data) => {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Course Data updated Successfully.",
          Data: data,
        });
      })
      .catch((err) => {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went Wrong.",
          Error: err,
        });
      });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.get("/getWishlist", (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Wishlist.find({}, (err, data) => {
      if (data) {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Course Wishlist Fetched Successfully.!",
          data,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong..",
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

router.delete("/removeLms/:Id", function (req, res) {
  let legit = jwtconfig.verify(req.headers.token);
  if (legit) {
    Schema.findOneAndRemove({ _id: req.params.Id }, function (err, data12) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong.",
          error: err,
        });
      } else {
        res.json({ status: 200, hassuccessed: true, msg: "Course is Deleted" });
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

router.get("/getOrderHistory/:id", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.params.user_id;
    const messageToSearchWith = new Payment({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Payment.find(
      {
        $or: [
          { user_id: req.params.user_id },
          { user_id: messageToSearchWith.user_id },
        ],
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          var result1 = [];
          result.forEach(function (obj) {
            obj.paymentData =
              obj._enc_paymentData === true
                ? JSON.parse(decrypt(obj.paymentData))
                : (obj.paymentData = obj.paymentData);
            obj._enc_orderlist === true
              ? (obj.orderlist = JSON.parse(decrypt(obj.orderlist)))
              : (obj.orderlist = obj.orderlist);
            result1.push(obj);
          });
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result1,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/getOrderHistory", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.body.user_id;
    const messageToSearchWith = new Payment({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Payment.find(
      {
        $or: [
          { user_id: req.body.user_id },
          { user_id: messageToSearchWith.user_id },
        ],
      },
      function (err, result) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong",
            hassuccessed: false,
            err: err,
          });
        } else {
          var result1 = [];
          result.forEach(function (obj) {
            obj.paymentData =
              obj._enc_paymentData === true
                ? JSON.parse(decrypt(obj.paymentData))
                : (obj.paymentData = obj.paymentData);
            obj._enc_orderlist === true
              ? (obj.orderlist = JSON.parse(decrypt(obj.orderlist)))
              : (obj.orderlist = obj.orderlist);
            result1.push(obj);
          });
          res.json({
            status: 200,
            message: "Get all succussfully",
            hassuccessed: true,
            data: result1,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.get("/getOrderHistory", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Payment.find({}, function (err, result) {
      if (err) {
        res.json({
          status: 400,
          message: "Something went wrong",
          hassuccessed: false,
          err: err,
        });
      } else {
        var result1 = [];
        result.forEach(function (obj) {
          obj.paymentData =
            obj._enc_paymentData === true
              ? JSON.parse(decrypt(obj.paymentData))
              : (obj.paymentData = obj.paymentData);
          obj._enc_orderlist === true
            ? (obj.orderlist = JSON.parse(decrypt(obj.orderlist)))
            : (obj.orderlist = obj.orderlist);
          result1.push(obj);
        });
        res.json({
          status: 200,
          message: "Get all succussfully",
          hassuccessed: true,
          data: result1,
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

router.post("/addRating", (req, res) => {
  var Ratings = new Rating(req.body);
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Ratings.save((err, result) => {
      if (result) {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Successfully data Uploaded !",
          result: result,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Problem in Inserting data",
          error: err,
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

router.get("/myRating", (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = legit.id;
    const messageToSearchWith = new Rating({ user_id });
    messageToSearchWith.encryptFieldsSync();
    Rating.find(
      {
        $or: [{ user_id: legit.id }, { user_id: messageToSearchWith.user_id }],
      },
      (err, result) => {
        if (result) {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Successfully data Uploaded !",
            data: result,
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Problem in Inserting data",
            error: err,
          });
        }
      }
    );
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

module.exports = router;
