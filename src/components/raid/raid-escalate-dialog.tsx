"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RaidEscalateDialogProps {
  item: {
    id: string;
    workspace_id: string;
    project_id: string;
    title: string;
    description: string | null;
    type: string;
    rag_status: string;
    priority: string;
    impact: string | null;
    likelihood: string | null;
    source_level: string;
    programme_id?: string | null;
    portfolio_id?: string | null;
  };
  children: React.ReactNode; // trigger button
}

interface Entity {
  id: string;
  name: string;
  portfolio_id?: string | null;
}

const RaidEscalateDialog: React.FC<RaidEscalateDialogProps> = ({ item, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetLevel, setTargetLevel] = useState<"programme" | "portfolio" | "">("");
  const [targetEntityId, setTargetEntityId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programmes, setProgrammes] = useState<Entity[]>([]);
  const [portfolios, setPortfolios] = useState<Entity[]>([]);

  const router = useRouter();
  const supabase = createClient();

  const availableTargetLevels = () => {
    if (item.source_level === "project") {
      return ["programme", "portfolio"];
    }
    if (item.source_level === "programme") {
      return ["portfolio"];
    }
    return []; // 'portfolio' level cannot escalate further
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setTargetLevel("");
      setTargetEntityId(null);
      setNote("");
      setIsSubmitting(false);
      setProgrammes([]);
      setPortfolios([]);
      return;
    }

    const fetchEntities = async () => {
      if (item.workspace_id) {
        // Fetch programmes
        const { data: programmesData, error: programmesError } = await supabase
          .from("programmes")
          .select("id, name, portfolio_id")
          .eq("workspace_id", item.workspace_id)
          .is("deleted_at", null);

        if (programmesError) {
          toast.error("Failed to fetch programmes.");
          console.error("Error fetching programmes:", programmesError);
        } else {
          setProgrammes(programmesData || []);
        }

        // Fetch portfolios
        const { data: portfoliosData, error: portfoliosError } = await supabase
          .from("portfolios")
          .select("id, name")
          .eq("workspace_id", item.workspace_id)
          .is("deleted_at", null);

        if (portfoliosError) {
          toast.error("Failed to fetch portfolios.");
          console.error("Error fetching portfolios:", portfoliosError);
        } else {
          setPortfolios(portfoliosData || []);
        }
      }
    };

    fetchEntities();
  }, [isOpen, item.workspace_id, supabase]);

  useEffect(() => {
    // Pre-select natural parent if available
    if (programmes.length > 0 && item.source_level === "project" && item.project_id && targetLevel === "programme") {
      const preSelectProgramme = async () => {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("programme_id")
          .eq("id", item.project_id)
          .single();

        if (!projectError && projectData?.programme_id) {
          setTargetEntityId(projectData.programme_id);
        }
      };
      preSelectProgramme();
    } else if (portfolios.length > 0 && item.source_level === "programme" && item.programme_id && targetLevel === "portfolio") {
      const preSelectPortfolio = programmes.find(p => p.id === item.programme_id)?.portfolio_id;
      if (preSelectPortfolio) {
        setTargetEntityId(preSelectPortfolio);
      }
    } else if (programmes.length > 0 && item.source_level === "project" && targetLevel === "portfolio") {
        // if escalating project to portfolio, try to find the project's program's portfolio
        const preSelectPortfolio = async () => {
            const { data: projectData, error: projectError } = await supabase
                .from("projects")
                .select("programme_id")
                .eq("id", item.project_id)
                .single();

            if (!projectError && projectData?.programme_id) {
                const programme = programmes.find(p => p.id === projectData.programme_id);
                if (programme?.portfolio_id) {
                    setTargetEntityId(programme.portfolio_id);
                }
            }
        };
        preSelectPortfolio();
    } else {
      setTargetEntityId(null);
    }
  }, [targetLevel, programmes, portfolios, item.source_level, item.project_id, item.programme_id, supabase]);


  const handleSubmit = async () => {
    if (!targetLevel || !targetEntityId || !note.trim()) {
      toast.error("Please select a target level, entity, and provide an escalation note.");
      return;
    }

    setIsSubmitting(true);

    // Insert escalated copy at higher level
    const newItem: any = {
      workspace_id: item.workspace_id,
      project_id: item.project_id, // keep reference to original project
      title: item.title,
      description: item.description,
      type: item.type,
      rag_status: item.rag_status,
      priority: item.priority,
      impact: item.impact,
      likelihood: item.likelihood,
      source_level: targetLevel,
      is_escalated: true,
      escalated_from_id: item.id,
      escalation_note: note,
    };

    if (targetLevel === "programme") {
      newItem.programme_id = targetEntityId;
    } else if (targetLevel === "portfolio") {
      newItem.portfolio_id = targetEntityId;
    }

    const { error: insertError } = await supabase.from("raid_items").insert(newItem);
    if (insertError) {
      toast.error("Failed to escalate item.");
      console.error("Error inserting new RAID item:", insertError);
      setIsSubmitting(false);
      return;
    }

    // Mark original as escalated
    const { error: updateError } = await supabase.from("raid_items").update({ status: "escalated" }).eq("id", item.id);
    if (updateError) {
      toast.error("Failed to update original item status.");
      console.error("Error updating original RAID item:", updateError);
      setIsSubmitting(false);
      return;
    }

    toast.success(`Escalated to ${targetLevel} level.`);
    router.refresh();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Escalate RAID Item</DialogTitle>
          <DialogDescription>
            Escalate "{item.title}" from {item.source_level} level to a higher governance level.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetLevel" className="text-right">
              Target Level
            </Label>
            <Select onValueChange={(value: "programme" | "portfolio") => setTargetLevel(value)} value={targetLevel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select target level" />
              </SelectTrigger>
              <SelectContent>
                {availableTargetLevels().map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {targetLevel && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetEntity" className="text-right">
                Target {targetLevel.charAt(0).toUpperCase() + targetLevel.slice(1)}
              </Label>
              <Select onValueChange={(value) => setTargetEntityId(value)} value={targetEntityId || ""}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select target ${targetLevel}`} />
                </SelectTrigger>
                <SelectContent>
                  {targetLevel === "programme" && programmes.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                  {targetLevel === "portfolio" && portfolios.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="note" className="text-right pt-2">
              Escalation Note
            </Label>
            <Textarea
              id="note"
              placeholder="Justification for escalation (required)"
              className="col-span-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting || !targetLevel || !targetEntityId || !note.trim()}>
            {isSubmitting ? "Escalating..." : `Escalate to ${targetLevel || "Level"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RaidEscalateDialog;