import {Inject, Injectable} from '@angular/core';
import {AppConfigService} from './app-config.service';
import {map, Observable} from 'rxjs';
// Nebular auth types sometimes mismatch with installed package versions.
// Import types only and use `any` for runtime injection to avoid compile-time errors
// until Nebular packages are aligned with Angular.
import type {NbAuthJWTToken} from '@nebular/auth';
import {NbAuthService} from '@nebular/auth';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  constructor(
    @Inject(NbAuthService) private nbAuthService: NbAuthService,
    private config: AppConfigService
  ) {
  }

  getToken(): Observable<string | null> {
    return this.nbAuthService.getToken().pipe(
      map((token: any) => (token as NbAuthJWTToken | null)?.getValue() || null)
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.nbAuthService.isAuthenticated();
  }

  logout(): void {
    this.nbAuthService.logout('email').subscribe();
  }

  getUserRoles(): Observable<string[]> {
    return this.nbAuthService.getToken().pipe(
      map((token: any) => (token as NbAuthJWTToken | null)?.getPayload()?.roles || [])
    );
  }

}
