import { Request, Response } from "express";
import prisma from "../config/prisma";
import axios from "axios";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const initializePayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { ticketId, amount } = req.body;

    if (!ticketId || !amount) {
      return res.status(400).json({ message: "Ticket ID and amount required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { user: true },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: ticket.user.email,
        amount: amount * 100,
        reference: `ref_${Date.now()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentRef = response.data.data.reference;

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        amount,
        paymentRef,
        paymentStatus: "INITIALIZED",
      },
    });

    return res.status(200).json({
      paymentUrl: response.data.data.authorization_url,
      reference: paymentRef,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};
