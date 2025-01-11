import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenService} from '../token/token.service';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService) {
    console.log('HttpTokenInterceptor wurde geladen');
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.token;
    console.log('Interceptor: Token gefunden:', token); // Debug-Ausgabe

    const clonedRequest = token
      ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      : request;

    console.log('Interceptor: Anfrage angepasst:', clonedRequest); // Debug-Ausgabe

    return next.handle(clonedRequest);
  }
}
