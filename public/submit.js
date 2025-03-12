import { paymentSchema } from "./validation.js";

const maskCardNumber = (input) => {
  const cardType = document.querySelector(
    'input[name="cardType"]:checked'
  )?.value;
  let maxLength = 16;

  if (cardType === "Amex") {
    maxLength = 15;
  }

  let value = input.value.replace(/\D/g, "");
  value = value.slice(0, maxLength);

  if (cardType === "Amex") {
    value = value.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
  } else {
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  input.value = value;
};

const formatExpiryDate = (input) => {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  input.value = value;
};

const initForm = () => {
  const form = document.getElementById("payment-form");
  const cardNumberInput = form.querySelector('input[name="cardNumber"]');
  const expiryDateInput = form.querySelector('input[name="expiryDate"]');
  const cardTypeInputs = form.querySelectorAll('input[name="cardType"]');

  // Add input masking for card number
  cardNumberInput.addEventListener("input", (e) => {
    maskCardNumber(e.target);
  });

  // Add input masking for expiry date
  expiryDateInput.addEventListener("input", (e) => {
    formatExpiryDate(e.target);
  });

  // Update card number validation when card type changes
  cardTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      cardNumberInput.value = "";
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // Validate the form data
      const validatedData = paymentSchema.parse(data);

      const response = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      alert(result.message);
      form.reset();
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        const errorMessages = error.errors.map((err) => err.message).join("\n");
        alert(errorMessages);
      } else {
        alert(error.message || "Error submitting form. Please try again.");
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", initForm);
