"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ProgrammeCreateDialogProps {
  workspaceId: string;
}

interface Profile {
  id: string;
  full_name: string | null;
}

export default function ProgrammeCreateDialog({ workspaceId }: ProgrammeCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [sroId, setSroId] = useState<string | null>(null);
  const [programmeManagerId, setProgrammeManagerId] = useState<string | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient(); // Browser Supabase client

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaceMembers();
    }
  }, [isOpen]);

  const fetchWorkspaceMembers = async () => {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('profile:profile_id(id, full_name)')
      .eq('workspace_id', workspaceId);

    if (error) {
      console.error('Error fetching workspace members:', error);
      toast.error('Failed to load workspace members.');
      setMembers([]);
    } else {
      setMembers(data.map((m: any) => m.profile).filter((p: any) => p !== null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !code) {
      toast.error('Programme name and code are required.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('programmes')
      .insert({
        workspace_id: workspaceId,
        name,
        code,
        description: description || null,
        sro_id: sroId,
        programme_manager_id: programmeManagerId,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating programme:', error);
      toast.error(`Failed to create programme: ${error.message}`);
    } else {
      toast.success('Programme created successfully!');
      setIsOpen(false);
      setName('');
      setCode('');
      setDescription('');
      setSroId(null);
      setProgrammeManagerId(null);
      router.refresh(); // Refresh the programmes list page
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>New Programme</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Programme</DialogTitle>
          <DialogDescription>
            Fill in the details for your new programme.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Programme Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Programme Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sro">Senior Responsible Owner (SRO)</Label>
            <Select onValueChange={setSroId} value={sroId || ''}>
              <SelectTrigger id="sro">
                <SelectValue placeholder="Select SRO" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name || member.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="programmeManager">Programme Manager</Label>
            <Select onValueChange={setProgrammeManagerId} value={programmeManagerId || ''}>
              <SelectTrigger id="programmeManager">
                <SelectValue placeholder="Select Programme Manager" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name || member.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Programme'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
