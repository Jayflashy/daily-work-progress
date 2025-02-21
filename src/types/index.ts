export interface TelexPayload {
  channel_id: string;
  return_url: string;
  settings: Setting[];
}

export interface Setting {
  label: string;
  value: string;
  default: string;
  required: boolean;
}


export interface ReminderMessage {
  id: number;
  message: string;
}

export interface ReminderMessageCollection   {
  casual: ReminderMessage[];
  standard: ReminderMessage[];
  formal: ReminderMessage[];
}

export interface NotifyWebhookPayload {
  message: string;
  username: string;
  status: string;
  event_name: string;
  timestamp: string;
}
