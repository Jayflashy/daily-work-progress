import axios from "axios";
import { TelexPayload } from "../types";

export async function sendReminder(payload: TelexPayload): Promise<void> {
  try {
    const settings = payload.settings;
    const getSettingValue = (label: string): string => {
      const setting = settings.find((s) => s.label === label);
      return setting ? setting.default : "";
    };
    // Get the channel_id, interval, and reminder message from the settings
    const interval = getSettingValue("interval");
    const reminderMessage = getSettingValue("reminder message");
    const channelId = getSettingValue("channel id");

    const reminderData = {
        message: reminderMessage,
        username: "Work Progress Reminder",
        event_name: "Daily Progress Check",
        status: "success"
      };
    // send reminder to channel
    const channelUrl = `${process.env.TELEX_BASE_URL}/return/${channelId}`;
    await axios.post(channelUrl, reminderData);
    console.log("Reminder sent to channel:", channelId);
    
  } catch (error) {
    console.error("Error sending reminder:", error);
    throw error;
  }
}
