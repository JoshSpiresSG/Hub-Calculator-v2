import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerInfoFormProps {
  onCustomerInfoChange: (data: InsertCustomer) => void;
  defaultValues?: Partial<InsertCustomer>;
}

export default function CustomerInfoForm({ onCustomerInfoChange, defaultValues }: CustomerInfoFormProps) {
  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: ""
    },
  });
  
  // Use effect to send values up to parent component when they change
  useEffect(() => {
    const subscription = form.watch((value) => {
      const formValues = form.getValues();
      if (
        formValues.firstName && 
        formValues.lastName && 
        formValues.email && 
        formValues.company
      ) {
        onCustomerInfoChange(formValues as InsertCustomer);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, onCustomerInfoChange]);

  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
        
        <Form {...form}>
          <form className="space-y-4" onChange={() => {
            const formValues = form.getValues();
            if (
              formValues.firstName && 
              formValues.lastName && 
              formValues.email && 
              formValues.company
            ) {
              onCustomerInfoChange(formValues as InsertCustomer);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                // Ensure the value is always a string
                return (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+1 (555) 123-4567" 
                        {...field} 
                        value={field.value ?? ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}