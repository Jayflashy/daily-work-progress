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
      app_logo: "https://i.imgur.com/y193vBF.png",
      background_color: "#4A90E2",
    },
    integration_category: "Communication & Collaboration",
    integration_type: "interval",
    is_active: true,
    key_features: [
      "Send reminders at specified intervals",
      "Customizable reminder messages",
    ],
    settings: [
      {
        label: "interval",
        type: "text",
        required: true,
        default: "*/10 * * * *", // 5 PM on weekdays
        description: "When to send reminders (crontab format)",
      },
      {
        label: "username",
        type: "text",
        required: true,
        default: "Work Progress Reminder",
        description: "The username to send the reminder from",
      },
      {
        label: "event name",
        type: "text",
        required: true,
        default: "Daily Progress Check",
        description: "The name of the event to send the reminder for",
      },
      {
        label: "work days",
        type: "multi-select",
        required: true,
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday" , "Saturday", "Sunday"],
        description: "The days of the week to send the reminder for",
      },
      {
        label: "status",
        type: "dropdown",
        required: true,
        default: "success",
        options: ["success", "error"],
        description: "The status of the reminder",
      },
      {
        label: "message style",
        type: "dropdown",
        required: true,
        default: "random",
        options: ["random", "custom"],
        description: "Choose between random or custom messages",
      },
      {
        label: "reminder message",
        type: "text",
        required: false,
        default: "",
        description:
          "Custom reminder message (leave empty to use random messages)",
      },
      {
        label: "message tone",
        type: "dropdown",
        required: false,
        default: "standard",
        options: ["standard", "casual", "formal"],
        description: "Choose the tone of reminder messages for random messages",
      },
      {
        label: "notify status",
        type: "checkbox",
        required: false,
        default: false,
        description: "Notify when the reminder is successful",
      },
      {
        label: "notify webhook",
        type: "text",
        required: false,
        default: "",
        description: "Webhook URL to notify when the reminder is successful",
      },
    ],
    tick_url: appUrl + "/tick",
    target_url: "",
  },
};
