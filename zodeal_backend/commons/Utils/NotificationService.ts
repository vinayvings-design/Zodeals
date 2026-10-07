import admin from "./Firebase";

// Define a custom notification type that includes the 'image' property
interface CustomNotification extends admin.messaging.Notification {
  image?: string; // Optional property for the image URL
}

const sendNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  image: string | null = null
): Promise<void> => {
  try {
    const message: admin.messaging.Message = {
      token: deviceToken,
      notification: {
        title,
        body,
      } as CustomNotification, // Cast the notification to our custom type
    };

    // // Add the image property if it's provided
    // if (image) {
    //   message.notification.image = image;
    // }

    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export { sendNotification };
