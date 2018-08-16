
/**
 * Implementation of the Mock-Backend
 */
import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {employees} from './employees';
import {Employee} from '../model/employee';

 function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    let data: Employee[] = JSON.parse(localStorage.getItem('employees')) || employees;
   
    backend.connections.subscribe((connection: MockConnection) => {
      setTimeout(() => {
        // get all employees
        if (connection.request.url.endsWith('/fake-backend/employees')
            && connection.request.method === RequestMethod.Get) {
              connection.mockRespond(new Response(new ResponseOptions({
                status: 200,
                body: data
              })));

              return;
        }

        // create employee
        if (connection.request.url.endsWith('/fake-backend/employees')
            && connection.request.method === RequestMethod.Post) {
              const receivedEmployee = JSON.parse(connection.request.getBody());
              const newEmployee = Object.assign(receivedEmployee, {id: new Date().getTime()});
              data[data.length] = newEmployee;

              localStorage.setItem('employees', JSON.stringify(data));

              connection.mockRespond(new Response(new ResponseOptions({
                status: 200,
                body: newEmployee
              })));

              return;
        }

        // update employee
        if (connection.request.url.endsWith('/fake-backend/employees')
            && connection.request.method === RequestMethod.Put) {
              const receivedEmployee = JSON.parse(connection.request.getBody());
              const clonedEmployee = Object.assign({}, receivedEmployee);
              let employeeWasFound = false;
              data.some((element: Employee, index: number) => {
                if (element.id === clonedEmployee.id) {
                  data[index] = clonedEmployee;
                  employeeWasFound = true;
                  return true;
                }
              });

              if (!employeeWasFound) {
                connection.mockRespond(new Response (new ResponseOptions({
                  status: 400,
                  body: 'Employee could not be updated because was not found'
                })));
              } else {
                localStorage.setItem('employees', JSON.stringify(data));
                connection.mockRespond(new Response(new ResponseOptions({status: 200})));
              }

              return;
        }

        // delete employee
        if (connection.request.url.match(/\/fake-backend\/employees\/.{36}$/)
            && connection.request.method === RequestMethod.Delete) {
              const urlParts = connection.request.url.split('/');
              const id = urlParts[urlParts.length - 1];
              const sizeBeforeDelete = data.length;
              data = data.filter((element: Employee) => element.id !== id);

              if (sizeBeforeDelete === data.length) {
                connection.mockRespond(new Response(new ResponseOptions({
                  status: 400,
                  body: 'Employee could not be deleted because was not found'
                })));
              } else {
                localStorage.setItem('employees', JSON.stringify(data));
                connection.mockRespond(new Response(new ResponseOptions({
                  status: 200
                })));
              }

              return;
        }

        // pass through any requests not handled above
        const realHttp = new Http(realBackend, options);
        const requestOptions = new RequestOptions({
          method: connection.request.method,
          headers: connection.request.headers,
          body: connection.request.getBody(),
          url: connection.request.url,
          withCredentials: connection.request.withCredentials,
          responseType: connection.request.responseType
        });

        realHttp.request(connection.request.url, requestOptions)
                .subscribe(
                    (response: Response) => {
                      connection.mockRespond(response);
                    },
                    (error: any) => {
                      connection.mockError(error);
                    }
                );
      }, 500);
    });

    return new Http(backend, options);
 }

 export const fakeBackendProvider = {
   // use fake backend in place of Http service
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
 }