import { Environment } from 'src/app/_common/Environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: any[] = [];
  address: any = [];
  paymentHandler: any = null;
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json;charset=utf-8',
    //'Authorization': `Bearer ${auth_token}`
  });
  requestOptions = { headers: this.headers };
  constructor(private http: HttpClient, private router: Router,private enviroment:Environment) {
  }
  // get user details api
  getuserdetails(created: any) {
    return this.http.get(this.enviroment.AccountBaseUrl + 'GetUserByUserId?userId=' + created);
  }
  // get product details api
  ProductDetails(product: any) {
    this.router.navigate(['orderdetails']);
    return this.products = product;
  }
  // get category list
  getMainCategory() {
    return this.http.get(this.enviroment.ProductBaseUrl + 'MainCategory');
  }
  // get product details api
  getProductDetail(productId: string, createdBy:any) {
    // return this.http.get(this.enviroment.ProductBaseUrl + 'GetProductDetail/' + productId + '/' + createdBy);
    return this.http.get(this.enviroment.ProductBaseUrl+ 'GetProductDetail/' + productId + '/' + createdBy);
  }
  //get cart item details by Id api
  getitemdetails(cartid: string, createdby: any) {
    return this.http.get(this.enviroment.OrderBaseUrl  + 'MyCart/getMycartById/' + createdby + '/' + cartid);
  }
  // get featured product list api
  getFeaturedProducts(type: string, userId:any) {
    return this.http.get(this.enviroment.ProductBaseUrl+'GetFeaturedProducts/' + type + '/' + userId);
  }
  // get recently viewed item api
  getRecenltyviewItems(userId: string, type: string) {
    return this.http.get(this.enviroment.ProductBaseUrl+'GetRecentlyViewedProducts/' + userId + '/' + type);
    // return this.http.get(this.enviroment.ProductBaseUrl  + 'GetRecentlyViewedProducts/' + userId + '/' + type);
  }
  // post viewed items
  addViewItems(userid: any, itemid: any): Observable<any> {
    return this.http.post(this.enviroment.ProductBaseUrl  + 'ViewedProduct/' + userid + '/' + itemid, {}, this.headers);
  }
  // get top banner details
  getTopBannerList(hubId:any) {
    return this.http.get(this.enviroment.ProductBaseUrl  + 'GetBannerLists/'+hubId+'/SB');
  }
  // get bottom banner details
  getBottomBannerList(hubId:any) {
    return this.http.get(this.enviroment.ProductBaseUrl  + 'GetBannerLists/'+hubId+'/BMC');
  }
  // add to cart api
  addtoCart(userInfo: any): Observable<any> {
    const mydata={
      "itemId": "" + userInfo.itemId,
      "quantity": "" + userInfo.quantity,
      "pattern": "" + userInfo.varient,
      "price": "" + userInfo.price,
      "createdby": "" + userInfo.createdby,
      "sellingPrice": "" + userInfo.sellingPrice
    }
    return this.http.post(this.enviroment.OrderBaseUrl + 'MyCart/addtoCart',mydata );
  }
  // edit cart api
  editCart(id: number, item: any) {
    return this.http.put(this.enviroment.OrderBaseUrl  + 'MyCart/' + id, item);
  }
  // delet Item From Cart api
  deletItemFromCart(id: number) {
    return this.http.delete(this.enviroment.OrderBaseUrl  + 'MyCart/' + id);
  }
  // get all cart products
  getCartItems(userId: any) {
    return this.http.get(this.enviroment.OrderBaseUrl  + 'MyCart/getMycartByUser/' + userId);
  }
  // update profile
  editProfile(userdata:any,contactdata:any){
    const formdata={
      "userId": userdata.userID,
      "fullName": userdata.fullName,
      "countryShortCode": contactdata.phone.countryCode,
      "countryDialCode": contactdata.phone.dialCode,
      "phoneNumber": contactdata.phone.number
    }
    return this.http.post(this.enviroment.AccountBaseUrl +'updateProfile', formdata);
  }
  sendOtp(userdata:any,contactdata:any){
    const formdata={
        "userId": userdata.userID,
        "countryShortCode": contactdata.phone.countryCode,
        "countryDialCode": contactdata.phone.dialCode,
        "phoneNumber": contactdata.phone.number
      }
    return this.http.post(`${this.enviroment.AccountBaseUrl}sendOTP`,formdata);
  }
  otpVerification(userId:any,otp:any){
    return this.http.post(`${this.enviroment.AccountBaseUrl}verifyContactNo/${userId}/${otp}`,{});
  }
}
