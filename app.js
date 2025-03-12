import { dirname, join } from "path";

import { encryptAndSendEmail } from "./email.js";
import express from "express";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// Routes
app.post("/submit", async (req, res) => {
  try {
    await encryptAndSendEmail(req.body);
    res.json({ message: "Form submitted successfully!" });
    console.log(res.json);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error submitting form" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

export { app };
