export type ProjectStatus = "published" | "flagged" | "removed";

export type VoteValue = "hot" | "not";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  daily_submission_count: number;
  last_submission_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  submitted_by: string | null;
  name: string;
  one_liner: string | null;
  tech_stack: string | null;
  url: string | null;
  github_url: string | null;
  why_stopped: string | null;
  screenshot_url: string | null;
  ai_obituary: string | null;
  ai_tagline: string | null;
  ai_cause_of_death: string | null;
  ai_emoji: string | null;
  ai_flagged: boolean;
  ai_flag_reason: string | null;
  status: ProjectStatus;
  vote_count: number;
  hot_count: number;
  not_count: number;
  hot_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardRow {
  id: string;
  name: string;
  ai_tagline: string | null;
  ai_emoji: string | null;
  ai_cause_of_death: string | null;
  ai_obituary: string | null;
  tech_stack: string | null;
  url: string | null;
  github_url: string | null;
  screenshot_url: string | null;
  vote_count: number;
  hot_count: number;
  not_count: number;
  hot_percentage: number;
  created_at: string;
  rank: number;
}

export interface CastVoteResult {
  success: boolean;
  reason?: string;
  message?: string;
  votes_remaining?: number;
  vote_count?: number;
  hot_percentage?: number;
  is_gated?: boolean;
  votes_cast?: number;
}

export interface SubmissionLimitResult {
  allowed: boolean;
  submissions_today?: number;
  remaining?: number;
  message?: string;
}
