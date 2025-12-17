import {inject, Injectable} from '@angular/core';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastr = inject(NbToastrService);

  private readonly defaultDuration = environment.notifications.duration;
  private readonly defaultPosition = environment.notifications.position as NbGlobalPhysicalPosition;

  /**
   * Show success notification
   */
  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title, {
      duration: this.defaultDuration,
      position: this.defaultPosition,
      icon: 'checkmark-circle-outline',
      status: 'success'
    });
  }

  /**
   * Show error notification
   */
  error(message: string, title: string = 'Error'): void {
    this.toastr.danger(message, title, {
      duration: this.defaultDuration,
      position: this.defaultPosition,
      icon: 'alert-circle-outline',
      status: 'danger'
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title, {
      duration: this.defaultDuration,
      position: this.defaultPosition,
      icon: 'alert-triangle-outline',
      status: 'warning'
    });
  }

  /**
   * Show info notification
   */
  info(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title, {
      duration: this.defaultDuration,
      position: this.defaultPosition,
      icon: 'info-outline',
      status: 'info'
    });
  }

  /**
   * Show custom notification with manual configuration
   */
  custom(
    message: string,
    title: string,
    config: {
      status?: 'success' | 'danger' | 'warning' | 'info' | 'primary';
      duration?: number;
      icon?: string;
    }
  ): void {
    this.toastr.show(message, title, {
      duration: config.duration || this.defaultDuration,
      position: this.defaultPosition,
      icon: config.icon,
      status: config.status || 'primary'
    });
  }
}
