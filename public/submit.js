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
    const month = value.slice(0, 2);
    const year = value.slice(2, 4);

    // Validate month
    if (parseInt(month) > 12) {
      value = "12" + year;
    }

    value = month + (value.length > 2 ? "/" + year : "");
  }
  input.value = value;
};

const showToast = (message, type = "success") => {
  Toastify({
    text: message,
    duration: 4000,
    className: `toast-${type}`,
    gravity: "top",
    position: "center",
    style: {
      background: type === "success" ? "#10B981" : "#EF4444",
      borderRadius: "8px",
      padding: "12px 24px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    offset: {
      y: 60,
    },
    close: true,
  }).showToast();
};

const clearErrors = (form) => {
  form.querySelectorAll(".error-message").forEach((el) => el.remove());
  form.querySelectorAll(".border-red-500").forEach((el) => {
    el.classList.remove("border-red-500");
  });
};

const showError = (input, message) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  input.classList.add("border-red-500");
  input.parentNode.appendChild(errorDiv);
};

const setLoading = (form, loading) => {
  const button = form.querySelector('button[type="submit"]');
  const spinner = form.querySelector(".spinner");
  const buttonText = button.querySelector("span");

  if (loading) {
    button.classList.add("loading");
    spinner.style.display = "inline-block";
    button.disabled = true;
    buttonText.textContent = "Submitting...";
  } else {
    button.classList.remove("loading");
    spinner.style.display = "none";
    button.disabled = false;
    buttonText.textContent = "Submit";
  }
};

const initForm = () => {
  const form = document.getElementById("payment-form");
  const cardNumberInput = form.querySelector('input[name="cardNumber"]');
  const expiryDateInput = form.querySelector('input[name="expiryDate"]');
  const cardTypeInputs = form.querySelectorAll('input[name="cardType"]');

  // Add input masking for card number
  cardNumberInput?.addEventListener("input", (e) => {
    maskCardNumber(e.target);
  });

  // Add input masking for expiry date
  expiryDateInput?.addEventListener("input", (e) => {
    formatExpiryDate(e.target);
  });

  // Update card number validation when card type changes
  cardTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (cardNumberInput) {
        cardNumberInput.value = "";
      }
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(form);
    setLoading(form, true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
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
      showToast(result.message);
      form.reset();
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        error.errors.forEach((err) => {
          const field = form.querySelector(`[name="${err.path[0]}"]`);
          if (field) {
            showError(field, err.message);
          }
        });
        showToast("Please fix the validation errors", "error");
      } else {
        showToast(error.message || "Error submitting form", "error");
      }
    } finally {
      setLoading(form, false);
    }
  });
};

document.addEventListener("DOMContentLoaded", initForm);
