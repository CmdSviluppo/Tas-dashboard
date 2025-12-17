import {MarketRegime} from '../../enum';

export interface ProfileSummaryDTO {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
  marketRegime?: MarketRegime;
  strategiesCount: number;
}

export interface ProfileStrategyConfigDTO {
  id: number;
  strategyId: number;
  strategyCode: string;
  strategyName: string;
  timeframe: string;
  weight: number;
  parametersOverride: any;           // JSON
  isEnabled: boolean;
}

export interface ProfileScoringRulesDTO {
  id?: string;
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
  maxVolatilityThreshold: number | null;
}

export interface ProfileDTO {
  id: number;
  name: string;
  code: string;
  description: string;
  active: boolean;
  marketRegime?: MarketRegime;
  createdAt: Date;
  updatedAt: Date;
  strategyConfigs: ProfileStrategyConfigDTO[];
  scoringRules?: ProfileScoringRulesDTO;
}

export interface CreateProfileRequest {
  name: string;
  code: string;
  description?: string;
  marketRegime?: string;
  active: boolean;
}

export interface UpdateStrategiesRequest {
  strategies: UpdateStrategyDto[];
}

export interface UpdateStrategyDto {
  strategyId: number;
  timeframe: string;
  weight: number;
  parametersOverride?: any;
  isEnabled: boolean;
}
