import axios from "axios";


export const toChannel = async (channelId: string, reminderData: any) => {
  if (!channelId) {
    throw new Error("Invalid channel ID");
  }
  try {
    const channelUrl = `${process.env.TELEX_BASE_URL}/return/${channelId}`;
    await axios.post(channelUrl, reminderData);
  } catch (error) {
    throw new Error(`Failed to send message to channel: API Error ${error}`);
  }
};
