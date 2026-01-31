"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetingNotesEditorProps {
  meetingId: string;
  initialNotes: string | null;
}

export function MeetingNotesEditor({
  meetingId,
  initialNotes,
}: MeetingNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setNotes(initialNotes ?? "");
  }, [initialNotes]);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    const { error } = await supabase
      .from("meetings")
      .update({ notes })
      .eq("id", meetingId);

    if (error) {
      console.error("Error saving notes:", error);
      setSaveStatus("error");
      toast.error("Failed to save notes.");
    } else {
      setSaveStatus("saved");
      toast.success("Notes saved successfully.");
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 2000); // Reset status after a delay
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Meeting notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[150px] resize-y"
        rows={6}
      />
      <div className="flex items-center justify-end gap-2">
        {saveStatus === "saving" && (
          <span className="text-sm text-muted-foreground">Saving...</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-sm text-green-600">Saved!</span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm text-red-600">Error saving notes.</span>
        )}
        <Button onClick={handleSaveNotes} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}