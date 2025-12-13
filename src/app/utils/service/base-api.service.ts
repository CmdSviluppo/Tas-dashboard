import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  /**
   * GET request
   */
  protected get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const httpParams = this.buildParams(params);

    return this.http.get<T>(url, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST request
   */
  protected post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.post<T>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PUT request
   */
  protected put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.put<T>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PATCH request
   */
  protected patch<T>(endpoint: string, body?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.patch<T>(url, body || {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request
   */
  protected delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.delete<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Build HttpParams from object
   * Skips null, undefined, and empty string values
   */
  protected buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.keys(params).forEach(key => {
      const value = params[key];

      // Skip null, undefined, and empty strings
      if (value === null || value === undefined || value === '') {
        return;
      }

      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(key, item.toString());
        });
      }
      // Handle Date objects
      else if (value instanceof Date) {
        httpParams = httpParams.set(key, value.toISOString());
      }
      // Handle other values
      else {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return httpParams;
  }

  /**
   * Centralized error handling
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('[BaseApiService]', errorMessage);
    return throwError(() => error);
  }
}
