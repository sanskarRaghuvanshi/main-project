import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Opal Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Opal OTP Code',
    html: `<div style="font-family:Inter;padding:30px;background:#FFF5F7;border-radius:16px"><h1 style="color:#FF4D8B;font-family:'Playfair Display'">Opal</h1><p style="font-size:14px;color:#6B7280">Your OTP code:</p><h2 style="color:#FF4D8B;font-size:32px;letter-spacing:8px">${otp}</h2><p style="font-size:12px;color:#9CA3AF">Expires in 10 minutes</p></div>`,
  });
};

export const sendOrderConfirmation = async (email, order) => {
  await transporter.sendMail({
    from: `"Opal Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order #${order.orderNumber} Confirmed - Opal`,
    html: `<div style="font-family:Inter;padding:30px;background:#FFF5F7;border-radius:16px"><h1 style="color:#10B981;font-family:'Playfair Display'">Order Confirmed!</h1><p>Order #${order.orderNumber}</p><p>Total: ₹${order.total}</p><p>Estimated delivery: ${order.estimatedDelivery?.toDateString() || 'Soon'}</p></div>`,
  });
};
