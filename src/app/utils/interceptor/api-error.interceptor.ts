import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {NotificationService} from '../service/notification.service';

/**
 * Error Interceptor - Handles HTTP errors globally
 * Shows appropriate notifications and handles authentication errors
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      switch (error.status) {
        case 401:
          // Unauthorized - redirect to login
          errorMessage = 'Session expired. Please login again.';
          notificationService.error(errorMessage, 'Unauthorized');

          // Clear token and redirect to login
          localStorage.removeItem('auth_app_token');
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Forbidden - no permission
          errorMessage = 'You do not have permission to perform this action.';
          notificationService.error(errorMessage, 'Forbidden');
          break;

        case 404:
          // Not Found
          errorMessage = error.error?.message || 'Resource not found.';
          notificationService.error(errorMessage, 'Not Found');
          break;

        case 400:
          // Bad Request - validation errors
          errorMessage = error.error?.message || 'Invalid request data.';
          notificationService.error(errorMessage, 'Bad Request');
          break;

        case 409:
          // Conflict - e.g., duplicate entry
          errorMessage = error.error?.message || 'Conflict occurred.';
          notificationService.error(errorMessage, 'Conflict');
          break;

        case 500:
          // Internal Server Error
          errorMessage = 'Server error occurred. Please try again later.';
          notificationService.error(errorMessage, 'Server Error');
          break;

        case 503:
          // Service Unavailable
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          notificationService.error(errorMessage, 'Service Unavailable');
          break;

        case 0:
          // Network error - no response from server
          errorMessage = 'Network error. Please check your connection.';
          notificationService.error(errorMessage, 'Network Error');
          break;

        default:
          // Generic error
          errorMessage = error.error?.message || error.message || 'An unexpected error occurred.';
          notificationService.error(errorMessage, 'Error');
      }

      // Log error for debugging
      console.error('[ErrorInterceptor] HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        error: error.error
      });

      // Re-throw error for local handling if needed
      return throwError(() => error);
    })
  );
};
