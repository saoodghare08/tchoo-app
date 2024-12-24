import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Environment } from 'src/app/_common/Environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  requestOptions = { headers: this.headers };
  constructor(
    private httpClient: HttpClient,
    private enviroment: Environment
  ) { }
  // get product list api top 5
  getcategorybyId(categoryId: any, userId: any,itemid:any) {
    // return this.httpClient.get(this.enviroment.ProductBaseUrl + 'GetProductByMainCategory/' + categoryId + '/top5?userId=' + userId+'&itemId='+itemid);
    return this.httpClient.get('https://villiyantapi.cxengine.net/api/Product/GetProductByMainCategory/' + categoryId + '/top5?userId=' + userId+'&itemId='+itemid);
   // return this.httpClient.get('http://localhost:5114/api/Product/GetProductByMainCategory/' + categoryId + '/top5?userId=' + userId+'&itemId='+itemid);
  }
  // get product by category
  getcategory(id: any, userid: any) {
    return this.httpClient.get(this.enviroment.ProductBaseUrl + 'GetCategory/' + id + '/' + userid);
  }
  // add to wishlist api
  addWishList(data: any) {
    if (data.pluName == undefined) {
      data.pluName = data.prodName
    }
    if (data.sellingPrice == undefined) {
      data.sellingPrice = data.pattern
    }
    if(data.priceId == undefined){
      data.priceId=data.pattern
    }
    // AB0069 start create ne variable wishlistdata and adding json data also add new filed imagePath is string
    var wishlistdata={
      "itemId": "" + data.itemId,
      "pluName": "" + data.pluName,
      "description": "" + data.description,
      "sellingPrice": "" + data.sellingPrice,
      "priceId": "" + data.priceId,
      "quantity": 1,
      "customerId": data.customerId,
      "addedby": "" + data.customerId,
      "addeddate": "2023-01-11T07:33:10.562Z",
      "imagePath": "string"
    }
    // AB0069 end
    return this.httpClient.post(this.enviroment.OrderBaseUrl + 'Wishlist/addWishlistItem', wishlistdata);
  }
  // remove from wishlist api
  removeWishlist(id: any) {
    return this.httpClient.post(this.enviroment.OrderBaseUrl + 'Wishlist/deleteWishlistItem/' + id, this.requestOptions)
  }
}
