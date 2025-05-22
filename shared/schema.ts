import { pgTable, text, serial, integer, boolean, numeric, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the customer table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Define the calculation results table
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  projectName: text("project_name").notNull(),
  inputData: json("input_data").notNull(),
  resultData: json("result_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  customerId: true,
  projectName: true,
  inputData: true,
  resultData: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

// Define the calculation input schema
export const calculationInputSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  numSites: z.number().min(1, "Number of sites must be at least 1"),
  flightFrequency: z.number().min(1, "Flight frequency must be at least 1"),
  travelCost: z.number().min(0, "Travel cost must be at least 0"),
  pilotHourly: z.number().min(0, "Pilot hourly rate must be at least 0"),
  hoursPerFlight: z.number().min(0.1, "Hours per flight must be at least 0.1"),
  equipmentCost: z.number().min(0, "Equipment cost must be at least 0"),
  platformCost: z.number().min(0, "Platform subscription must be at least 0"),
  droneBoxCost: z.number().min(0, "Drone box cost must be at least 0"),
  remoteHours: z.number().min(0.1, "Remote operator hours must be at least 0.1"),
  remoteHourly: z.number().min(0, "Remote operator hourly rate must be at least 0"),
});

export type CalculationInput = z.infer<typeof calculationInputSchema>;

// Define the calculation result schema
export const calculationResultSchema = z.object({
  // Manual costs
  annualTravelCost: z.number(),
  annualManualLaborCost: z.number(),
  annualManualTotalCost: z.number(),
  fiveYearManualCost: z.number(),
  
  // Remote costs
  totalDroneBoxCost: z.number(),
  annualDroneBoxAmortized: z.number(),
  annualRemoteLaborCost: z.number(),
  firstYearRemoteCost: z.number(),
  subsequentYearRemoteCost: z.number(),
  fiveYearRemoteCost: z.number(),
  
  // Savings and ROI
  fiveYearSavings: z.number(),
  savingsPercentage: z.number(),
  
  // Time saved
  annualManualHours: z.number(),
  annualRemoteHours: z.number(),
  annualHoursSaved: z.number(),
  fiveYearHoursSaved: z.number(),
  efficiencyGain: z.number(),
  
  // ROI timeframe
  roiTimeframe: z.number(),
  
  // Yearly costs for chart
  yearlyManualCosts: z.array(z.number()),
  yearlyRemoteCosts: z.array(z.number()),
});

export type CalculationResult = z.infer<typeof calculationResultSchema>;
