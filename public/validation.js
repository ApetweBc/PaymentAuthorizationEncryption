import { z } from "https://cdn.jsdelivr.net/npm/zod@3.22.4/+esm";

export const paymentSchema = z.object({
  email: z.string().email("Invalid email address"),
  cardType: z.enum(["Visa", "MasterCard", "Amex"], {
    required_error: "Please select a card type",
  }),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  customerAccount: z.string().min(1, "Customer account is required"),
  cardHolderName: z
    .string()
    .nonempty("Card holder name is required")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Card holder name must contain only letters and spaces"
    )
    .min(2, "Card holder name must be at least 2 characters"),
  cardNumber: z
    .string()
    .refine((num) => /^[0-9\s]+$/.test(num), {
      message: "Card number must contain only numbers and spaces",
    })
    .transform((num) => num.replace(/\s/g, "")) // Remove spaces for validation
    .refine((num) => {
      if (num.startsWith("4")) return num.length === 16; // Visa
      if (num.startsWith("5")) return num.length === 16; // MasterCard
      if (num.startsWith("3")) return num.length === 15; // Amex
      return false;
    }, "Invalid card number length for selected card type"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([2-9][0-9])$/, "Invalid expiry date (MM/YY)"),
  processPayments: z.enum(["Tuesday", "15th"], {
    required_error: "Please select a payment processing schedule",
  }),
  signature: z.string().min(2, "Signature is required"),
});
