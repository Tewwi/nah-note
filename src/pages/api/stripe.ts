/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import moment from "moment";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.WEBHOOK_SECRET as string;

// Make sure to add this, otherwise you will get a stream.not.readable error
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(405).send("Only POST requests allowed");

    const sig: any = req.headers["stripe-signature"];
    const rawBody = await getRawBody(req);

    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("event.type", JSON.stringify(event.type));

    if (event.type === "checkout.session.completed") {
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        (event.data.object as any).id,
        {
          expand: ["line_items"],
        }
      );
      const lineItems = sessionWithLineItems.line_items;

      if (!lineItems) return res.status(500).send("Internal Server Error");

      try {
        // Save the data, change customer account info, etc
        const customerEmail = (event.data.object as any).customer_details
          .email as string;
        const date = moment.unix((event.data.object as any).created).toDate();

        await prisma.user.update({
          where: {
            email: customerEmail,
          },
          data: {
            isPremium: true,
            getPremiumDate: date,
          },
        });
      } catch (error) {
        console.log("Handling when you're unable to save an order");
      }
    }

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
}
