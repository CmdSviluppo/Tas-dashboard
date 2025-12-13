import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { SymbolSummaryDTO, SymbolConfigDTO, CreateSymbolRequest, AssignProfilesRequest, ActiveProfileDTO } from '../model/rest/symbol/symbol-api';


@Injectable({
  providedIn: 'root'
})
export class SymbolApiService extends BaseApiService {

  /**
   * GET /api/symbols
   */
  getAll(): Observable<SymbolSummaryDTO[]> {
    return this.get<SymbolSummaryDTO[]>('/symbols');
  }

  /**
   * GET /api/symbols/{id}
   */
  getById(id: string): Observable<SymbolConfigDTO> {
    return this.get<SymbolConfigDTO>(`/symbols/${id}`);
  }

  /**
   * POST /api/symbols
   */
  create(request: CreateSymbolRequest): Observable<SymbolConfigDTO> {
    return this.post<SymbolConfigDTO>('/symbols', request);
  }

  /**
   * PUT /api/symbols/{id}
   */
  update(id: string, request: CreateSymbolRequest): Observable<SymbolConfigDTO> {
    return this.put<SymbolConfigDTO>(`/symbols/${id}`, request);
  }

  /**
   * PUT /api/symbols/{id}/profiles
   */
  assignProfiles(id: string, request: AssignProfilesRequest): Observable<ActiveProfileDTO[]> {
    return this.put<ActiveProfileDTO[]>(`/symbols/${id}/profiles`, request);
  }

  /**
   * PUT /api/symbols/{id}/timeframes
   */
  updateTimeframes(id: string, timeframes: string[]): Observable<SymbolConfigDTO> {
    return this.put<SymbolConfigDTO>(`/symbols/${id}/timeframes`, timeframes);
  }

  /**
   * PATCH /api/symbols/{id}/enable
   */
  enable(id: string): Observable<SymbolConfigDTO> {
    return this.patch<SymbolConfigDTO>(`/symbols/${id}/enable`);
  }

  /**
   * PATCH /api/symbols/{id}/disable
   */
  disable(id: string): Observable<SymbolConfigDTO> {
    return this.patch<SymbolConfigDTO>(`/symbols/${id}/disable`);
  }

  /**
   * DELETE /api/symbols/{id}
   */
  deleteSymbol(id: string): Observable<void> {
    return this.delete<void>(`/symbols/${id}`);
  }
}
