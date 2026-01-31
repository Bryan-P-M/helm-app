"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Check, X, AlertTriangle, FileText, CheckCircle } from "lucide-react";

interface AIExtractionReviewProps {
  meetingId: string;
  meetingTitle: string;
  meetingDate: string; // ISO date string
  notes: string | null;
  projectId: string;
  workspaceId: string;
}

type ExtractionType = "action" | "decision" | "risk" | "issue";
type PriorityType = "critical" | "high" | "medium" | "low";

interface Extraction {
  id: string;
  type: ExtractionType;
  title: string;
  description: string | null;
  confidence: number;
  owner: string | null;
  due_date: string | null; // YYYY-MM-DD
  priority: PriorityType;
  source_text: string | null;
  status: "pending" | "accepted" | "rejected" | "editing";
}

type Phase = "idle" | "extracting" | "reviewing";

const typeColors: Record<ExtractionType, string> = {
  action: "bg-blue-500 hover:bg-blue-600",
  decision: "bg-green-500 hover:bg-green-600",
  risk: "bg-amber-500 hover:bg-amber-600",
  issue: "bg-red-500 hover:bg-red-600",
};

const priorityColors: Record<PriorityType, string> = {
  critical: "bg-red-700 hover:bg-red-800",
  high: "bg-orange-500 hover:bg-orange-600",
  medium: "bg-yellow-500 hover:bg-yellow-600",
  low: "bg-gray-500 hover:bg-gray-600",
};

const confidenceColors = (confidence: number) => {
  if (confidence > 0.7) return "bg-green-500 hover:bg-green-600";
  if (confidence > 0.4) return "bg-amber-500 hover:bg-amber-600";
  return "bg-red-500 hover:bg-red-600";
};

