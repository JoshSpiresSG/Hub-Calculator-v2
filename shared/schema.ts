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

// Define the simplified calculation input schema
export const calculationInputSchema = z.object({
  // Project Information
  projectName: z.string().optional(),
  
  // Simplified inputs
  annualSalary: z.number().min(0, "Annual salary must be at least 0"),
  airtimeHours: z.number().min(0, "Airtime hours must be at least 0"),
  operationHours: z.number().min(0, "Operation hours must be at least 0"),
});

export type CalculationInput = z.infer<typeof calculationInputSchema>;

// Define the calculation result schema
export const calculationResultSchema = z.object({
  // Manual costs
  annualTravelCost: z.number(),
  annualManualLaborCost: z.number(),
  annualManualTotalCost: z.number(),
  
  // Remote costs
  totalDroneBoxCost: z.number(),
  hubIdleCost: z.number(),
  hubtCost: z.number(),
  hubtIdleCost: z.number(),
  annualDroneBoxAmortized: z.number(),
  annualRemoteLaborCost: z.number(),
  annualSphereBackedCost: z.number(),
  sphereHourlyRate: z.number(),
  firstYearRemoteCost: z.number(),
  subsequentYearRemoteCost: z.number(),
  
  // Savings and ROI
  annualSavings: z.number(),
  
  // Time saved
  annualManualHours: z.number(),
  annualRemoteHours: z.number(),
  annualHoursSaved: z.number(),
  efficiencyGain: z.number(),
  
  // Operational efficiency
  operationalEfficiency: z.number(),
  
  // ROI timeframe
  roiTimeframe: z.number(),
});

export type CalculationResult = z.infer<typeof calculationResultSchema>;
