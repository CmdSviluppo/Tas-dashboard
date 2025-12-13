import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StrategyType } from '../model/enum';
import { StrategySummary, Strategy, StrategyUsage, CreateStrategyRequest, UpdateStrategyRequest, UpdateParametersRequest, ParameterTemplate } from '../model/rest/strategy/strategy-api';


@Injectable({
  providedIn: 'root'
})
export class StrategyApiService extends BaseApiService {

  /**
   * GET /api/strategies
   * Lista di tutte le strategie con conteggio utilizzo
   */
  getAll(activeOnly?: boolean): Observable<StrategySummary[]> {
    const params = activeOnly !== undefined ? { active: activeOnly } : undefined;
    return this.get<StrategySummary[]>('/strategies', params);
  }

  /**
   * GET /api/strategies/{id}
   * Dettaglio completo di una strategia
   */
  getById(id: number): Observable<Strategy> {
    return this.get<Strategy>(`/strategies/${id}`);
  }

  /**
   * GET /api/strategies/code/{code}
   * Trova strategia per codice
   */
  getByCode(code: string): Observable<Strategy> {
    return this.get<Strategy>(`/strategies/code/${code}`);
  }

  /**
   * GET /api/strategies/type/{type}
   * Filtra strategie per tipo
   */
  getByType(type: StrategyType, activeOnly?: boolean): Observable<StrategySummary[]> {
    const params = activeOnly !== undefined ? { active: activeOnly } : undefined;
    return this.get<StrategySummary[]>(`/strategies/type/${type}`, params);
  }

  /**
   * GET /api/strategies/{id}/usage
   * Ottiene informazioni sull'utilizzo della strategia
   *
   * NOTA: Questo endpoint non esiste nel backend!
   * Implementazione alternativa: chiama ProfileStrategyConfig
   */
  getUsage(id: number): Observable<StrategyUsage> {
    // TODO: Backend non ha questo endpoint
    // Implementazione workaround tramite /api/profiles
    return this.get<StrategyUsage>(`/strategies/${id}/usage`);
  }

  /**
   * POST /api/strategies
   * Crea una nuova strategia
   */
  create(request: CreateStrategyRequest): Observable<Strategy> {
    return this.post<Strategy>('/strategies', request);
  }

  /**
   * PUT /api/strategies/{id}
   * Aggiorna una strategia esistente
   */
  update(id: number, request: UpdateStrategyRequest): Observable<Strategy> {
    return this.put<Strategy>(`/strategies/${id}`, request);
  }

  /**
   * PATCH /api/strategies/{id}/parameters
   * Aggiorna solo i parametri di default della strategia
   */
  updateParameters(id: number, request: UpdateParametersRequest): Observable<Strategy> {
    return this.patch<Strategy>(`/strategies/${id}/parameters`, request);
  }

  /**
   * DELETE /api/strategies/{id}
   * Elimina una strategia (solo se non in uso)
   */
  deleteStrategy(id: number): Observable<void> {
    return this.delete<void>(`/strategies/${id}`);
  }

  /**
   * PATCH /api/strategies/{id}/activate
   * Attiva una strategia
   */
  activate(id: number): Observable<Strategy> {
    return this.patch<Strategy>(`/strategies/${id}/activate`, {});
  }

  /**
   * PATCH /api/strategies/{id}/deactivate
   * Disattiva una strategia
   */
  deactivate(id: number): Observable<Strategy> {
    return this.patch<Strategy>(`/strategies/${id}/deactivate`, {});
  }

  /**
   * GET /api/strategies/templates/{type}
   * Ottieni template parametri per tipo di strategia
   */
  getParameterTemplates(type: StrategyType): Observable<ParameterTemplate[]> {
    return this.get<ParameterTemplate[]>(`/strategies/templates/${type}`);
  }
}
