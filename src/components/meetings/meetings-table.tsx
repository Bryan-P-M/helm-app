"use client";

import { useState, useMemo } from "react";
import { format, isBefore, isAfter, parseISO, formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectItem, SelectTrigger, SelectContent, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MeetingDetailSheet from "./meeting-detail-sheet";
import { MEETING_STATUS_LABELS, ATTENDEE_ROLE_LABELS } from "@/lib/constants";
import type { MeetingWithDetails, MeetingStatus } from "@/lib/types";

interface MeetingsTableProps {
  initialMeetings: MeetingWithDetails[];
}

function AttendeeAvatars({ attendees }: { attendees: MeetingWithDetails["attendees"] }) {
  const maxAvatars = 4;
  const avatars = (attendees ?? []).slice(0, maxAvatars);
  const overflow = (attendees?.length ?? 0) - maxAvatars;

  return (
    <div className="flex -space-x-2">
      {avatars.map((a) => (
        <Avatar key={a.id} className="h-7 w-7 border-2 border-background bg-muted">
          <AvatarImage src={a.user?.avatar_url ?? undefined} alt={a.user?.full_name ?? "Attendee"} />
          <AvatarFallback>
            {(a.user?.full_name ?? "A")[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 && (
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-semibold border-2 border-background">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function MeetingDateCell({ meetingDate }: { meetingDate: string }) {
  const date = parseISO(meetingDate);
  const isPast = isBefore(date, new Date());

  return (
    <div className="flex flex-col">
      <span className="font-semibold">
        {format(date, "dd MMM yyyy, HH:mm")}
      </span>
      <span className={`text-xs ${isPast ? "text-red-500" : "text-green-500"}`}>
        {isPast ? `${formatDistanceToNowStrict(date)} ago` : `in ${formatDistanceToNowStrict(date)}`}
      </span>
    </div>
  );
}

function MeetingRows({
  meetings,
  badgeVariant,
  onSelect,
}: {
  meetings: MeetingWithDetails[];
  badgeVariant: "outline" | "secondary";
  onSelect: (m: MeetingWithDetails) => void;
}) {
  if (meetings.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
          None.
        </TableCell>
      </TableRow>
    );
  }
  return (
    <>
      {meetings.map((m) => (
        <TableRow
          key={m.id}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => onSelect(m)}
        >
          <TableCell><MeetingDateCell meetingDate={m.meeting_date} /></TableCell>
          <TableCell className="font-medium">{m.title}</TableCell>
          <TableCell>{m.project?.name}</TableCell>
          <TableCell>
            <Badge variant={badgeVariant}>{MEETING_STATUS_LABELS[m.status]}</Badge>
          </TableCell>
          <TableCell><AttendeeAvatars attendees={m.attendees} /></TableCell>
          <TableCell className="text-muted-foreground">{m.location}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function MeetingsTable({ initialMeetings }: MeetingsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithDetails | null>(null);

  const filtered = useMemo(() => {
    return initialMeetings.filter((m) => {
      if (statusFilter && m.status !== statusFilter) return false;
      if (searchFilter && !m.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      return true;
    });
  }, [initialMeetings, statusFilter, searchFilter]);

  const now = new Date();
  const [upcoming, past] = useMemo(() => {
    const future: MeetingWithDetails[] = [];
    const history: MeetingWithDetails[] = [];
    filtered.forEach((m) => {
      if (isAfter(parseISO(m.meeting_date), now)) future.push(m);
      else history.push(m);
    });
    return [future, history.reverse()];
  }, [filtered]);

  const headers = (
    <TableRow>
      <TableHead className="w-52">Date</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Project</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Attendees</TableHead>
      <TableHead>Location</TableHead>
    </TableRow>
  );

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="w-40">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              {Object.entries(MEETING_STATUS_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-56">
          <Label className="text-xs text-muted-foreground">Search</Label>
          <Input
            placeholder="Filter by title…"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        {(statusFilter || searchFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setStatusFilter(""); setSearchFilter(""); }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Upcoming */}
      <h2 className="text-lg font-semibold mb-2">Upcoming</h2>
      <Table>
        <TableHeader>{headers}</TableHeader>
        <TableBody>
          <MeetingRows meetings={upcoming} badgeVariant="outline" onSelect={setSelectedMeeting} />
        </TableBody>
      </Table>

      <Separator className="my-6" />

      {/* Past */}
      <h2 className="text-lg font-semibold mb-2">Past</h2>
      <Table>
        <TableHeader>{headers}</TableHeader>
        <TableBody>
          <MeetingRows meetings={past} badgeVariant="secondary" onSelect={setSelectedMeeting} />
        </TableBody>
      </Table>

      {/* Detail sheet */}
      <MeetingDetailSheet
        open={!!selectedMeeting}
        meeting={selectedMeeting}
        onOpenChange={(open) => { if (!open) setSelectedMeeting(null); }}
      />
    </div>
  );
}
