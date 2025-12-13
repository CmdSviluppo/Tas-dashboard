import { StrategyType } from "../../enum";

/**
 * Strategy Entity (completo)
 */
export interface Strategy {
  id: number;
  name: string;
  code: string;
  type: StrategyType;
  implementationClass: string;
  defaultParameters: any; // JsonNode
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Strategy Summary (per liste)
 */
export interface StrategySummary {
  id: number;
  name: string;
  code: string;
  type: StrategyType;
  isActive: boolean;
  usageCount: number;
}

/**
 * Strategy Usage Info
 */
export interface StrategyUsage {
  strategyId: number;
  strategyCode: string;
  usedByProfiles: ProfileUsageInfo[];
  totalUsageCount: number;
}

export interface ProfileUsageInfo {
  profileId: number;
  profileCode: string;
  profileName: string;
  timeframe: string;
  weight: number;
  isEnabled: boolean;
}

/**
 * Parameter Template (per tipo di strategia)
 */
export interface ParameterTemplate {
  name: string;
  description: string;
  type: 'INTEGER' | 'DOUBLE' | 'BOOLEAN' | 'STRING';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  required: boolean;
}

/**
 * Create Strategy Request
 */
export interface CreateStrategyRequest {
  name: string;
  code: string;
  type: StrategyType;
  implementationClass: string;
  defaultParameters?: any;
  description?: string;
  isActive?: boolean;
}

/**
 * Update Strategy Request
 */
export interface UpdateStrategyRequest {
  name?: string;
  defaultParameters?: any;
  description?: string;
  isActive?: boolean;
}

/**
 * Update Parameters Request
 */
export interface UpdateParametersRequest {
  parameters: any;
}