export default function AIExtractionReview({
  meetingId,
  meetingTitle,
  meetingDate,
  notes,
  projectId,
  workspaceId,
}: AIExtractionReviewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [phase, setPhase] = useState<Phase>("idle");
  const [extractions, setExtractions] = useState<Extraction[]>([]);

  const pendingItems = useMemo(
    () => extractions.filter((item) => item.status === "pending").length,
    [extractions]
  );
  const acceptedItems = useMemo(
    () => extractions.filter((item) => item.status === "accepted").length,
    [extractions]
  );
  const rejectedItems = useMemo(
    () => extractions.filter((item) => item.status === "rejected").length,
    [extractions]
  );

  const extractionSummary = useMemo(() => {
    const counts = extractions.reduce(
      (acc, item) => {
        acc[item.type]++;
        return acc;
      },
      { action: 0, decision: 0, risk: 0, issue: 0 }
    );
    return `Helmbot found ${extractions.length} items: ${counts.action} actions, ${counts.decision} decisions, ${counts.risk} risks, ${counts.issue} issues.`;
  }, [extractions]);

  const handleExtract = useCallback(async () => {
    setPhase("extracting");
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, meetingTitle, meetingDate, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract items.");
      }

      const data = await response.json();
      const initialExtractions: Extraction[] = data.extractions.map(
        (item: any, index: number) => ({
          ...item,
          id: `${item.type}-${index}`, // Simple unique ID for local state
          status: "pending",
        })
      );
      setExtractions(initialExtractions);
      setPhase("reviewing");
      toast.success("Extraction complete!", {
        description: `${data.extractionCount} items found.`,
      });
    } catch (error: any) {
      toast.error("Extraction failed", {
        description: error.message || "An unknown error occurred.",
      });
      setPhase("idle");
    }
  }, [meetingId, meetingTitle, meetingDate, notes]);

  const handleAccept = useCallback(
    async (item: Extraction) => {
      try {
        let insertResult;
        if (item.type === "action") {
          insertResult = await supabase.from("actions").insert({
            workspace_id: workspaceId,
            project_id: projectId,
            title: item.title,
            description: item.description,
            status: "open",
            priority: item.priority,
            due_date: item.due_date,
            source_meeting_id: meetingId,
          });
        } else if (item.type === "decision") {
          insertResult = await supabase.from("decisions").insert({
            workspace_id: workspaceId,
            project_id: projectId,
            title: item.title,
            description: item.description,
            status: "approved",
            meeting_id: meetingId,
          });
        } else if (item.type === "risk" || item.type === "issue") {
          insertResult = await supabase.from("raid_items").insert({
            workspace_id: workspaceId,
            project_id: projectId,
            title: item.title,
            description: item.description,
            type: item.type,
            rag_status:
              item.priority === "critical"
                ? "red"
                : item.priority === "high"
                ? "amber"
                : "green",
            priority: item.priority,
            status: "open",
            source_level: "project",
          });
        } else {
          throw new Error("Unknown extraction type.");
        }

        if (insertResult?.error) {
          throw new Error(insertResult.error.message);
        }

        setExtractions((prev) =>
          prev.map((ext) =>
            ext.id === item.id ? { ...ext, status: "accepted" } : ext
          )
        );
        toast.success(`${item.type} "${item.title}" accepted!`);
      } catch (error: any) {
        toast.error(`Failed to accept ${item.type}`, {
          description: error.message || "An unknown error occurred.",
        });
      }
    },
    [supabase, workspaceId, projectId, meetingId]
  );

  const handleEdit = useCallback((id: string) => {
    setExtractions((prev) =>
      prev.map((ext) => (ext.id === id ? { ...ext, status: "editing" } : ext))
    );
  }, []);

  const handleCancelEdit = useCallback((id: string) => {
    setExtractions((prev) =>
      prev.map((ext) => (ext.id === id ? { ...ext, status: "pending" } : ext))
    );
  }, []);

  const handleSaveAndAccept = useCallback(
    async (id: string, updatedFields: Partial<Extraction>) => {
      const updatedItem = extractions.find((ext) => ext.id === id);
      if (updatedItem) {
        const itemToAccept = { ...updatedItem, ...updatedFields, status: "pending" as const };
        await handleAccept(itemToAccept);
        setExtractions((prev) =>
          prev.map((ext) => (ext.id === id ? { ...ext, ...updatedFields } : ext))
        );
      }
    },
    [extractions, handleAccept]
  );

  const handleReject = useCallback((id: string) => {
    setExtractions((prev) =>
      prev.map((ext) =>
        ext.id === id ? { ...ext, status: "rejected" } : ext
      )
    );
    toast.info("Item rejected.");
  }, []);

  const handleAcceptAll = useCallback(async () => {
    for (const item of extractions) {
      if (item.status === "pending") {
        await handleAccept(item);
      }
    }
    toast.success("All pending items accepted!");
  }, [extractions, handleAccept]);

  const handleDone = useCallback(() => {
    router.refresh();
  }, [router]);

  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Helmbot can help you extract governance items from your meeting notes.
        </p>
        <Button
          onClick={handleExtract}
          disabled={!notes}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Extract with AI
        </Button>
        {!notes && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertTriangle className="mr-1 h-4 w-4" />
            No notes available for extraction.
          </p>
        )}
      </div>
    );
  }

  if (phase === "extracting") {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-lg text-gray-700">
          Helmbot is analysing your meeting notes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-700">
            {extractionSummary}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {extractions.map((item) => (
          <Card
            key={item.id}
            className={`${
              item.status === "rejected" ? "opacity-60 bg-gray-50" : ""
            } ${item.status === "accepted" ? "border-green-500 shadow-md" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Badge className={typeColors[item.type]}>{item.type}</Badge>
                <CardTitle
                  className={`text-lg font-semibold ${
                    item.status === "rejected" ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.title}
                </CardTitle>
                <Badge className={confidenceColors(item.confidence)}>
                  {Math.round(item.confidence * 100)}% Confidence
                </Badge>
              </div>
              {item.status === "accepted" && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {item.status === "editing" ? (
                <EditExtractionForm
                  item={item}
                  onSave={(updatedFields) =>
                    handleSaveAndAccept(item.id, updatedFields)
                  }
                  onCancel={() => handleCancelEdit(item.id)}
                />
              ) : (
                <>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                  {item.source_text && (
                    <blockquote className="border-l-4 pl-4 italic text-gray-600">
                      &quot;{item.source_text}&quot;
                    </blockquote>
                  )}
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    {item.owner && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Owner: {item.owner}
                      </Badge>
                    )}
                    {item.due_date && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Due: {item.due_date}
                      </Badge>
                    )}
                    <Badge className={priorityColors[item.priority]}>
                      {item.priority} Priority
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {item.status === "pending" && (
                      <>
                        <Button
                          onClick={() => handleAccept(item)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="mr-2 h-4 w-4" /> Accept
                        </Button>
                        <Button
                          onClick={() => handleEdit(item.id)}
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleReject(item.id)}
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between shadow-lg">
        <div className="text-sm text-gray-600">
          <Badge className="bg-green-100 text-green-800">
            Accepted: {acceptedItems}
          </Badge>{" "}
          <Badge className="bg-red-100 text-red-800">
            Rejected: {rejectedItems}
          </Badge>{" "}
          <Badge className="bg-gray-100 text-gray-800">
            Pending: {pendingItems}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAcceptAll} disabled={pendingItems === 0}>
            Accept All Pending
          </Button>
          <Button onClick={handleDone} className="bg-blue-600 hover:bg-blue-700 text-white">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface EditExtractionFormProps {
  item: Extraction;
  onSave: (updatedFields: Partial<Extraction>) => void;
  onCancel: () => void;
}

function EditExtractionForm({ item, onSave, onCancel }: EditExtractionFormProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [priority, setPriority] = useState<PriorityType>(item.priority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value: PriorityType) => setPriority(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
          Save & Accept
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
