const amqplib = require("amqplib/callback_api");

const urlServerRabbitMQ = "amqp://ale:ale123@ec2-3-83-91-51.compute-1.amazonaws.com/";
const endpoint = "http://localhost:8081/payments/";


const queue = "Pedido";

amqplib.connect(urlServerRabbitMQ, function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: true,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
    channel.consume(
      queue,
      async function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
         try {
           const headers = {
             "Content-Type": "application/json",
           };
           const req = {
            method: "POST",
             body: msg.content.toString(),
             headers,
           };
           const result = await fetch(
             endpoint,
             req
           );
    
           const data = await result.json();
           console.log(data);
           console.log(JSON.parse(msg.content.toString()));
         } catch (error) {
           console.log(error);
         }
      },
      {
        noAck: true,
      }
    );
  });
});