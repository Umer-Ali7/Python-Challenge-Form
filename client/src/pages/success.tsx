import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Submission Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your Python challenge submission has been recorded.
          </p>
          <Button asChild>
            <Link href="/">Submit Another Response</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
