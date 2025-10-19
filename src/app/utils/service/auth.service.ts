import {Injectable} from '@angular/core';
import {ApiConstants} from '../constants/ApiConstants';
import {AuthRequest} from '../model/rest/auth/AuthRequestModels';
import {catchError, Observable, of, throwError} from 'rxjs';
import {AuthResponse} from '../model/rest/auth/AuthResponseModels';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../model/rest/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isMock: boolean = false;
  public apiConstants: ApiConstants;

  constructor(readonly http: HttpClient) {
    //this.isMock = FreyaAppConfig.getConfigByKey('isMock');
    this.apiConstants = new ApiConstants();
  }

  login(loginRequest: AuthRequest): Observable<ApiResponse<AuthResponse>> {

    if (!this.isMock) {
      return this.http.post<ApiResponse<AuthResponse>>(this.apiConstants.LOGIN, loginRequest)
        .pipe(catchError(this.handleError<ApiResponse<AuthResponse>>('postLogin')));
    } else {
      return of(this.mockLogin())
    }

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return throwError(() => error);
    };
  }

  private mockLogin(): ApiResponse<AuthResponse> {

    return {
      success: true,
      code: 'SUCCESS',
      message: 'Login success',
      data: {
        accessToken: 'token',
        refreshToken: 'token',
        username: 'username',
        roles: ['ROLE_ADMIN']
      },
      traceId: '1234567890',
      errors: []
    };
  }
}
