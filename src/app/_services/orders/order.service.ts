import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/_common/Environment';
import { SalesOrderViewModel } from 'src/app/_common/VM/SalesOrderViewModel';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient, private enviroment: Environment) { }
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  requestOptions = { headers: this.headers };
  // get order by user Id api
  getOrders(userId: any) {
    return this.http.get(this.enviroment.OrderBaseUrl + 'Orders/getOrderByUserId/' + userId);
  }
  // get wishlist by userId api
  getAllWishList(custId: any) {
    return this.http.get(this.enviroment.OrderBaseUrl + 'Wishlist/getWishlistItems/' + custId);
  }
  // place order api
  placeOrder(orderDetails: SalesOrderViewModel) {
    return this.http.post(this.enviroment.OrderBaseUrl + 'Orders/placeOrder', orderDetails, this.requestOptions);
  }
  createOrder(data: any) {
    return this.http.post(this.enviroment.OrderBaseUrl + 'Orders/CreateOrder', data,)
  }
  // sending payment api
  GenerateLink(data: any) {
    return this.http.post(this.enviroment.PaymentApiUrl + 'PayTabs/Generatelink', JSON.stringify(data), this.requestOptions);
  }
  //get transactionId
  getTransaction(userId: any) {
    return this.http.get(this.enviroment.PaymentApiUrl + 'PayTabs/checkTransId/' + userId);
  }
  //check transaction status
  CheckPaymentstatus(transId: any) {
    return this.http.post(this.enviroment.PaymentApiUrl + 'PayTabs/verifyPayment', transId, this.requestOptions);
  }
  // get order details by salesId api
  orderDetails(salesId: any) {
    return this.http.get(this.enviroment.OrderBaseUrl + 'Orders/getOrderDetailbyId/' + salesId, this.requestOptions);
  }
  // cancel order api
  cancelOrder(salesId: any, userId: any) {
    return this.http.post(this.enviroment.OrderBaseUrl + 'Orders/updateOrderStatus/' + userId + '/Cancelled/' + salesId, {}, this.requestOptions);
  }
  // send customer support request api
  addContactSupportrequest(data: any) {
    const myreq = {
      "fullName": "" + data.fullName,
      "email": "" + data.email,
      "message": "" + data.message,
      "createdBy": "" + data.createdBy,
      "customerId": "" + data.customerId,
    }
    return this.http.post(this.enviroment.AccountBaseUrl + 'helpSupport', myreq);
  }
  // update  notification setting api
  updateSetting(setting: any) {
    return this.http.post(this.enviroment.NotificationUrl + 'UpdateNotificationSetting', setting);
  }
  //  get notification details
  getNotificationDetail(userId: any) {
    return this.http.get(this.enviroment.NotificationUrl + 'GetNotificationSetting/' + userId);
  }
  // send email api
  sendEmail(emailData: any) {
    return this.http.post('https://services.automatebuddy.com/api/EmailService/sendEmail', emailData);
  }
  getCouponlist(userId: any, HubId: any) {
    return this.http.get(this.enviroment.OrderBaseUrl + 'Orders/mycoupens/' + userId + '/' + HubId);
    // /mycoupens
  }
}