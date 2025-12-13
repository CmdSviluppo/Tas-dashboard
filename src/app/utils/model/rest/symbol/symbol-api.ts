export interface SymbolSummaryDTO {
  id: string;
  symbol: string;
  enabled: boolean;
  timeframesCount: number;
  profilesCount: number;
}

export interface ActiveProfileDTO {
  id: string;
  profileId: string;
  profileCode: string;
  profileName: string;
  enabled: boolean;
  priority: number;
  analysisTimeframe: string;
}

export interface SymbolConfigDTO {
  id: string;
  symbol: string;
  enabled: boolean;
  timeframes: string[];              // Set<String> from backend
  notifyTelegram: boolean;
  notifyUi: boolean;
  activeProfiles: ActiveProfileDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSymbolRequest {
  symbol: string;
  enabled: boolean;
  timeframes: string[];
  notifyTelegram: boolean;
  notifyUi: boolean;
}

export interface AssignProfilesRequest {
  profiles: {
    profileId: string;
    analysisTimeframe: string;
    enabled: boolean;
    priority: number;
  }[];
}
