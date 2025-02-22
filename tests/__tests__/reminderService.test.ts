import {
  sendReminder,
  getRandomMessage,
} from "../../src/services/reminderService";
import { toChannel } from "../../src/services/telexService";
import axios from "axios";
import { TelexPayload } from "src/types";

jest.mock("../../src/services/telexService", () => ({
  toChannel: jest.fn(),
}));

jest.mock("axios", () => ({
  post: jest.fn(),
}));
describe("Reminder Service", () => {
  const mockPayload: TelexPayload = {
    channel_id: "test-channel-id",
    return_url: "https://ping.telex.im/v1/return/xx-ac51-xx-890d-xx",
    settings: [
      {
        label: "interval",
        default: "*/2 * * * *",
        required: true,
        type: "text",
        description: "When to send reminders (crontab format)",
      },
      {
        label: "reminder message",
        default: "Custom reminder message",
        required: false,
        type: "text",
        description: "Custom reminder message",
      },
      {
        label: "username",
        default: "ReminderBot",
        required: true,
        type: "text",
        description: "The username to send the reminder from",
      },
      {
        label: "event name",
        default: "Daily Progress Check",
        required: true,
        type: "text",
        description: "The name of the event to send the reminder for",
      },
      {
        label: "status",
        default: "success",
        required: true,
        type: "dropdown",
        description: "The status of the reminder",
      },
      {
        label: "message style",
        default: "random",
        required: true,
        type: "dropdown",
        description: "Choose between random or custom messages",
      },
      {
        label: "message tone",
        default: "standard",
        required: false,
        type: "dropdown",
        description: "Choose the tone of reminder messages for random messages",
      },
      {
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        description: "The days of the week to send the reminder for",
        label: "work days",
        required: true,
        type: "multi-select",
      },
      {
        label: "notify status",
        default: true,
        required: false,
        type: "checkbox",
        description: "Notify when the reminder is successful",
      },
      {
        label: "notify webhook",
        default: "https://webhook.url",
        required: false,
        type: "text",
        description: "Webhook URL to notify when the reminder is successful",
      },
    ],
  };
  
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2025-02-21'); // A Friday
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should send a random message when message style is "random"', async () => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5);

    await sendReminder(mockPayload);

    expect(toChannel).toHaveBeenCalledWith("test-channel-id", expect.objectContaining({
        message: expect.any(String),
        username: expect.any(String),
        event_name: expect.any(String),
        status: expect.any(String),
    }));

    expect(axios.post).toHaveBeenCalledWith(
      "https://webhook.url",
      expect.anything()
    );
  });

  it('should send custom message when message style is "custom"', async () => {
    const customPayload = {
      ...mockPayload,
      settings: mockPayload.settings.map(setting => {
        if (setting.label === "message style") {
          return { ...setting, default: "custom" };
        }
        if (setting.label === "reminder message") {
          return { ...setting, default: "This is a custom message" };
        }
        return setting;
      }),
    };

    await sendReminder(customPayload);

    expect(toChannel).toHaveBeenCalledWith(
      "test-channel-id",
      expect.objectContaining({
        message: "This is a custom message",
        username: "ReminderBot",
        event_name: "Daily Progress Check",
        status: "success",
      })
    );
  });

  it('should not send reminder on non-work days', async () => {
    // Set date to Sunday
    const mockSundayDate = new Date('2025-02-24');
    jest.spyOn(global, 'Date').mockImplementation(() => mockSundayDate);

    // Create payload with monday and tuesday as work days
    const workdayPayload = {
      ...mockPayload,
      settings: mockPayload.settings.map(setting => {
        if (setting.label === "work days") {
          return {
            ...setting,
            default: ["Monday", "Tuesday"]
          };
        }
        return setting;
      }),
    };

    await sendReminder(workdayPayload);

    expect(toChannel).not.toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      "https://webhook.url",
      expect.objectContaining({
        status: "failed",
        event_name: "reminderNotSent",
        message: expect.stringContaining("Not a work day"),
        work_day: expect.any(String),
      })
    );
  });
  
  it("should notify webhook when enabled", async () => {
    await sendReminder(mockPayload);

    expect(axios.post).toHaveBeenCalledWith("https://webhook.url", expect.objectContaining({
        message: expect.any(String),
        username: expect.any(String),
        status: expect.any(String),
        event_name: expect.any(String),
        work_day: expect.any(String),
        timestamp: expect.any(String),
      }));
  });

  it('should not send webhook notification when notify status is false', async () => {
    const payloadWithoutNotify = {
      ...mockPayload,
      settings: mockPayload.settings.map(setting =>
        setting.label === "notify status"
          ? { ...setting, default: false }
          : setting
      ),
    };

    await sendReminder(payloadWithoutNotify);

    expect(axios.post).not.toHaveBeenCalled();
  });

});

describe('getRandomMessage', () => {
    it('should return a random message for given tone', () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        
        const message = getRandomMessage("standard");
        
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
    });

    it('should handle invalid tone gracefully', () => {
        expect(() => getRandomMessage("invalid_tone")).toThrow();
    });
});