import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any = {};

  constructor(private http: HttpClient) {
  }

  // loadConfig(): Promise<void> {
  //   if (environment.useRuntimeConfig) {
  //     return this.http.get('/assets/environment.json')
  //       .toPromise()
  //       .then(data => { this.config = data; })
  //       .catch(() => { this.config = {}; }); // fallback se file non trovato
  //   } else {
  //     this.config = {}; // usare environment.ts
  //     return Promise.resolve();
  //   }
  // }

  // get apiBaseUrl(): string {
  //   if (this.config && this.config.isLocal) {
  //     return this.config.localBaseUrl;
  //   }
  //   return this.config?.apiBaseUrl || environment.apiBaseUrl;
  // }

  // get isMock(): boolean {
  //   return this.config?.isMock ?? environment.isMock;
  // }

  // get headers(): any {
  //   return this.config?.headers ?? {};
  // }
}
