const dotenv = require("dotenv");
var request = require("request");
const router = require("express").Router();
const crypto = require("crypto");
dotenv.config("env", dotenv);

router.post("/", async (req, res) => {
  try {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const timestamp = Date.now();
    console.log(timestamp);
    function base64URLEncode(data) {
      const base64 = Buffer.from(data, "utf8").toString("base64");
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }

    function sign(client_secret, payload) {
      const signature = crypto
        .createHmac("sha256", client_secret)
        .update(payload)
        .digest("hex");
      return signature;
    }

    const payload = timestamp + "." + client_id + "." + JSON.stringify(req.body);

    console.log("payload: ", payload);
    const encodedPayload = base64URLEncode(payload);
    console.log("encoded_payload: ", encodedPayload);
    const signature = sign(client_secret, encodedPayload);
    console.log("signature: ", signature);
    var headers = {
      "Content-Type": "application/json",
      "X-Tiniapp-Client-Id": client_id,
      "X-Tiniapp-Signature": signature,
      "X-Tiniapp-Timestamp": timestamp
    };

    var dataString = JSON.stringify(req.body);

    var options = {
      url: process.env.BASE_URL+"/order",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("test");
        console.log(body);
        res.json(body)
      }
    }

    request(options, callback);
  } catch {
    console.log("có lỗi ");
  }
});

module.exports = router;