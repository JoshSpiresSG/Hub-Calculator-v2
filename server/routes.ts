import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculationInputSchema, insertCustomerSchema } from "@shared/schema";
import { calculateResults } from "../client/src/lib/calculatorUtils";
import { z } from "zod";

// Define a combined schema for customer info and calculation inputs
const customerCalculationSchema = z.object({
  customer: insertCustomerSchema,
  calculation: calculationInputSchema
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculate ROI endpoint (without saving)
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

  // Submit calculation with customer info endpoint
  app.post("/api/submit", async (req, res) => {
    try {
      // Validate input data
      const { customer, calculation } = customerCalculationSchema.parse(req.body);
      
      // Check if customer already exists
      let existingCustomer = await storage.getCustomerByEmail(customer.email);
      let customerId;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const newCustomer = await storage.createCustomer(customer);
        customerId = newCustomer.id;
      }
      
      // Calculate results
      const results = calculateResults(calculation);
      
      // Save calculation results to database
      const savedCalculation = await storage.createCalculation({
        customerId,
        projectName: calculation.projectName || "Untitled Calculation",
        inputData: calculation,
        resultData: results
      });
      
      // Return the results with customer ID
      res.json({
        customerId,
        calculationId: savedCalculation.id,
        results
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid input data"
      });
    }
  });

  // Get calculations for a customer
  app.get("/api/customers/:customerId/calculations", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }
      
      const calculations = await storage.getCalculationsByCustomerId(customerId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Server error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
