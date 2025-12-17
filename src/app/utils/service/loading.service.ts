import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Signal-based reactive state
  public isLoading = signal<boolean>(false);

  // Counter to handle multiple simultaneous requests
  private loadingCounter = 0;

  /**
   * Show loading spinner
   * Increments counter and sets loading to true
   */
  show(): void {
    this.loadingCounter++;
    this.isLoading.set(true);
  }

  /**
   * Hide loading spinner
   * Decrements counter and sets loading to false only when counter reaches 0
   */
  hide(): void {
    this.loadingCounter--;

    if (this.loadingCounter <= 0) {
      this.loadingCounter = 0;
      this.isLoading.set(false);
    }
  }

  /**
   * Force reset loading state
   * Useful for error scenarios
   */
  reset(): void {
    this.loadingCounter = 0;
    this.isLoading.set(false);
  }

  /**
   * Get current loading state (for non-reactive contexts)
   */
  getState(): boolean {
    return this.isLoading();
  }
}
