import { connectDB } from "../lib/db.js";
import Contact from "../models/Contact.js";
import validator from "validator";

export default async function handler(req, res) {
  // ✅ CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, phone, message, services } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      services,
    });

    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      id: contact._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
