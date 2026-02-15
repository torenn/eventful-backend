
import QRCode from "qrcode";
import { Request, Response } from "express";
import prisma from "../config/prisma";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "EVENTEE") {
      return res.status(403).json({ message: "Only eventees can buy tickets" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if ticket already exists
const existingTicket = await prisma.ticket.findFirst({
  where: {
    userId: req.user!.userId,
    eventId,
  },
});

if (existingTicket) {
  return res.status(400).json({
    message: "You have already purchased a ticket for this event",
  });
}


    // Create a temporary unique string for QR
const qrData = `${req.user.userId}-${eventId}-${Date.now()}`;

// Generate QR as base64 image
const qrCodeImage = await QRCode.toDataURL(qrData);

const ticket = await prisma.ticket.create({
  data: {
    userId: req.user.userId,
    eventId,
    status: "CONFIRMED",
    qrCode: qrCodeImage,
  },
});


    return res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const scanTicket = async (req: AuthRequest, res: Response) => {
  try {
    const ticketId = req.params.ticketId as string;


    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "CREATOR") {
      return res.status(403).json({ message: "Only creators can scan tickets" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "SCANNED") {
      return res.status(400).json({ message: "Ticket already scanned" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "SCANNED",
      },
    });

    return res.status(200).json({
      message: "Ticket scanned successfully",
      updatedTicket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

