// src/config/instantdb.js
import { init } from "@instantdb/react";

// Initialize Instant DB with your app ID
const db = init({
  appId: "d6207e60-ecda-476b-b786-b55c8c249df7", // Replace with your Instant DB App ID
});

export default db;
