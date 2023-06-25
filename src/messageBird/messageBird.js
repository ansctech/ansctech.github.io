const fs = require("fs");
const { Router } = require("express");
const messenger = require("messagebird").initClient(
  "jAt7fug7EUUuX3wLn38FRbnGp"
);
const messageBirdRouter = Router();

messageBirdRouter.post("/", (req, res) => {
  // Get your balance
  messenger.balance.read(function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });

  const params = {
    to: "+2348181130539",
    channelId: "9c3a6354-f5b3-4455-bc65-bfbbef146e38",
    type: "hsm",
    content: {
      hsm: {
        namespace: "13a04940_5330_4ddc_8227_5b74215bf5f1",
        templateName: "bill",
        language: {
          policy: "deterministic",
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                document: {
                  url: "https://drive.google.com/file/d/1VeyXPhs5bAYd07BWRX4EndHQ-2I54wcJ/view?usp=drive_link",
                },
                type: "document",
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: "Adekola",
              },
            ],
          },
        ],
      },
    },
  };

  messenger.conversations.start(params, function (err, response) {
    if (err) {
      return console.log(err);
    }
    console.log(response);
  });

  res.status(200).json({
    data: "success",
  });
});

module.exports = messageBirdRouter;
