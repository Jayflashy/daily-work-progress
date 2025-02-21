import { Request, Response } from "express";
import { telexIntegration } from "../data/telexIntegration";
import { TelexPayload } from "../types";
import { sendReminder } from "../services/reminderService";

export const getIntegrationFile = (req: Request, res: Response) => {
  res.json(telexIntegration);
};

export const handleTelexTick = async (req: Request, res: Response) => {
  // console.log(req.body);
  // process the request from telex
  const payload: TelexPayload = req.body;
  // quickly send a response to telex
  res.json({
    status: "success",
    message: "Tick received",
  });
  
  try {
    await sendReminder(payload);
  } catch (error) {
    console.error("Error sending reminder:", error);
  }

};

// handle the webhook from telex
export const handleTelexWebhook = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    status: "success",
    message: "Webhook received",
  });
};
