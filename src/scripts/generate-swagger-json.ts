import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec } from "../config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write to public directory
const publicDir = path.join(__dirname, "../../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, "swagger.json");
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log("Swagger JSON generated successfully at:", outputPath);
