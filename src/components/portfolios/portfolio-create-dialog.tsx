"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface PortfolioCreateDialogProps {
  children?: React.ReactNode;
}

export default function PortfolioCreateDialog({ children }: PortfolioCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [directorId, setDirectorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [members, setMembers] = useState<{ id: string; full_name: string | null }[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { setIsLoadingMembers(false); return; }
      const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.user.id);
      const wsId = memberships?.[0]?.workspace_id;
      if (!wsId) { setIsLoadingMembers(false); return; }
      const { data } = await supabase.from("workspace_members").select("profile:user_id(id, full_name)").eq("workspace_id", wsId);
      setMembers((data ?? []).map((m: any) => Array.isArray(m.profile) ? m.profile[0] : m.profile).filter(Boolean));
      setIsLoadingMembers(false);
    }
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !code) {
      toast.error("Name and Code are required.");
      setIsSubmitting(false);
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("User not authenticated.");
      setIsSubmitting(false);
      return;
    }

    const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", user.user.id);
    const workspaceId = memberships?.[0]?.workspace_id;

    if (!workspaceId) {
      toast.error("No workspace found.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("portfolios").insert({
      workspace_id: workspaceId,
      name,
      code,
      description: description || null,
      director_id: directorId || null,
    });

    if (error) {
      console.error("Error creating portfolio:", error);
      toast.error("Failed to create portfolio.");
    } else {
      toast.success("Portfolio created successfully!");
      setIsOpen(false);
      setName("");
      setCode("");
      setDescription("");
      setDirectorId(null);
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children || <Button><PlusCircle className="mr-2 h-4 w-4" />New Portfolio</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>
            Fill in the details for your new portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="director" className="text-right">Director</Label>
            <Select onValueChange={setDirectorId} value={directorId || ""} disabled={isLoadingMembers}>
              <SelectTrigger id="director" className="col-span-3">
                <SelectValue placeholder="Select a director" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingMembers ? (
                  <SelectItem value="" disabled>Loading members...</SelectItem>
                ) : (
                  <>
                    <SelectItem value="">None</SelectItem>
                    {members?.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>{member.full_name || member.id}</SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Portfolio"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
