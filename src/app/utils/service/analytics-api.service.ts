import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {
  AnalyticsReportDTO,
  ProfileStatsDTO,
  StateTransitionDTO,
  SymbolStatsDTO,
  SystemStatsDTO,
  TradingPerformanceDTO
} from '../model/rest/analytics/analytics-api';


export interface AnalyticsFilters {
  from?: Date;
  to?: Date;
  symbol?: string;
  profileCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApiService extends BaseApiService {

  /**
   * GET /api/analytics/system-stats
   */
  getSystemStats(): Observable<SystemStatsDTO> {
    return this.get<SystemStatsDTO>('/analytics/system-stats');
  }

  /**
   * GET /api/analytics/trading-performance
   */
  getTradingPerformance(filters?: AnalyticsFilters): Observable<TradingPerformanceDTO> {
    return this.get<TradingPerformanceDTO>('/analytics/trading-performance', filters);
  }

  /**
   * GET /api/analytics/profiles
   */
  getProfileStats(): Observable<ProfileStatsDTO[]> {
    return this.get<ProfileStatsDTO[]>('/analytics/profiles');
  }

  /**
   * GET /api/analytics/symbols
   */
  getSymbolStats(): Observable<SymbolStatsDTO[]> {
    return this.get<SymbolStatsDTO[]>('/analytics/symbols');
  }

  /**
   * GET /api/analytics/transitions
   */
  getTransitions(filters?: {
    symbol?: string;
    profileCode?: string;
    from?: Date;
    to?: Date;
    limit?: number;
  }): Observable<StateTransitionDTO[]> {
    return this.get<StateTransitionDTO[]>('/analytics/transitions', filters);
  }

  /**
   * GET /api/analytics/report
   */
  getFullReport(): Observable<AnalyticsReportDTO> {
    return this.get<AnalyticsReportDTO>('/analytics/report');
  }
}
