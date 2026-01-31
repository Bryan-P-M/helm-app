"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
// no extra types needed

interface ExtractDecisionDialogProps {
  meetingId: string;
  projectId: string;
  workspaceId: string;
  meetingDate: string; // YYYY-MM-DD format
}

export function ExtractDecisionDialog({
  meetingId,
  projectId,
  workspaceId,
  meetingDate,
}: ExtractDecisionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rationale, setRationale] = useState("");
  const [madeById, setMadeById] = useState<string | null>(null);
  const [decidedAt, setDecidedAt] = useState(meetingDate);
  const [members, setMembers] = useState<{ id: string; full_name: string | null }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen && workspaceId) {
      const fetchMembers = async () => {
        const { data, error } = await supabase
          .from("members")
          .select("id, full_name")
          .eq("workspace_id", workspaceId);

        if (error) {
          console.error("Error fetching workspace members:", error);
          toast.error("Failed to load workspace members.");
        } else {
          setMembers(data as { id: string; full_name: string | null }[] ?? []);
        }
      };
      fetchMembers();
    }
    if (isOpen) {
      setDecidedAt(meetingDate); // Reset date when dialog opens
    }
  }, [isOpen, workspaceId, meetingDate, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Decision title is required.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("decisions").insert({
      title,
      rationale: rationale || null,
      meeting_id: meetingId,
      project_id: projectId,
      made_by_id: madeById,
      decided_at: decidedAt,
      status: "final", // Default status for decisions
    });

    if (error) {
      console.error("Error creating decision:", error);
      toast.error("Failed to create decision.");
    } else {
      toast.success("Decision created successfully.");
      setIsOpen(false);
      setTitle("");
      setRationale("");
      setMadeById(null);
      setDecidedAt(meetingDate); // Reset to meeting date
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Extract Decision</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extract Decision from Meeting</DialogTitle>
          <DialogDescription>
            Create a new decision linked to this meeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rationale" className="text-right">
              Rationale
            </Label>
            <Textarea
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="col-span-3 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="madeBy" className="text-right">
              Made By
            </Label>
            <Select onValueChange={setMadeById} value={madeById ?? ""}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select who made the decision" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="decidedAt" className="text-right">
              Decided At
            </Label>
            <Input
              id="decidedAt"
              type="date"
              value={decidedAt}
              onChange={(e) => setDecidedAt(e.target.value)}
              className="col-span-3"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Decision"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}