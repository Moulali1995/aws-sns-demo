const express = require('express');
var router = express.Router();
require('dotenv').config()
// aws instance
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.region
});

// sns instance
var sns = new AWS.SNS();

// aws sns iam user status
router.get('/status', (req, res) => {
  res.json({ status: 'ok', sns: sns });
});

// subscribe to recieve messages
router.post('/subscribe', (req, res) => {
  let params = {
    Protocol: 'EMAIL', // choose the protocol from EMAIL,HTTPS,HTTPS,MOBILE ETC
    TopicArn: process.env.Topic,
    Endpoint: req.body.endpoint
  };
  sns.subscribe(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

// send messages
router.post('/send', (req, res) => {
  let params = {
    Message: req.body.message,
    Subject: req.body.subject,
    TopicArn: process.env.Topic
  };

  sns.publish(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else res.send(data);;
  });
});

module.exports = router;
