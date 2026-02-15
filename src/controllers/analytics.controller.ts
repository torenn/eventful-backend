import { Request, Response } from "express";
import prisma from "../config/prisma";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Total tickets for a specific event
export const getEventTicketCount = async (req: Request, res: Response) => { const eventId = req.params.eventId as string;

const total = await prisma.ticket.count({
  where: { eventId },
});

const scanned = await prisma.ticket.count({
  where: {
    eventId,
    status: "SCANNED",
  },
});

return res.status(200).json({
  eventId,
  totalTickets: total,
  scannedTickets: scanned,
  pendingTickets: total - scanned,
});

  try {
    const eventId = req.params.eventId as string;


    const count = await prisma.ticket.count({
      where: {
        eventId,
      },
    });

    return res.status(200).json({
      eventId,
      totalTickets: count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Total tickets across all events created by a creator
export const getCreatorAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "CREATOR") {
      return res.status(403).json({ message: "Only creators can view analytics" });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        event: {
          creatorId: req.user.userId,
        },
      },
    });

    return res.status(200).json({
      totalTicketsSold: tickets.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
