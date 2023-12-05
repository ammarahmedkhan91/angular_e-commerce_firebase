import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { login, sellerSignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl:'./seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {

  showLogin = true;
  authError:string = '';
  sellers: sellerSignUp[] = [];

  constructor(private sellerService:SellerService) {}
  
  ngOnInit():void{
    this.sellerService.reloadSeller();
    this.sellerService.getSellers().subscribe((seller) => {
      let stringifySeller = JSON.stringify(seller);
      let parseSeller = JSON.parse(stringifySeller);
      if (parseSeller) {
        this.sellers = parseSeller;
      }
    });
  }
  
  signUp(data:sellerSignUp):void{
    data.sellerId = new Date().getTime();
    this.sellers.push(data)
    this.sellerService.sellerSignUp(this.sellers)
  }
  
  login(data:login):void{
    this.sellerService.sellerLogin(data)
    this.sellerService.isLoginError.subscribe((isError)=>{
      if (isError) {
        this.authError = "Email or password isn't correct";
      }
    })
  }

  openLoginForm(){
    this.showLogin = true;
  }

  opensignUpForm(){
    this.authError = "";
    this.showLogin = false;
  }

}
