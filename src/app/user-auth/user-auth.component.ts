import { Component } from '@angular/core';
import { login, userSignUp, cart, product } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  showLogin = true;
  authError: string = '';
  users: userSignUp[] = [];

  constructor(private userService: UserService, private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.userService.reloadUser();
    this.userService.getUsers().subscribe((user) => {
      let stringifyUser = JSON.stringify(user);
      let parseUser = JSON.parse(stringifyUser);
      if (parseUser) {
        this.users = parseUser;
      }
    });
  }

  signUp(data: userSignUp): void {
    data.userId = new Date().getTime();
    this.users.push(data);
    this.userService.userSignUp(this.users)
  }

  login(data: login): void {
    this.userService.userlogin(data);
    this.userService.isloginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password isn't correct";
      } else {
        this.product.getUserCartLength();
        this.product.getUserOrdersLength();
      };
    });
  }

  openLoginForm() {
    this.showLogin = true;
  }

  openSignupForm() {
    this.authError = "";
    this.showLogin = false;
  }

}
