import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { DashboardOverviewDTO, SymbolDetailDTO } from '../model/rest/dashboard/dashboard-api';


@Injectable({
  providedIn: 'root'
})
export class DashboardApiService extends BaseApiService {

  /**
   * GET /api/dashboard/overview
   */
  getOverview(): Observable<DashboardOverviewDTO> {
    return this.get<DashboardOverviewDTO>('/dashboard/overview');
  }

  /**
   * GET /api/dashboard/symbol/{symbol}
   */
  getSymbolDetail(symbol: string): Observable<SymbolDetailDTO> {
    return this.get<SymbolDetailDTO>(`/dashboard/symbol/${symbol}`);
  }
}
