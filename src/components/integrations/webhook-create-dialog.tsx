"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";
import { Copy, ExternalLink, Plus } from "lucide-react"; // Using Plus for the trigger button, Copy for the secret

const allEventTypes = {
  "Portfolio events": [
    "portfolio.created", "portfolio.updated", "portfolio.rag_changed"
  ],
  "Programme events": [
    "programme.created", "programme.updated", "programme.rag_changed"
  ],
  "Project events": [
    "project.created", "project.updated", "project.rag_changed"
  ],
  "RAID events": [
    "raid_item.created", "raid_item.updated", "raid_item.escalated", "raid_item.resolved"
  ],
  "Action events": [
    "action.created", "action.updated", "action.completed", "action.overdue"
  ],
  "Decision events": [
    "decision.created", "decision.approved", "decision.rejected"
  ],
  "Meeting events": [
    "meeting.completed", "meeting.extraction_completed"
  ],
};

export default function WebhookCreateDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [secret, setSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (eventType: string, checked: boolean) => {
    setSelectedEventTypes(prev =>
      checked ? [...prev, eventType] : prev.filter(e => e !== eventType)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSecret(null);

    if (!name || !url || selectedEventTypes.length === 0) {
      toast.error("Please fill in all required fields and select at least one event type.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/v1/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, url, event_types: selectedEventTypes }),
      });

      const data = await response.json();

      if (response.ok) {
        setSecret(data.secret);
        toast.success("Webhook created successfully!");
        router.refresh(); // Refresh server component data
      } else {
        toast.error(data.error || "Failed to create webhook.");
      }
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast.success("Secret copied to clipboard!");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form on close
      setName("");
      setUrl("");
      setSelectedEventTypes([]);
      setSecret(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Webhook</DialogTitle>
          <DialogDescription>
            Set up a new webhook to receive notifications for governance events.
          </DialogDescription>
        </DialogHeader>
        {!secret ? (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-service.com/webhook"
                className="col-span-3"
                required
              />
            </div>

            <Card className="col-span-4 mt-2">
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
                <CardDescription>Select the events that should trigger this webhook.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(allEventTypes).map(([groupName, events]) => (
                  <div key={groupName} className="space-y-2">
                    <h4 className="font-semibold text-sm mb-2">{groupName}</h4>
                    <div className="grid gap-1">
                      {events.map(eventType => (
                        <label key={eventType} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEventTypes.includes(eventType)}
                            onChange={(e) => handleCheckboxChange(eventType, e.target.checked)}
                            className="rounded"
                          />
                          {eventType}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Webhook"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Webhook Secret</Label>
              <div className="flex items-center space-x-2">
                <Input type="text" value={secret} readOnly className="font-mono" />
                <Button variant="secondary" onClick={handleCopySecret}><Copy className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-red-500 font-medium">
                IMPORTANT: Save this secret now. It will not be shown again!
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
