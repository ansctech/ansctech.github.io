const useWhatsapp = () => {
  const sendMessage = async () => {
    const apiKey = "yCkidAT4ywTybZDaOXhlDZu8XNObyoe8Kabv"; // Replace with your MessageBird API key
    const phoneNumber = "2348181130539"; // Replace with the recipient's phone number
    const message = "Hello, World!"; // Replace with the message content

    const response = fetch("https://rest.messagebird.com/messages", {
      method: "POST",
      headers: {
        Authorization: `AccessKey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: [phoneNumber],
        body: message,
      }),
    });

    // const data = await response.json();

    console.log(response.json);

    // console.log(data);

    //     axios
    //       .post(
    //         `https://rest.messagebird.com/messages`,
    //         {
    //           recipients: [phoneNumber],
    //           body: message,
    //         },
    //         {
    //           headers: {
    //             Authorization: `AccessKey ${apiKey}`,
    //           },
    //         }
    //       )
    //       .then((response) => {
    //         console.log("Message sent:", response.data);
    //       })
    //       .catch((error) => {
    //         console.error("Error sending message:", error);
    //       });
  };

  return { sendMessage };
};

export default useWhatsapp;
