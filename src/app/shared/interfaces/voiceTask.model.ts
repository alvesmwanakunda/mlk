export interface VoiceTaskDraft {
  titre: string | null;
  assignes: string[];
  date_debut?: string;
  date_fin?: string;
  description: string | null;
}

export interface VoiceTaskResponse {
  success: boolean;
  created: boolean;
  transcript: string;
  data: VoiceTaskDraft;
  resolvedAssignes: any[];
  unresolvedAssignes: any[];
  missingFields: string[];
}
