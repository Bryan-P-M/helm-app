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

interface ProgrammeEditDialogProps {
  programme: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    sro_id: string | null;
    programme_manager_id: string | null;
    rag_status: string;
    status: string;
  };
  children: React.ReactNode;
}

interface Member {
  id: string;
  full_name: string;
}

const RAG_STATUS_OPTIONS = ["red", "amber", "green"];
const STATUS_OPTIONS = ["active", "on_hold", "completed", "cancelled"];

export default function ProgrammeEditDialog({ programme, children }: ProgrammeEditDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(programme.name);
  const [code, setCode] = useState(programme.code);
  const [description, setDescription] = useState(programme.description || "");
  const [sroId, setSroId] = useState<string | null>(programme.sro_id);
  const [programmeManagerId, setProgrammeManagerId] = useState<string | null>(programme.programme_manager_id);
  const [ragStatus, setRagStatus] = useState(programme.rag_status);
  const [status, setStatus] = useState(programme.status);
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
      .from("programmes")
      .update({
        name,
        code,
        description: description || null,
        sro_id: sroId,
        programme_manager_id: programmeManagerId,
        rag_status: ragStatus,
        status,
      })
      .eq("id", programme.id);

    if (error) {
      toast.error("Failed to update programme: " + error.message);
    } else {
      toast.success("Programme updated successfully.");
      router.refresh();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Programme</DialogTitle>
          <DialogDescription>
            Make changes to the programme here. Click save when you're done.
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
            <Label htmlFor="sro" className="text-right">
              SRO
            </Label>
            <Select value={sroId || ""} onValueChange={setSroId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an SRO" />
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
            <Label htmlFor="programmeManager" className="text-right">
              Programme Manager
            </Label>
            <Select value={programmeManagerId || ""} onValueChange={setProgrammeManagerId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a Programme Manager" />
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
