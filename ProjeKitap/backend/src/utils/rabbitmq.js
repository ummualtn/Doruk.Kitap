// RabbitMQ bağlantısı ve mesaj gönderme/okuma fonksiyonları
import amqplib from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel = null;
let connection = null;

export async function connectRabbitMQ() {
  if (channel) return channel;
  connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

export async function sendOrderCreated(orderData) {
  const ch = await connectRabbitMQ();
  const queue = 'order_created';
  await ch.assertQueue(queue, { durable: false });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)));
}

// Basit consumer örneği (bildirim/fatura)
export async function startOrderConsumer() {
  const ch = await connectRabbitMQ();
  const queue = 'order_created';
  await ch.assertQueue(queue, { durable: false });
  ch.consume(queue, (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log('[RabbitMQ] Yeni sipariş bildirimi:', order);
      // Burada bildirim/fatura işlemleri yapılabilir
      ch.ack(msg);
    }
  });
}
