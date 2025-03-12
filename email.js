import dotenv from "dotenv";
import nodemailer from "nodemailer";
import openpgp from "openpgp";

dotenv.config();

export async function encryptAndSendEmail(formData) {
  const transporter = nodemailer.createTransport({
    host: "mail.authsmtp.com",
    port: 2525,
    secure: false,
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const formttedDataText = `Payment Authorization Details:
Date: ${new Date().toISOString()}
Email: ${formData.email}
Account Name: ${formData.accountName}
Customer Account Number: ${formData.customerAccount}
Card Holder Name: ${formData.cardHolderName}
Card Number: ${formData.cardNumber}
Expiry Date: ${formData.expiryDate}
Process Payment Date: ${formData.processPayments}
Signature: ${formData.signature}`;

  const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
tQKkmiDd9nkxevhUyh2at3PN6CI=
=gXB3
-----END PGP PUBLIC KEY BLOCK-----`;

  // Parse the form data into a string

  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: formttedDataText }),
    encryptionKeys: publicKey,
  });

  // Coverting the encrypted message to a string

  // Send the encrypted message
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "francisa@aurumgroup.com",
    subject: "New Payment Authorization",
    text: encrypted,
  });
}
