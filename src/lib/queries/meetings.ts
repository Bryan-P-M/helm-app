import { createClient } from "@/lib/supabase/server";
import type {
  Meeting,
  MeetingWithDetails,
  MeetingFilters,
  CreateMeeting,
  UpdateMeeting,
} from "@/lib/types";

const MEETING_SELECT = `
  *,
  created_by:created_by_id(id, full_name),
  project:project_id(id, name, code),
  attendees:meeting_attendees(
    id, role,
    user:user_id(id, full_name, avatar_url)
  )
`;

export async function getMeetings(
  workspaceId: string,
  filters?: MeetingFilters
): Promise<MeetingWithDetails[]> {
  const supabase = await createClient();

  let query = supabase
    .from("meetings")
    .select(MEETING_SELECT)
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (filters) {
    if (filters.status) {
      const statuses = Array.isArray(filters.status)
        ? filters.status
        : [filters.status];
      query = query.in("status", statuses);
    }
    if (filters.project_id) {
      query = query.eq("project_id", filters.project_id);
    }
    if (filters.date_from) {
      query = query.gte("meeting_date", filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte("meeting_date", filters.date_to);
    }
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
  }

  query = query.order("meeting_date", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as MeetingWithDetails[];
}

export async function getMeetingDetail(meetingId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("meetings")
    .select(MEETING_SELECT)
    .eq("id", meetingId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  // Fetch linked action/decision counts
  const [{ count: actionCount }, { count: decisionCount }] = await Promise.all([
    supabase
      .from("actions")
      .select("id", { count: "exact", head: true })
      .eq("source_meeting_id", meetingId)
      .is("deleted_at", null),
    supabase
      .from("decisions")
      .select("id", { count: "exact", head: true })
      .eq("meeting_id", meetingId)
      .is("deleted_at", null),
  ]);

  return {
    ...(data as unknown as MeetingWithDetails),
    action_count: actionCount ?? 0,
    decision_count: decisionCount ?? 0,
  };
}

export async function createMeeting(
  workspaceId: string,
  userId: string,
  data: CreateMeeting
) {
  const supabase = await createClient();

  const { attendee_ids, ...meetingData } = data;

  const { data: inserted, error } = await supabase
    .from("meetings")
    .insert([{
      ...meetingData,
      workspace_id: workspaceId,
      created_by_id: userId,
      status: "scheduled",
    }])
    .select()
    .single();

  if (error) throw error;

  // Add attendees if provided
  if (attendee_ids?.length && inserted) {
    const attendeeRows = attendee_ids.map((uid) => ({
      meeting_id: inserted.id,
      user_id: uid,
      role: "attendee" as const,
    }));
    await supabase.from("meeting_attendees").insert(attendeeRows);
  }

  return inserted;
}

export async function updateMeeting(meetingId: string, data: UpdateMeeting) {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("meetings")
    .update(data)
    .eq("id", meetingId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
