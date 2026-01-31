"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Workspace, WorkspaceMember, WorkspaceRole, Profile } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface MemberWithProfile extends WorkspaceMember {
  profile: Profile;
}

interface SettingsPanelProps {
  workspace: Workspace & { member_count: number };
  members: MemberWithProfile[];
  isAdmin: boolean;
  currentUserId: string;
}

export default function SettingsPanel({ workspace, members, isAdmin, currentUserId }: SettingsPanelProps) {
  const router = useRouter();
  const [generalEdit, setGeneralEdit] = useState({
    name: workspace.name,
    description: workspace.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("member");
  const [error, setError] = useState<string | null>(null);
  const [profileEdit, setProfileEdit] = useState({
    displayName: members.find((m) => m.user_id === currentUserId)?.profile?.full_name || "",
    avatarUrl: members.find((m) => m.user_id === currentUserId)?.profile?.avatar_url || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // General tab update
  async function handleGeneralSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      await supabase.from("workspaces").update({
        name: generalEdit.name,
        description: generalEdit.description,
      }).eq("id", workspace.id);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  // Member invite
  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      // Call inviting server action
      await fetch("/api/settings/invite-member", {
        method: "POST",
        body: JSON.stringify({ workspaceId: workspace.id, email: inviteEmail, role: inviteRole }),
        headers: { "Content-Type": "application/json" },
      }).then(res => {
        if (!res.ok) throw new Error("Could not invite member");
      });
      setInviteEmail("");
      setInviteRole("member");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  // Role update
  async function handleRoleChange(memberId: string, role: WorkspaceRole) {
    setSaving(true);
    setError(null);
    try {
      await fetch("/api/settings/update-member-role", {
        method: "POST",
        body: JSON.stringify({ memberId, role }),
        headers: { "Content-Type": "application/json" },
      });
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  // Remove member
  async function handleRemoveMember(memberId: string) {
    if (!window.confirm("Remove this member? This cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      await fetch("/api/settings/remove-member", {
        method: "POST",
        body: JSON.stringify({ memberId }),
        headers: { "Content-Type": "application/json" },
      });
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  // Profile update
  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setError(null);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      await supabase.from("profiles").update({
        full_name: profileEdit.displayName,
        avatar_url: profileEdit.avatarUrl,
      }).eq("id", currentUserId);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    }
    setProfileSaving(false);
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card className="bg-gray-950 border-emerald-700">
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Workspace settings and info.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGeneralSave} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={generalEdit.name} onChange={e => setGeneralEdit({ ...generalEdit, name: e.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={generalEdit.description} onChange={e => setGeneralEdit({ ...generalEdit, description: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={workspace.slug} readOnly className="bg-gray-800 text-gray-400" />
              </div>
              <Button type="submit" disabled={saving} className="bg-emerald-700">{saving ? "Saving..." : "Save"}</Button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="members">
        <Card className="bg-gray-950 border-emerald-700">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {isAdmin ? "Manage workspace members." : <span className="text-yellow-600">(Requires admin)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAdmin && (
              <form onSubmit={handleInvite} className="flex gap-2 items-end mb-6">
                <div className="flex-1">
                  <Label>Email</Label>
                  <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" required disabled={saving} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as WorkspaceRole)}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={saving} className="bg-emerald-700">Invite</Button>
              </form>
            )}
            <Separator className="my-4" />
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-2 py-2 bg-gray-900 rounded">
                  <div className="flex items-center gap-3">
                    {m.profile.avatar_url && <img src={m.profile.avatar_url ?? ""} alt={m.profile.full_name ?? ""} className="w-9 h-9 rounded-full" />}
                    <div>
                      <div className="font-medium">{m.profile.full_name ?? ""}</div>
                      <div className="text-xs text-gray-400">{m.profile.email ?? ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={m.role === "admin" ? "default" : "outline"} className={m.role === "admin" ? "bg-emerald-700" : undefined}>
                      {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                    </Badge>
                    {isAdmin && m.user_id !== currentUserId && (
                      <Select
                        value={m.role}
                        onValueChange={(v) => handleRoleChange(m.id, v as WorkspaceRole)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {isAdmin && m.user_id !== currentUserId && (
                      <Button
                        variant="destructive"
                        className="ml-2 bg-red-700 hover:bg-red-800"
                        onClick={() => handleRemoveMember(m.id)}
                        disabled={saving}
                      >
                        Remove
                      </Button>
                    )}
                    {m.user_id === currentUserId && (
                      <span className="text-xs text-gray-500">(You)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="profile">
        <Card className="bg-gray-950 border-emerald-700">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Personalise your display name and avatar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <Label>Display Name</Label>
                <Input value={profileEdit.displayName} onChange={e => setProfileEdit({ ...profileEdit, displayName: e.target.value })} required />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input value={profileEdit.avatarUrl} onChange={e => setProfileEdit({ ...profileEdit, avatarUrl: e.target.value })} />
              </div>
              <Button type="submit" disabled={profileSaving} className="bg-emerald-700">{profileSaving ? "Saving..." : "Save"}</Button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
