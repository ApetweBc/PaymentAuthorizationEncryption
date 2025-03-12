import { app } from "./app.js";
import { createServer } from "http";

const PORT = process.env.PORT || 3001;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
