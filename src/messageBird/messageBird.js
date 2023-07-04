require("dotenv").config({ path: "./.env" });

const axios = require("axios");
const { Router } = require("express");

const messenger = require("messagebird").initClient(
  process.env.MESSAGE_BIRD_ACCESS_TOKEN
);
const messageBirdRouter = Router();

// Get customer details and base64 format

// Program filename to be of the format bill-[customer's name]-[date of the bill]

// Upload the file to Message bird cloud

// Get the id of the file in return

// Send Message Template

messageBirdRouter.post("/", async (req, res) => {
  const { name, date, phone, pdfFile, client } = req.body;

  // Convert to a buffer
  const buffer = Buffer.from(pdfFile, "binary");

  // Get your balance
  messenger.balance.read(function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });

  // Set the request headers
  const headers = {
    Authorization: `AccessKey ${process.env.MESSAGE_BIRD_ACCESS_TOKEN}`,
    "Content-Disposition": `attachment; filename="bill-${name}-${date}"`,
    "Content-Type": "application/pdf",
  };

  // Make the POST request
  axios
    .post("https://messaging.messagebird.com/v1/files", buffer, { headers })
    .then((response) => {
      const fileId = response.data.id;

      // Prepare template
      const params = {
        to: phone,
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
                      url: `https://messaging.messagebird.com/v1/files/{${fileId}}`,
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
                    text: client.client_name_eng,
                  },
                  {
                    type: "text",
                    text: name,
                  },
                ],
              },
            ],
          },
        },
      };

      // Send message
      messenger.conversations.start(params, function (err, response) {
        if (err) {
          console.log(err);

          return res.status(500).json({
            data: "Error",
          });
        }

        res.status(200).json({
          data: "success",
        });
      });
    })
    .catch((error) => {
      console.error("Error uploading file:", error);

      res.status(500).json({
        data: "Error",
      });
    });
});

module.exports = messageBirdRouter;
