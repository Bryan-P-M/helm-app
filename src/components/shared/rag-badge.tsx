"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const RAG_CONFIG = {
  red: { label: "RED", className: "bg-red-500 hover:bg-red-600 text-white cursor-pointer" },
  amber: { label: "AMBER", className: "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer" },
  green: { label: "GREEN", className: "bg-green-500 hover:bg-green-600 text-white cursor-pointer" },
} as const;

type RagStatus = "red" | "amber" | "green";

interface RagBadgeProps {
  status: RagStatus;
  editable?: boolean;
  entityId?: string;
  entityTable?: "portfolios" | "programmes" | "projects" | "raid_items";
  size?: "sm" | "default";
}

export default function RagBadge({ status, editable = false, entityId, entityTable, size = "default" }: RagBadgeProps) {
  const [currentStatus, setCurrentStatus] = useState<RagStatus>(status);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const config = RAG_CONFIG[currentStatus];

  const handleChange = async (newStatus: RagStatus) => {
    if (newStatus === currentStatus || !entityId || !entityTable) return;
    setIsUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from(entityTable)
      .update({ rag_status: newStatus })
      .eq("id", entityId);

    if (error) {
      toast.error("Failed to update RAG status");
      console.error(error);
    } else {
      setCurrentStatus(newStatus);
      toast.success(`RAG status updated to ${newStatus.toUpperCase()}`);
      router.refresh();
    }
    setIsUpdating(false);
  };

  if (!editable) {
    return (
      <Badge className={RAG_CONFIG[currentStatus].className.replace("cursor-pointer", "")}>
        {config.label}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Badge className={config.className + (isUpdating ? " opacity-50" : "")}>
          {isUpdating ? "..." : config.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {(Object.keys(RAG_CONFIG) as RagStatus[]).map((rag) => (
          <DropdownMenuItem
            key={rag}
            onClick={() => handleChange(rag)}
            className="flex items-center gap-2"
          >
            <span className={`inline-block w-3 h-3 rounded-full ${
              rag === "red" ? "bg-red-500" : rag === "amber" ? "bg-amber-500" : "bg-green-500"
            }`} />
            {RAG_CONFIG[rag].label}
            {rag === currentStatus && <span className="ml-auto text-xs text-muted-foreground">Current</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}