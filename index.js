import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import ConnectDB from "./config/DB.js";
import "./service/cron.js";

const PORT = process.env.PORT || 5000;

ConnectDB(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server start failed:", error.message);
  });