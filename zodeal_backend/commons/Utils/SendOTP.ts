import axios from "axios";

// It's better to store sensitive data in environment variables
const apiUrl: string =
  process.env.SMS_API_URL || "http://sms.a2zsms.in/api.php";
const senderId: string = process.env.SENDER_ID || "APACEH";
const apiUsername: string = process.env.API_USERNAME || "";
const apiPassword: string = process.env.API_PASSWORD || "";
const templateId: string = process.env.TEMPLATE_ID || "1707174072461721251";
const peid: string = process.env.PEID || "1701174071721340048";

interface OTPResponse {
  status: string;
  message: string;
  [key: string]: any; 
}

const sendOTP = async (
  phoneNumber: string,
  otp: string
): Promise<OTPResponse> => {
  try {
    const response: any = await axios.get(apiUrl, {
      params: {
        username: apiUsername,
        password: apiPassword,
        to: phoneNumber,
        from: senderId,
        message: `Use OTP ${otp} for Registration, Don't share to anyone. Thank you APTAPACE.`,
        PEID: peid,
        templateid: templateId,
      },
    });

    // Check if the status is 200 or success code from the API
    if (response.status === 200 && response.data) {
      console.log("Response:", response.data);
      return response.data;
    } else {
      throw new Error("Failed to send OTP. API response not successful.");
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export default sendOTP;
