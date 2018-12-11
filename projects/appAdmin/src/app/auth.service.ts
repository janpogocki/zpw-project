import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any;
  userRole: number;
  userName: string;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore) {
    this.authState = null;
    this.userRole = null;

    this.afAuth.authState.subscribe((auth) => this.authState = auth);
  }

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false;
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : '';
  }

  get currentUserName(): string {
    return this.authState['email'];
  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    return (this.authState !== null) && (!this.isUserAnonymousLoggedIn);
  }

  getUserRole(): number {
    return this.userRole;
  }

  signUpWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => this.authState = user)
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.getUserDocument(email)
          .then((role) => {
            this.userRole = role;
            this.userName = user.user.email;
            return this.authState = user;
          });
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  private getUserDocument(user: string): Promise<number> {
    const userDb = this.db.collection('users');

    return userDb
      .doc(user).ref.get()
      .then(doc => doc.data().role);
  }

  signOut(): Promise<void> {
    this.userRole = null;
    this.authState = null;
    return this.afAuth.auth.signOut();
  }
}
