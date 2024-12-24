import { Environment } from 'src/app/_common/Environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SalesOrderViewModel } from '../_common/VM/SalesOrderViewModel';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor(private http: HttpClient, private enviroment: Environment) { }
  baseUrl: any = this.enviroment.localBaseUrl;
  apiUrl: any = this.enviroment.OrderBaseUrl;
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
    //'Authorization': `Bearer ${auth_token}`
  });
  requestOptions = { headers: this.headers };
  private cartCount$ = new BehaviorSubject<any>({});
  cartCountBool$ = this.cartCount$.asObservable();

  private details$ = new BehaviorSubject<any>({});
  detailsBool$ = this.details$.asObservable();

  getdetails(data: any) {
    this.details$.next(data);
  }

  updateCartCount(data: any) {
    this.cartCount$.next(data);
  }
  //recently viewed items
  addViewItem(data: any) {
    return this.http.post(this.baseUrl + 'recentViewedProduct', data);
  };
  getViewItem(userId: any) {
    return this.http.get(this.baseUrl + 'recentViewedProduct');
  }
  //mycart CRUD operations
  addtoCart(item: any) {
    return this.http.post(this.baseUrl + 'mycart', item);
  }
  UpdateQuantPrice(id: any, data: any) {
    const updatedata = {
      "id": id,
      "cartId": "" + data.cartId,
      "itemId": "" + data.itemId,
      "prodName": "" + data.prodName,
      "price": "" + data.price,
      "description": "" + data.description,
      "quantity": data.quantity,
      "pattern": "" + data.pattern,
      "createdby": "" + data.createdby,
      "sellingPrice": "" + data.sellingPrice,
      "createdOn": "2023-01-11T07:33:10.562Z"
    }
    return this.http.post(this.apiUrl + 'MyCart/updateCartItem/' + id, updatedata);
  }
  // remove product from cart api
  RemoveProdFromCart(id: string, userid: any) {
    return this.http.post(this.apiUrl + 'MyCart/deleteCartItemBy/' + id + '/' + userid, this.requestOptions);
  }
  // get cart details
  getCartItems(userId: any) {
    // return this.http.get(this.apiUrl + 'MyCart/getMycartByUser/' + userId);
    return this.http.get(this.apiUrl + 'MyCart/getMycartByUser-app/' + userId);
  }
  // add Address service
  AddAddress(addressdata: any): Observable<any> {
    const mydata = {
      "id": addressdata.id,
      "addId": "" + addressdata.addId,
      "customerId": "" + addressdata.customerId,
      "firstName": "" + addressdata.firstName,
      "lastName": "" + addressdata.lastName,
      "email": "" + addressdata.email,
      "contact": "" + addressdata.contact,
      "alternativeContact": "" + addressdata.alternativeContact,
      "buildingName": "" + addressdata.buildingName,
      "roomNo": "" + addressdata.roomNo,
      "sector": "" + addressdata.sector,
      "locality": "" + addressdata.locality,
      "landmark": "" + addressdata.landmark,
      "zipCode": "" + addressdata.zipCode,
      "city": "" + addressdata.city,
      // "state": "" + addressdata.state,
      "state": "",
      "country": "" + addressdata.country,
      "createdOn": "2023-01-11T07:33:10.562Z",
      "createdBy": "" + addressdata.createdBy,
      "lastUpdatedOn": "2023-01-11T07:33:10.562Z",
      "lastUpdatedBy": "" + addressdata.lastUpdatedBy,
      "type": "" + addressdata.type,
      "addressType": "" + addressdata.addressType,
      "hub": "" + addressdata.hub
    }
    // console.log(mydata)
    return this.http.post(this.apiUrl + 'UserInfo/addAddress', mydata, this.requestOptions);
  }
  // update address
  Updateadd(addId: any, addressdata: any) {
    const mydata = {
      "id": addressdata.id,
      "addId": "" + addressdata.addId,
      "customerId": "" + addressdata.createdBy,
      "buildingName": "na",
      "roomNo": "NA",
      "sector": "NA",
      "locality": "" + addressdata.locality,
      "landmark": ""+ addressdata.landmark,
      "zipCode": "" + addressdata.zipCode,
      "city": "" + addressdata.city,
      // "state": "" + addressdata.state,
      "state": "",
      "country": "" + addressdata.country,
      "createdOn": "2023-01-31T06:21:59.023Z",
      "createdBy": "" + addressdata.createdBy,
      "lastUpdatedOn": "2023-01-31T06:21:59.023Z",
      "lastUpdatedBy": "" + addressdata.createdBy,
      "type": "" + addressdata.type,
      "addressType": "" + addressdata.addressType,
      "hub": "HID01",
      "firstName": "" + addressdata.firstName,
      "lastName": "" + addressdata.lastName,
      "email": "" + addressdata.email,
      "contact": "" + addressdata.contact,
      "alternativeContact": ""+ addressdata.alternativeContact
    }
    return this.http.post(this.apiUrl + 'UserInfo/updateAddress/' + addId, mydata, this.requestOptions);
  }
  // get addresslist by userid api
  getAddress(userid: any) {
    return this.http.get(this.apiUrl + 'UserInfo/getAddressByUser/' + userid);
  }
  // check zipcode serviceable api
  getHub(zipcode: any) {
    return this.http.get(this.enviroment.AccountBaseUrl + 'checkBranch/' + zipcode);
  }
  // delete address
  deleteadd(userid: any) {
    return this.http.post(this.apiUrl + 'UserInfo/deleteAddress/' + userid, {});
  }
  // set address default
  setDefault(userid: any, type: any, addId: any) {
    return this.http.post(this.apiUrl + 'UserInfo/SetDefaultAddress/' + userid + '/Default/' + addId, {});
  }
  // get address by address Id api
  getAddressById(id: any) {
    return this.http.get(this.apiUrl + 'UserInfo/addressDetails/' + id);
  }
  BuyNow(orderDetails: SalesOrderViewModel) {
    return this.http.post(this.apiUrl + 'Orders/placeOrder', JSON.stringify(orderDetails), this.requestOptions);
  }
  //get tax , discount , shipping charges api
  getTaxValue(hubId: any, type: any, CouponCode: any, ZipCode: any,cartId:any) {
    return this.http.get(this.enviroment.OrderBaseUrl + 'Orders/GetTaxValueForOrder/' + hubId + '/' + type + '/' + encodeURIComponent(CouponCode) + '/' + ZipCode+'?cartId='+cartId)
  }
  // get locate address from api
  getuserlocation(userId:any){
    return this.http.get(this.enviroment.AccountBaseUrl + 'GetUserLocation/' +userId)
  }
  // apply coupen
  applyCouen(userId:any,coupen:any){
    return this.http.post(this.apiUrl + `MyCart/applyCoupen/${userId}/${encodeURIComponent(coupen)}`,{});
  }
}