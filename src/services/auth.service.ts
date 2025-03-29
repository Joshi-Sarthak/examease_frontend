import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserData } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly usersKey = 'registeredUsers';
  private readonly currentUserKey = 'currentUser';
  private storageAvailable: boolean;

  private currentUserSubject: BehaviorSubject<UserData | null>;

  currentUser$: Observable<UserData | null>;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: object) {
    this.storageAvailable = isPlatformBrowser(platformId);
    this.currentUserSubject = new BehaviorSubject<UserData | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getStoredUser(): UserData | null {
    if (!this.storageAvailable) return null;
    return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
  }

  register(username: string, email: string, password: string): boolean {
    if (!this.storageAvailable) return false;

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
    if (!this.storageAvailable) return false;

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
    if (!this.storageAvailable) return;
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isUsernameTaken(username: string): boolean {
    if (!this.storageAvailable) return false;
    const users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return users.some(user => user.username === username);
  }

  isEmailTaken(email: string): boolean {
    if (!this.storageAvailable) return false;
    const users: UserData[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    return users.some(user => user.email === email);
  }
}
