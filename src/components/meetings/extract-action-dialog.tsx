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
import type { Priority } from "@/lib/types";

interface ExtractActionDialogProps {
  meetingId: string;
  projectId: string;
  workspaceId: string;
}

export function ExtractActionDialog({
  meetingId,
  projectId,
  workspaceId,
}: ExtractActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
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
  }, [isOpen, workspaceId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Action title is required.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("actions").insert({
      title,
      description: description || null,
      source_type: "meeting",
      source_meeting_id: meetingId,
      project_id: projectId,
      owner_id: ownerId,
      due_date: dueDate || null,
      priority,
      status: "open",
    });

    if (error) {
      console.error("Error creating action:", error);
      toast.error("Failed to create action.");
    } else {
      toast.success("Action created successfully.");
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setOwnerId(null);
      setDueDate("");
      setPriority("medium");
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Extract Action</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Extract Action from Meeting</DialogTitle>
          <DialogDescription>
            Create a new action linked to this meeting.
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
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right">
              Owner
            </Label>
            <Select onValueChange={setOwnerId} value={ownerId ?? ""}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an owner" />
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
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              onValueChange={(value: Priority) =>
                setPriority(value)
              }
              value={priority}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Action"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}