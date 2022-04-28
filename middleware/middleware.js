var jwtconfig = require("../jwttoken");
var User = require("../schema/user.js");


module.exports = function CheckRole(current_api) {
    return function (req, res, next) {
        let token = req.headers.token
        let house_id = req.body.house_id || req.params.house_id
        let legit = jwtconfig.verify(token)
        if (legit.id) {
            User.findOne({ _id: legit.id }, function (err, data) {
                data.houses.map((element) => {
                    if (element.value == house_id) {
                     if (element.roles.includes(current_api)) {
                        next();
                    } else {
                        res.send({ status: 200, hassuccessed: false, data: "no_right", message: "No right to run this task" })
                    }
                    }
                })
                
            })
        }
        else {
            res.send({ status: 200, hassuccessed: false, data: "no_right", message: "No right to run this task" })
        }
    }
}
