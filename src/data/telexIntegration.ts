import dotenv from "dotenv";

dotenv.config();

const appUrl = process.env.APP_URL;

export const telexIntegration = {
  data: {
    descriptions: {
      app_name: "Work Progress Reminder",
      app_description:
        "Sends scheduled reminders for work progress updates and code pushes",
      app_url: appUrl,
      app_logo: "https://jadesdev.com.ng/public/uploads/logo.png",
      background_color: "#4A90E2",
    },
    integration_category: "Communication & Collaboration",
    integration_type: "interval",
    is_active: true,
    key_features: [
      "Send reminders at specified intervals",
      "Customizable reminder messages"
    ],
    settings: [
      {
        label: "interval",
        type: "text",
        required: true,
        default: "* * * * *", // 5 PM on weekdays
        description: "When to send reminders (crontab format)",
      },
      {
        label: "reminder message",
        type: "text",
        required: true,
        default:
          "🔔 Hey team! Please share your work progress and ensure your code is pushed.",
        description: "Custom reminder message",
      },      
      {
        label: "channel id",
        type: "text",
        required: true,
        default:"",
        description: "Channel ID to send the reminder to",
      },
    ],
    tick_url: appUrl + "/telex-tick",
    target_url: appUrl + "/webhook",
  },
};
