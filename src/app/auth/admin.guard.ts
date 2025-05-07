import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether a route can be activated based on admin status.
   * @param route The activated route snapshot.
   * @param state The router state snapshot.
   * @returns True if user is admin, otherwise redirects and returns false.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAdmin()) {
      return true;
    } else {
      // Optionally log the access denial
      console.warn('Access denied - Admins only');

      // Redirect to home page or login page, preserving attempted URL in query params
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });

      // Return false to cancel navigation
      return false;
    }
  }
}
