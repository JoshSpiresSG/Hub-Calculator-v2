import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculationInputSchema } from "@shared/schema";
import { calculateResults } from "../client/src/lib/calculatorUtils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculate ROI endpoint
  app.post("/api/calculate", async (req, res) => {
    try {
      // Validate input data
      const validatedData = calculationInputSchema.parse(req.body);
      
      // Calculate results
      const results = calculateResults(validatedData);
      
      // Return the results
      res.json(results);
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid input data"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
