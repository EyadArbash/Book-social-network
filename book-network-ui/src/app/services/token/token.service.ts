import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  set token(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    } else {
      console.warn('localStorage ist nicht verfügbar.');
    }
  }

  get token(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      console.warn('localStorage ist nicht verfügbar.');
      return null;
    }
  }

  isTokenNotValid() {
    return !this.istTokenValid();
  }

  private istTokenValid() {
    const token = this.token;
    if (!token){
      return false
    }
    const jwtHelper = new JwtHelperService();
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired){
      localStorage.clear();
      return false;
    }
    return true;
  }
}
