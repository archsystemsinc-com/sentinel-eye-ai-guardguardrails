
export type ContentType = 'prompt' | 'completion' | 'image' | 'document' | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type ValidationRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  pattern: string;
  contentTypes: ContentType[];
  severity: SeverityLevel;
};

export type ValidationResult = {
  passed: boolean;
  rule?: ValidationRule;
  details?: string;
  timestamp: string;
};

export type AIInteraction = {
  id: string;
  timestamp: string;
  source: string;
  input: string;
  output: string;
  contentType: ContentType;
  validationResults: ValidationResult[];
  blocked: boolean;
};

export type Incident = {
  id: string;
  timestamp: string;
  aiInteractionId: string;
  severity: SeverityLevel;
  rule: ValidationRule;
  content: string;
  status: 'open' | 'investigating' | 'resolved' | 'false-positive';
  resolutionNotes?: string;
};

export type DashboardMetrics = {
  totalInteractions: number;
  blockedInteractions: number;
  openIncidents: number;
  resolvedIncidents: number;
  riskScore: number;
  violationsByRule: Map<string, number>;
  violationsBySeverity: Map<SeverityLevel, number>;
  violationsTrend: { date: string; count: number }[];
};

export type Policy = {
  id: string;
  name: string;
  description: string;
  rules: ValidationRule[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};
