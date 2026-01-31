"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RaciAssignmentWithProfile, RaciMatrixRow, RaciEntityType, RaciRole } from '@/lib/types/raci';
import { WorkspaceMember } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface RaciMatrixProps {
  matrixRows: RaciMatrixRow[];
  members: { id: string; full_name: string | null }[];
  workspaceId: string;
  projectId: string;
  allEntities: { type: RaciEntityType; id: string; name: string }[];
}

const roleColors: Record<RaciRole, string> = {
  responsible: "bg-blue-500 hover:bg-blue-600",
  accountable: "bg-red-500 hover:bg-red-600",
  consulted: "bg-amber-500 hover:bg-amber-600",
  informed: "bg-gray-500 hover:bg-gray-600",
};

const nextRole: Record<RaciRole | "", RaciRole | ""> = {
  "": "responsible",
  responsible: "accountable",
  accountable: "consulted",
  consulted: "informed",
  informed: "",
};

export function RaciMatrix({ matrixRows, members, workspaceId, projectId, allEntities }: RaciMatrixProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleCellClick = async (
    entityType: RaciEntityType,
    entityId: string | null,
    deliverableName: string | null,
    userId: string,
    currentRoles: RaciRole[]
  ) => {
    const currentRole = currentRoles.length > 0 ? currentRoles[0] : ""; // Assuming single role per user for now for cycling
    const newRole = nextRole[currentRole];

    try {
      if (newRole === "") {
        // Delete assignment
        const { error } = await supabase
          .from("raci_assignments")
          .delete()
          .eq("workspace_id", workspaceId)
          .eq("project_id", projectId)
          .eq("entity_type", entityType)
          .eq("user_id", userId)
          .or(entityId ? `entity_id.eq.${entityId}` : `deliverable_name.eq.${deliverableName}`);

        if (error) throw error;
        toast.success("RACI assignment removed.");
      } else if (currentRole === "") {
        // Create new assignment
        const { error } = await supabase.from("raci_assignments").insert({
          workspace_id: workspaceId,
          project_id: projectId,
          entity_type: entityType,
          entity_id: entityId,
          deliverable_name: deliverableName,
          user_id: userId,
          role: newRole,
        });

        if (error) throw error;
        toast.success("RACI assignment created.");
      } else {
        // Update existing assignment
        const { error } = await supabase
          .from("raci_assignments")
          .update({ role: newRole })
          .eq("workspace_id", workspaceId)
          .eq("project_id", projectId)
          .eq("entity_type", entityType)
          .eq("user_id", userId)
          .or(entityId ? `entity_id.eq.${entityId}` : `deliverable_name.eq.${deliverableName}`);

        if (error) throw error;
        toast.success("RACI assignment updated.");
      }

      router.refresh(); // Re-fetch data on success
    } catch (error: any) {
      console.error("Error updating RACI assignment:", error);
      toast.error(`Failed to update RACI assignment: ${error.message}`);
    }
  };

  const groupedRows: Record<string, RaciMatrixRow[]> = {
    action: [],
    raid_item: [],
    decision: [],
    deliverable: [],
  };

  matrixRows.forEach(row => {
    groupedRows[row.entity_type]?.push(row);
  });

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background z-10">Entity</TableHead>
          {members.map((member) => (
            <TableHead key={member.id} className="text-center">
              {member.full_name || "Unknown Member"}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {(Object.keys(groupedRows) as (RaciEntityType | 'Custom Deliverable')[])
          .filter(type => groupedRows[type].length > 0)
          .map(entityTypeGroup => (
            <React.Fragment key={entityTypeGroup}>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableCell colSpan={members.length + 1} className="font-bold">
                  {entityTypeGroup === 'raid_item' ? 'RAID Items' : entityTypeGroup.charAt(0).toUpperCase() + entityTypeGroup.slice(1).replace('_', ' ') + 's'}
                </TableCell>
              </TableRow>
              {groupedRows[entityTypeGroup]
                .sort((a, b) => a.entity_name.localeCompare(b.entity_name))
                .map((row) => {
                // Determine if it's a custom deliverable or a linked entity
                const isCustomDeliverable = row.entity_type === 'deliverable' && !row.entity_id;
                const deliverableName = isCustomDeliverable ? row.entity_name : null;

                return (
                  <TableRow key={`${row.entity_type}-${row.entity_id || row.entity_name}`}>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 w-64">{row.entity_name}</TableCell>
                    {members.map((member) => {
                      const roles = row.assignments[member.id] || [];
                      const currentRole = roles.length > 0 ? roles[0] : "";

                      return (
                        <TableCell key={member.id} className="text-center">
                          <Badge
                            variant="secondary"
                            className={`cursor-pointer ${roleColors[currentRole as RaciRole]} ${currentRole === "" ? "opacity-0 hover:opacity-100" : ""}`}
                            onClick={() =>
                              handleCellClick(
                                row.entity_type,
                                row.entity_id,
                                deliverableName,
                                member.id,
                                roles
                              )
                            }
                          >
                            {currentRole.charAt(0).toUpperCase()}
                          </Badge>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  );
}
