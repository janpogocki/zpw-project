import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {ProductsProviderService} from '../../../../src/app/products-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any;
  userRole: number;
  userName: string;

  public firebaseDataLoaded = false;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore,
              private productsProviderService: ProductsProviderService) {
    this.authState = null;
    this.userRole = null;

    this.afAuth.authState.subscribe((auth) => this.authState = auth);
  }

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false;
  }

  get isUserEmailLoggedIn(): boolean {
    return (this.authState !== null) && (!this.isUserAnonymousLoggedIn);
  }

  getUserRole(): number {
    return this.userRole;
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

  getFirebaseStatusDocument(): Promise<boolean> {
    const backendDb = this.db.collection('backend');

    return backendDb
      .doc('backend').ref.get()
      .then(doc => doc.data().firebase);
  }

  changeBackend(): Promise<any> {
    const backendDb = this.db.collection('backend');

    return backendDb
      .doc('backend')
      .update({firebase: !this.productsProviderService.firebaseBackendActive})
      .then(() => this.productsProviderService.firebaseBackendActive = !this.productsProviderService.firebaseBackendActive);
  }
}
