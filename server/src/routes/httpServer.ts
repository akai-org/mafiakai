import { app } from "@/app";
import http from "http";

// Create servers
export const httpServer = http.createServer(app); // Create an HTTP server
