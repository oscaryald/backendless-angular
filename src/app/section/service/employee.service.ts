import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {Employee} from '../../model/employee';
import { HttpClient } from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';


@Injectable()
export class EmployeeService {
  private static handleError(error: Response | any) {

      let errMsg: string;
      if (error instanceof Response) {
          if (error.status === 404) {
              errMsg = `Resource ${error.url} was not found`;
          } else {
              const body = error.json() || '';
              const err = body.error || JSON.stringify(body);
              errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
          }
      } else {
          errMsg = error.message ? error.message : error.toString();
      }

      return Observable.throw(errMsg);
  }

  constructor(private http: Http) {
  }
    
  getEmployees() {
      return this.http.get('/fake-backend/employees')
                      .pipe(
                        map(response => response.json() as Employee[]),
                        catchError(EmployeeService.handleError)
                      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
      return this.http.post('/fake-backend/employees', employee)
                      .pipe(
                        map(response => response.json() as Employee),
                        catchError(EmployeeService.handleError)
                      );
  }

  updateEmployee(employee: Employee): Observable<any> {
      return this.http.put('/fake-backend/employees', employee)
                      .pipe(
                        map(response => response.json() as Employee),
                        catchError(EmployeeService.handleError)
                      );
  }

  deleteEmployee(id: string): Observable<any> {
      return this.http.delete('/fake-backend/employees/' + id)
                      .pipe(
                        map(response => response.json() as Employee),
                        catchError(EmployeeService.handleError)
                      );
  }
}