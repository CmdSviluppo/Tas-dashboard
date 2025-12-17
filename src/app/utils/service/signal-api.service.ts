import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {
  CloseSignalRequest,
  ExecuteSignalRequest,
  SignalDTO,
  SignalFilters,
  SignalSummaryDTO
} from '../model/rest/signal/signal-api';
import {Page} from '../model/rest/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class SignalApiService extends BaseApiService {

  /**
   * GET /api/signals
   */
  getAll(filters?: SignalFilters): Observable<Page<SignalSummaryDTO>> {
    return this.get<Page<SignalSummaryDTO>>('/signals', filters);
  }

  /**
   * GET /api/signals/{id}
   */
  getById(id: string): Observable<SignalDTO> {
    return this.get<SignalDTO>(`/signals/${id}`);
  }

  /**
   * POST /api/signals/{id}/execute
   */
  execute(id: string, request: ExecuteSignalRequest): Observable<SignalDTO> {
    return this.post<SignalDTO>(`/signals/${id}/execute`, request);
  }

  /**
   * POST /api/signals/{id}/close
   */
  close(id: string, request: CloseSignalRequest): Observable<SignalDTO> {
    return this.post<SignalDTO>(`/signals/${id}/close`, request);
  }
}
