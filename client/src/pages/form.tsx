import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertSubmissionSchema, type InsertSubmission } from "@shared/schema";
import { GitBranch } from "lucide-react";

const SLOTS = [
  { id: "MON_2PM_5PM", label: "Monday 2:00 PM - 5:00 PM" },
  { id: "TUE_9AM_12PM", label: "Tuesday 9:00 AM - 12:00 PM" },
  { id: "TUE_2PM_5PM", label: "Tuesday 2:00 PM - 5:00 PM" },
  { id: "TUE_7PM_10PM", label: "Tuesday 7:00 PM - 10:00 PM" },
  { id: "THU_9AM_12PM", label: "Thursday 9:00 AM - 12:00 PM" },
  { id: "THU_2PM_5PM", label: "Thursday 2:00 PM - 5:00 PM" },
  { id: "THU_7PM_10PM", label: "Thursday 7:00 PM - 10:00 PM" },
  { id: "FRI_9AM_12PM", label: "Friday 9:00 AM - 12:00 PM" },
  { id: "FRI_2PM_5PM", label: "Friday 2:00 PM - 5:00 PM" },
  { id: "FRI_7PM_10PM", label: "Friday 7:00 PM - 10:00 PM" },
  { id: "SAT_9AM_12PM", label: "Saturday 9:00 AM - 12:00 PM" },
  { id: "SAT_2PM_5PM", label: "Saturday 2:00 PM - 5:00 PM" },
  { id: "SAT_7PM_10PM", label: "Saturday 7:00 PM - 10:00 PM" },
  { id: "SUN_9AM_12PM", label: "Sunday 9:00 AM - 12:00 PM" },
  { id: "SUN_2PM_5PM", label: "Sunday 2:00 PM - 5:00 PM" },
  { id: "SUN_7PM_10PM", label: "Sunday 7:00 PM - 10:00 PM" },
] as const;

export default function SubmissionForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      name: "",
      rollNumber: "",
      slot: "MON_2PM_5PM",
      githubUrl: "",
      feedback: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const res = await apiRequest("POST", "/api/submissions", data);
      return res.json();
    },
    onSuccess: () => {
      navigate("/success");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit form",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            Python Challenge Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SLOTS.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts about the challenge..."
                        className="resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}