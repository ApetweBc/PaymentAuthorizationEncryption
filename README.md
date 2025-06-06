#  Payment Authorization Email encryption

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd into Directory
```

3. Install dependencies:
```bash
npm install
```

## Project Structure

```
AurumPaymentAuthorizationDirect/
├── public/
│   ├── assets/         # Image files and static assets
│   ├── index.html      # Main HTML file
│   └── submit.js       # Frontend JavaScript
├── app.js             # Express server setup
├── email.js           # Email handling functionality
└── package.json       # Project dependencies
```

## Configuration

1. Create a `.env` file in the root directory:
Generate public keys using OpenPGP. You can use Kleopatra GUI
```bash
EMAIL_ACCOUNT=your-email-account
EMAIL_PASSWORD=your-email-password
EMAIL_USER=your-email
AR_PUBLIC_KEY=your-public-key
```

## Image Setup

1. Create an `assets` folder in the `public` directory:

```bash
mkdir public/assets
```

2. Place your image files in the `public/assets` directory:
  Replace placeholder links in index.html with image files

## Running the Application

1. Start the server:
```bash
npm start
```

2. Access the application:
Open your browser and navigate to `http://localhost:3000`

## Security Notes

- All sensitive data is encrypted before being sent via email
- Form submissions are protected against CSRF attacks
- Card information is handled securely
- No card data is stored on the server

## Support

For support inquiries:
- Phone: 1-1-800-000-0000
- Fax: 1-800-000-0000
