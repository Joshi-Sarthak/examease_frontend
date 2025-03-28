import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usersKey = 'registeredUsers';
  private readonly currentUserKey = 'currentUser';

  private currentUserSubject = new BehaviorSubject<UserData | null>(this.getStoredUser());
  currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  private getStoredUser(): UserData | null {
    return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
  }

  register(username: string, email: string, password: string): boolean {
    let users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    if (users.some(user => user.username === username)) {
      alert('Username already taken.');
      return false;
    }
    if (users.some(user => user.email === email)) {
      alert('Email already registered.');
      return false;
    }

    const newUser: UserData = {
      userId: Date.now().toString(),
      username,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    const users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    } else {
      alert('Invalid username or password.');
      return false;
    }
  }

  getUser(): Observable<UserData | null> {
    return this.currentUser$;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isUsernameTaken(username: string): boolean {
    const users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return users.some(user => user.username === username);
  }

  isEmailTaken(email: string): boolean {
    const users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return users.some(user => user.email === email);
  }
}
