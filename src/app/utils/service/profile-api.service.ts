import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApiService} from './base-api.service';
import {
  CreateProfileRequest,
  ProfileDTO,
  ProfileScoringRulesDTO,
  ProfileStrategyConfigDTO,
  ProfileSummaryDTO,
  UpdateStrategiesRequest
} from '../model/rest/profile/profile-api';


@Injectable({
  providedIn: 'root'
})
export class ProfileApiService extends BaseApiService {

  /**
   * GET /api/profiles
   */
  getAll(): Observable<ProfileSummaryDTO[]> {
    return this.get<ProfileSummaryDTO[]>('/profiles');
  }

  /**
   * GET /api/profiles/{id}
   */
  getById(id: number): Observable<ProfileDTO> {
    return this.get<ProfileDTO>(`/profiles/${id}`);
  }

  /**
   * POST /api/profiles
   */
  create(request: CreateProfileRequest): Observable<ProfileDTO> {
    return this.post<ProfileDTO>('/profiles', request);
  }

  /**
   * PUT /api/profiles/{id}
   */
  update(id: number, request: CreateProfileRequest): Observable<ProfileDTO> {
    return this.put<ProfileDTO>(`/profiles/${id}`, request);
  }

  /**
   * PUT /api/profiles/{id}/strategies
   */
  updateStrategies(id: number, request: UpdateStrategiesRequest): Observable<ProfileStrategyConfigDTO[]> {
    return this.put<ProfileStrategyConfigDTO[]>(`/profiles/${id}/strategies`, request);
  }

  /**
   * PUT /api/profiles/{id}/scoring-rules
   */
  updateScoringRules(id: number, rules: ProfileScoringRulesDTO): Observable<ProfileScoringRulesDTO> {
    return this.put<ProfileScoringRulesDTO>(`/profiles/${id}/scoring-rules`, rules);
  }

  /**
   * PATCH /api/profiles/{id}/activate
   */
  activate(id: number): Observable<ProfileDTO> {
    return this.patch<ProfileDTO>(`/profiles/${id}/activate`);
  }

  /**
   * PATCH /api/profiles/{id}/deactivate
   */
  deactivate(id: number): Observable<ProfileDTO> {
    return this.patch<ProfileDTO>(`/profiles/${id}/deactivate`);
  }

  /**
   * DELETE /api/profiles/{id}
   */
  deleteProfile(id: number): Observable<void> {
    return this.delete<void>(`/profiles/${id}`);
  }
}
