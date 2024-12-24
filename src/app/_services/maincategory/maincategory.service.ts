import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/_common/Environment';

@Injectable({
  providedIn: 'root'
})
export class MaincategoryService {
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  requestOptions = { headers: this.headers };
  constructor(
    private httpClient: HttpClient,
    private enviroment: Environment
    ) { }
  // advance search api
  searchwithmain(mainId: any, value: any, userId: any) {
    return this.httpClient.get('https://villiyantapi.cxengine.net/api/Product/GetAdvanceSerach/' + mainId + '/' + value + '/' + userId); 
 //   return this.httpClient.get('http://localhost:5114/api/Product/GetAdvanceSerach/' + mainId + '/' + value + '/' + userId); 
    // return this.httpClient.get(this.enviroment.ProductBaseUrl + 'GetAdvanceSerach/' + mainId + '/' + value + '/' + userId);
  }
  // get all product by main cartegory api
  getmaincategory(type: any, userId: any) {
    return this.httpClient.get(this.enviroment.ProductBaseUrl + 'GetMainCategory/' + type + '/' + userId);
  }
  // get all product list api
  getproductbycategory(catId: any, userId: any) {
    return this.httpClient.get(this.enviroment.ProductBaseUrl + 'GetProductByMainCategory/' + catId + '/All?userId=' + userId);
  }
  // sort product api
  sortcategory(sorting: any) {
     return this.httpClient.post('https://villiyantapi.cxengine.net/api/Product/GetProductSorting', {
   // return this.httpClient.post('http://localhost:5114/api/Product/GetProductSorting', {
      "orderby": "" + sorting.orderby,
      "columnName": "p.SellingPrice",
      "maincatId": "" + sorting.maincatId,
      "sortId": "" + sorting.sortId,
      "catId": sorting.catId,
      "userId": sorting.userId
    }, this.requestOptions);
  }

//   return this.httpClient.post(this.enviroment.ProductBaseUrl + 'GetProductSorting', {
//     "orderby": "" + sorting.orderby,
//     "columnName": "p.SellingPrice",
//     "maincatId": "" + sorting.maincatId,
//     "sortId": "" + sorting.sortId,
//     "catId": sorting.catId,
//     "userId": sorting.userId
//   }, this.requestOptions);
// }
}
