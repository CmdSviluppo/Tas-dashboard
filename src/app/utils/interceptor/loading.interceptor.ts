import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {LoadingService} from '../service/loading.service';


/**
 * Loading Interceptor - Shows/hides global loading spinner
 * Skips if request has 'X-Skip-Loading' header
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Check if request should skip loading indicator
  const skipLoading = req.headers.has('X-Skip-Loading');

  if (skipLoading) {
    // Remove the custom header before sending request
    const clonedReq = req.clone({
      headers: req.headers.delete('X-Skip-Loading')
    });
    return next(clonedReq);
  }

  // Show loading spinner
  loadingService.show();

  // Hide loading spinner when request completes (success or error)
  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
