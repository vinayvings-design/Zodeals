import nodemailer from "nodemailer";

const sendMail = async (
  getEmail: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: getEmail,
      subject: subject,
      html: message,
    });
  } catch (error) {
    throw error;
  }
};

export default sendMail;
