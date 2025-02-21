import axios from "axios";


export const toChannel = async (channelId: string, reminderData: any) => {
  const channelUrl = `${process.env.TELEX_BASE_URL}/return/${channelId}`;
  await axios.post(channelUrl, reminderData);
};
