"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RaciEntityType, RaciRole } from '@/lib/types/raci';
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface RaciAddDialogProps {
  workspaceId: string;
  projectId: string;
  existingEntities: { type: RaciEntityType; id: string; name: string }[];
}

export function RaciAddDialog({ workspaceId, projectId, existingEntities }: RaciAddDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deliverableName, setDeliverableName] = useState("");
  const [entityType, setEntityType] = useState<RaciEntityType>("deliverable");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (entityType === "deliverable" && deliverableName.trim() === "") {
      toast.error("Deliverable name cannot be empty.");
      return;
    }

    if (entityType !== "deliverable" && !selectedEntityId) {
      toast.error(`Please select an existing ${entityType}.`);
      return;
    }

    try {
      // For custom deliverables, we create a dummy assignment to get it into the matrix
      // For existing entities, we don't create an assignment here, just trigger refresh
      if (entityType === "deliverable") {
        const { error } = await supabase.from("raci_assignments").insert({
          workspace_id: workspaceId,
          project_id: projectId,
          entity_type: "deliverable",
          deliverable_name: deliverableName.trim(),
          // Assign to current user as Responsible by default for newly added deliverables
          user_id: (await supabase.auth.getUser()).data.user?.id || "", 
          role: "responsible", 
        });

        if (error) throw error;
        toast.success("Custom deliverable added to matrix.");
      } else if (selectedEntityId) {
        // If an existing entity is selected, we don't create an assignment here.
        // The user will add assignments by clicking cells in the matrix.
        // We just need to ensure the entity is visible in the matrix if it wasn't already.
        // This is handled by fetching all related entities in page.tsx
        toast.success(`Entity of type ${entityType} selected for matrix view.`);
      }

      setDeliverableName("");
      setEntityType("deliverable");
      setSelectedEntityId(null);
      setIsOpen(false);
      router.refresh(); // Re-fetch data on success
    } catch (error: any) {
      console.error("Error adding RACI assignment/deliverable:", error);
      toast.error(`Failed to add: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Assignment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add RACI Assignment</DialogTitle>
          <DialogDescription>
            Add a new custom deliverable or select an existing entity to appear in the matrix.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entityType" className="text-right">Entity Type</Label>
            <Select onValueChange={(value) => {
              setEntityType(value as RaciEntityType);
              setSelectedEntityId(null); // Reset selected entity when type changes
            }} defaultValue={entityType}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select entity type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="deliverable">Custom Deliverable</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="raid_item">RAID Item</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {entityType === "deliverable" ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliverableName" className="text-right">Deliverable Name</Label>
              <Input
                id="deliverableName"
                value={deliverableName}
                onChange={(e) => setDeliverableName(e.target.value)}
                className="col-span-3"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entityPicker" className="text-right">Select {entityType.replace('_', ' ')}</Label>
              <Select onValueChange={setSelectedEntityId} value={selectedEntityId || ""}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder={`Select an existing ${entityType.replace('_', ' ')}`} /></SelectTrigger>
                <SelectContent>
                  {existingEntities
                    .filter(e => e.type === entityType)
                    .map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="submit" onClick={handleSubmit}>Add to Matrix</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
