"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface PortfolioEditDialogProps {
  portfolio: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    director_id: string | null;
    rag_status: string;
    status: string;
  };
  children: React.ReactNode; // trigger button
}

interface Member {
  id: string;
  full_name: string;
}

const RAG_STATUS_OPTIONS = ["red", "amber", "green"];
const STATUS_OPTIONS = ["active", "on_hold", "completed", "cancelled"];

export default function PortfolioEditDialog({ portfolio, children }: PortfolioEditDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(portfolio.name);
  const [code, setCode] = useState(portfolio.code);
  const [description, setDescription] = useState(portfolio.description || "");
  const [directorId, setDirectorId] = useState<string | null>(portfolio.director_id);
  const [ragStatus, setRagStatus] = useState(portfolio.rag_status);
  const [status, setStatus] = useState(portfolio.status);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    async function loadMembers() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: memberships } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", userData.user.id);
      const wsId = memberships?.[0]?.workspace_id;
      if (!wsId) return;
      const { data } = await supabase.from("workspace_members").select("profile:user_id(id, full_name)").eq("workspace_id", wsId);
      setMembers((data ?? []).map((m: any) => Array.isArray(m.profile) ? m.profile[0] : m.profile).filter(Boolean));
    }
    if (open) {
      loadMembers();
    }
  }, [open, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("portfolios")
      .update({
        name,
        code,
        description: description || null,
        director_id: directorId,
        rag_status: ragStatus,
        status,
      })
      .eq("id", portfolio.id);

    if (error) {
      toast.error("Failed to update portfolio: " + error.message);
    } else {
      toast.success("Portfolio updated successfully.");
      router.refresh();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
          <DialogDescription>
            Make changes to the portfolio here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="director" className="text-right">
              Director
            </Label>
            <Select value={directorId || ""} onValueChange={setDirectorId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a director" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ragStatus" className="text-right">
              RAG Status
            </Label>
            <Select value={ragStatus} onValueChange={setRagStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select RAG status" />
              </SelectTrigger>
              <SelectContent>
                {RAG_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="col-span-4 mt-4">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
