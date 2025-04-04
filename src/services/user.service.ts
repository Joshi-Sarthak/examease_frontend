import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/user';

  constructor(private http: HttpClient) {}

  editUser(userId: string, updates: Partial<UserData>): Observable<UserData> {
    const payload = { userId, ...updates };
    console.log('Sending edit user payload:', payload);

    return this.http.put<{ message: string; user?: UserData; error?: string }>(`${this.apiUrl}/edit`, payload).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return response.user!;
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    const payload = { userId };
    console.log('Sending delete user payload:', payload);

    return this.http.delete<{ message: string; error?: string }>(`${this.apiUrl}/delete`, { body: payload }).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return response;
      }),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(err: any) {
    console.error('HTTP Error:', err);
    return throwError(() => err.error?.error || 'Something went wrong');
  }
}