import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, tap } from 'rxjs';
import { NotificationService, StrategyApiService } from '../../../utils/service';
import { StrategyType } from '../../../utils/model/enum';
import { StrategyUsage, Strategy } from '../../../utils/model/rest/strategy/strategy-api';
import { StrategyListState } from '../pages/strategy-list/strategy-list.state';


@Injectable()
export class StrategyListService {

  private strategyApi = inject(StrategyApiService);
  private notification = inject(NotificationService);
  private state = new StrategyListState();

  // Cache per usage data
  private usageCache = new Map<number, StrategyUsage>();

  /**
   * Espone lo state come readonly
   */
  getState(): StrategyListState {
    return this.state;
  }

  /**
   * Carica tutte le strategie
   */
  loadStrategies(activeOnly?: boolean): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.strategyApi.getAll(activeOnly).subscribe({
      next: (strategies) => {
        this.state.setStrategies(strategies);
        this.state.setLoading(false);
      },
      error: (error) => {
        console.error('Failed to load strategies:', error);
        this.state.setError('Failed to load strategies');
        this.state.setLoading(false);
        this.notification.error('Failed to load strategies');
      }
    });
  }

  /**
   * Carica strategie per tipo
   */
  loadByType(type: StrategyType, activeOnly?: boolean): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.strategyApi.getByType(type, activeOnly).subscribe({
      next: (strategies) => {
        this.state.setStrategies(strategies);
        this.state.setLoading(false);
      },
      error: (error) => {
        console.error('Failed to filter strategies:', error);
        this.state.setError('Failed to filter strategies');
        this.state.setLoading(false);
        this.notification.error('Failed to filter strategies');
      }
    });
  }

  /**
   * Ottiene strategia per ID
   */
  getStrategyById(id: number): Observable<Strategy> {
    return this.strategyApi.getById(id).pipe(
      catchError(error => {
        console.error(`Failed to load strategy ${id}:`, error);
        this.notification.error('Failed to load strategy details');
        throw error;
      })
    );
  }

  /**
   * Ottiene usage (con cache)
   */
  getUsage(id: number): Observable<StrategyUsage> {
    // Check cache
    if (this.usageCache.has(id)) {
      return of(this.usageCache.get(id)!);
    }

    // Fetch from API
    return this.strategyApi.getUsage(id).pipe(
      tap(usage => this.usageCache.set(id, usage)),
      catchError(error => {
        console.error(`Failed to load usage for strategy ${id}:`, error);
        // Ritorna usage vuoto in caso di errore
        const emptyUsage: StrategyUsage = {
          strategyId: id,
          strategyCode: '',
          usedByProfiles: [],
          totalUsageCount: 0
        };
        return of(emptyUsage);
      })
    );
  }

  /**
   * Attiva una strategia
   */
  activateStrategy(id: number): Observable<Strategy> {
    return this.strategyApi.activate(id).pipe(
      tap(() => {
        this.notification.success('Strategy activated successfully');
        this.loadStrategies(); // Reload list
      }),
      catchError(error => {
        console.error(`Failed to activate strategy ${id}:`, error);
        this.notification.error('Failed to activate strategy');
        throw error;
      })
    );
  }

  /**
   * Disattiva una strategia
   */
  deactivateStrategy(id: number): Observable<Strategy> {
    return this.strategyApi.deactivate(id).pipe(
      tap(() => {
        this.notification.success('Strategy deactivated successfully');
        this.loadStrategies(); // Reload list
      }),
      catchError(error => {
        console.error(`Failed to deactivate strategy ${id}:`, error);
        this.notification.error('Failed to deactivate strategy');
        throw error;
      })
    );
  }

  /**
   * Elimina una strategia
   */
  deleteStrategy(id: number): Observable<void> {
    return this.strategyApi.deleteStrategy(id).pipe(
      tap(() => {
        this.notification.success('Strategy deleted successfully');
        this.loadStrategies(); // Reload list
        this.usageCache.delete(id); // Clear cache
      }),
      catchError(error => {
        console.error(`Failed to delete strategy ${id}:`, error);
        if (error.status === 409) {
          this.notification.error('Cannot delete strategy - it is currently in use');
        } else {
          this.notification.error('Failed to delete strategy');
        }
        throw error;
      })
    );
  }

  /**
   * Pulisce la cache usage
   */
  clearUsageCache(): void {
    this.usageCache.clear();
  }
}
