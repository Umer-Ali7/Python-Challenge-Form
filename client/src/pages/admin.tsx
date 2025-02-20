import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import type { Submission } from "@shared/schema";

export default function AdminPage() {
  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Python Challenge Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>GitHub URL</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.rollNumber}</TableCell>
                  <TableCell>{submission.slot}</TableCell>
                  <TableCell>
                    <a 
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {submission.githubUrl}
                    </a>
                  </TableCell>
                  <TableCell>{submission.feedback || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
