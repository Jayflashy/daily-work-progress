import request from "supertest";
import app from "../../src/index";
import { sendReminder } from "../../src/services/reminderService";
import { TelexPayload } from "../../src/types";

// Mock the sendReminder service
jest.mock("../../src/services/reminderService");

describe("Integration Routes - Tick Endpoint", () => {
  const mockTelexPayload: TelexPayload =  {
    channel_id: "xxxxx-xxx-xxx-xxx-xxxxx0",
    return_url: "https://ping.telex.im/v1/return/xx-ac51-xx-890d-xx",
    settings: [
      {
        default: "*/10 * * * *",
        description: "When to send reminders (crontab format)",
        label: "interval",
        required: true,
        type: "text",
      },
      {
        default: "Work Progress Reminder",
        description: "The username to send the reminder from",
        label: "username",
        required: true,
        type: "text",
      },
      {
        default: "Daily Progress Check",
        description: "The name of the event to send the reminder for",
        label: "event name",
        required: true,
        type: "text",
      },
      {
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        description: "The days of the week to send the reminder for",
        label: "work days",
        required: true,
        type: "multi-select",
      },
      {
        default: "success",
        description: "The status of the reminder",
        label: "status",
        options: ["success", "pending", "failed"],
        required: true,
        type: "dropdown",
      },
      {
        default: "random",
        description: "Choose between random or custom messages",
        label: "message style",
        options: ["random", "custom"],
        required: true,
        type: "dropdown",
      },
      {
        default: "",
        description: "Custom reminder message (leave empty to use random messages)",
        label: "reminder message",
        required: false,
        type: "text",
      },
      {
        default: "standard",
        description: "Choose the tone of reminder messages for random messages",
        label: "message tone",
        options: ["standard", "formal", "fun"],
        required: false,
        type: "dropdown",
      },
      {
        default: true,
        description: "Notify when the reminder is successful",
        label: "notify status",
        required: false,
        type: "checkbox",
      },
      {
        default: "https://ping.telex.im/v1/webhooks/xx-ca58-x-a45a-xx",
        description: "Webhook URL to notify when the reminder is successful",
        label: "notify webhook",
        required: false,
        type: "text",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test the tick endpoint
  it("should respond with 200 status and success message when tick is received", async () => {
    // Send POST request to /tick with mock payload
    const response = await request(app).post("/tick").send(mockTelexPayload);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Tick received");
  });

  // test the sendReminder service  
  it("should call sendReminder service with correct payload", async () => {
    // Send POST request to /tick with mock payload
    await request(app).post("/tick").send(mockTelexPayload);

    // Ensure sendReminder was called with correct payload
    expect(sendReminder).toHaveBeenCalledTimes(1);
    expect(sendReminder).toHaveBeenCalledWith(mockTelexPayload);
  });
  // test the error handling
  it("should handle errors thrown by sendReminder service", async () => {
    // Make the sendReminder service throw an error
    (sendReminder as jest.Mock).mockRejectedValueOnce(
      new Error("Service Error")
    );

    // Send POST request to /tick
    const response = await request(app).post("/tick").send(mockTelexPayload);

    // Assertions
    expect(response.status).toBe(200); // Even if error occurs, telex receives success
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Tick received");

    // Ensure sendReminder was called and threw an error
    expect(sendReminder).toHaveBeenCalledTimes(1);
  });
});
