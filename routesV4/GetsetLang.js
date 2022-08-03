var Settings = require("../schema/settings");
var fetch = require("node-fetch");
function getMsgLang(UserId = "") {
  let promise = new Promise((resolve, reject) => {
    Settings.findOne({ user_id: UserId })
      .exec()
      .then(function (doc3) {
        var lang = "en";
        if (doc3) {
          lang = doc3.msg_language ? doc3.msg_language : "en";
        }
        resolve(lang);
      });
  });
  return promise.then((lang) => {
    return lang;
  });
}
function trans(text, opts = {}) {
  var source = opts.source || "en";
  var target = opts.target || "de";
  var url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    source +
    "&tl=" +
    target +
    "&dt=t&q=" +
    encodeURI(text);

  var parseJSON = (txt) =>
    JSON.parse(
      txt
        .split(",")
        .map((x) => x || "null")
        .join(",")
    );

  var joinSnippets = (json) => json[0].map((x) => x[0]).join("");
  return fetch(url)
    .then((res) => res.text())
    .then((text) => joinSnippets(parseJSON(text)))
    .catch((reason) => console.log("Google Translate: " + reason));
}

module.exports = { getMsgLang, trans };
