// src/config/dotenv.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Needed to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"), // points to your project root
});

console.log("✅ .env loaded");
