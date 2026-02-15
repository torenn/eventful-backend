import { Request, Response } from "express";
import prisma from "../config/prisma";


interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "CREATOR") {
  return res.status(403).json({ message: "Only creators can create events" });
}


    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        creatorId: req.user.userId,
      },
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getShareableLink = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId as string;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const shareUrl = `https://eventful.com/events/${eventId}`;

    return res.status(200).json({
      message: "Shareable link generated",
      shareUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
