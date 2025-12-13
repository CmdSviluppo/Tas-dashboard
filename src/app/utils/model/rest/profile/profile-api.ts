export interface ProfileSummaryDTO {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  marketRegime?: string;
  strategiesCount: number;
}

export interface ProfileStrategyConfigDTO {
  id: string;
  strategyId: string;
  strategyCode: string;
  strategyName: string;
  timeframe: string;
  weight: number;
  parametersOverride: any;           // JSON
  isEnabled: boolean;
}

export interface ProfileScoringRulesDTO {
  id: string;
  weight4h: number;
  weight1h: number;
  weight30m: number;
  minScore4h: number;
  minScore1h: number;
  minScore30m: number;
  minAggregatedScore: number;
  minConfidence: number;
  require4hAlignment: boolean;
  requireVolumeConfirmation: boolean;
  maxVolatilityThreshold: number;
}

export interface ProfileDTO {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  marketRegime?: string;
  createdAt: Date;
  updatedAt: Date;
  strategyConfigs: ProfileStrategyConfigDTO[];
  scoringRules?: ProfileScoringRulesDTO;
}

export interface CreateProfileRequest {
  name: string;
  code: string;
  description: string;
  marketRegime?: string;
  active: boolean;
}

export interface UpdateStrategiesRequest {
  strategies: {
    strategyId: string;
    timeframe: string;
    weight: number;
    parametersOverride?: any;
    isEnabled: boolean;
  }[];
}
