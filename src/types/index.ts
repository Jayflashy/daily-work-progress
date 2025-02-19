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
