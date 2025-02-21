import { toChannel } from "./telexService";
import {
  TelexPayload,
  NotifyWebhookPayload,
} from "../types";
import messageList from "../data/reminderMessages.json";
import axios from "axios";

// send a reminder to the channel
export async function sendReminder(payload: TelexPayload): Promise<void> {
  try {
    const settings = payload.settings;
    const getSettingValue = (label: string): string => {
      const setting = settings.find((s) => s.label === label);
      return setting ? setting.default : "";
    };
    const channelId = payload.channel_id;
    // Get configurations from settings
    const messageStyle = getSettingValue("message_style") || "random";

    const reminderMessage = getSettingValue("reminder message");
    const username = getSettingValue("username");
    const eventName = getSettingValue("event name");
    const status = getSettingValue("status");
    const messageTone = getSettingValue("message tone");
    const notifyStatus = getSettingValue("notify status");
    const notifyWebhook = getSettingValue("notify webhook");
    const workDays = getSettingValue("work days");
    const message =
      messageStyle === "random"
        ? getRandomMessage(messageTone)
        : reminderMessage;

    const reminderData = {
      message: message,
      username: username,
      event_name: eventName,
      status: status,
    };
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    // only send if the current day is in the work days array
    const isWorkDay = workDays.includes(currentDay);
    if (isWorkDay) {
      // send reminder to channel
      await toChannel(channelId, reminderData);
      // notify webhook if enabled
      const webhookData = {
        message: "Reminder sent to channel: " + channelId,
        username: "Webhook Bot",
        status: "success",
        event_name: "reminderSent",
        work_day: currentDay,
        timestamp: new Date().toISOString(),
      };
      if (notifyStatus && notifyWebhook) {
        await sendWebhook(webhookData, notifyWebhook);
      }
      console.log("Reminder sent to channel:", channelId);
    } else {
      console.log("Reminder not sent to channel: Not a work day", channelId);
    }
  } catch (error) {
    console.error("Error sending reminder:", error);
    throw error;
  }
}
// get a random message from the message list
const getRandomMessage = (tone: string): string => {
  const messages = messageList[tone as keyof typeof messageList];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex].message;
};
// send a webhook
const sendWebhook = async (
  payload: NotifyWebhookPayload,
  webhookUrl: string
) => {
  try {
    await axios.post(webhookUrl, payload);
  } catch (error) {
    console.error("Error sending webhook:", error);
    throw error;
  }
};
