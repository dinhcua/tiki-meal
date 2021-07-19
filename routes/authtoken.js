const router = require("express").Router();
var request = require("request");
const crypto = require("crypto");
dotenv.config("env", dotenv);
//REGISTER


router.post("/", async (req, res) => {
  try {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.MONGO_SECRET;

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

    const payload = timestamp + "." + client_id + "." + JSON.stringify({"code": req.body.auth_code});
    console.log("payload: ", payload);
    const encodedPayload = base64URLEncode(payload);
    console.log("encoded_payload: ", encodedPayload);
    const signature = sign(client_secret, encodedPayload);
    console.log("signature: ", signature);
    var headers = {
      "Content-Type": "application/json",
      "X-Tiniapp-Client-Id": client_id,
      "X-Tiniapp-Signature": signature,
      "X-Tiniapp-Timestamp": timestamp.toString(),
    };

    // console.log("code",req.body.auth_code);
    var dataString = JSON.stringify({"code": req.body.auth_code});
    // console.log(dataString);
    var options = {
      url: process.env.URL_BASE+"/api/v1/oauth/auth/token",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        
        // const a = body.data.access_token;
        res.json(body)
        console.log(body);
      }
    }
    request(options, callback);
    // console.log(callback);
  } catch (err) {
    res.status(500).json(err);
  }
});


// headers = {
//   'Authorization': 'Bearer u61Po3FdluZubZ4v0lKb3kohLLGI6Rkm25AWc0zqa4k',
// }

// response = requests.get('https://openapi.tiki.vn/ecom/v1/customers/profile', headers=headers)

module.exports = router;
