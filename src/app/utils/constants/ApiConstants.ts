export class ApiConstants {

  private BASE_URL = 'http://localhost:8080/api';

  private VERSION_1 = '/v1';
  public STRATEGIES = this.BASE_URL + this.VERSION_1 + '/strategies';
  // AUTH
  private AUTH = this.BASE_URL + this.VERSION_1 + '/auth';
  public LOGIN = this.AUTH + '/login';
  public REFRESH = this.AUTH + '/refresh';
  public REGISTER = this.AUTH + '/register';


}

