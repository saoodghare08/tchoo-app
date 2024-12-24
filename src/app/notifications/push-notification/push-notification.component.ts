import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/_services/orders/order.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotificationSettingDTOs } from 'src/app/_common/DTOs/AccountSetting/NotificationSettingDTOs';
import { ProductService } from '../../_services/product/product.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  viewMode = 'Push';
  isMyOrderAllowed: boolean = false;
  checkAllMyOrder: boolean = false
  createdBy: any = this.activatedRoute.snapshot.params['userId'];
  userdetails: any;
  selectedlanguage: any = "English";
  NotifyDetails: any = []
  constructor(
    private ProductService: ProductService, 
    private fb: FormBuilder, 
    private orderservice: OrderService, 
    private activatedRoute: ActivatedRoute,
    private app:AppComponent
  ) { }
  ngOnInit(): void {
    this.getuserdetails();
  }
  // get user details
  getuserdetails() {
    this.app.commonLoader=true;
    this.ProductService.getuserdetails(this.createdBy).subscribe({
      next:(data) => {
        this.userdetails = data;
        this.selectedlanguage = this.userdetails.language
      },error:(err)=> {
        // console.log(err);
        this.app.commonLoader=false;
      },complete:()=> {
        this.getNotificationDetail();
      },
    });
  }
  Allsettings: NotificationSettingDTOs = {
    id: 0,
    userId: '',
    orders_ItemInCart: false,
    orders_PaymentCreditInsurance: false,
    orders_SubscriptionQuestionAns: false,
    recommendations_YourInterests: false,
    recommendations_YourPurchase: false,
    offers_Welcome: false,
    offers_DealsDiscount: false,
    offers_Occasional: false,
    support_QueryReply: false,
    support_QueryStatus: false,
    createdDate: '',
    updatedDated: '',
    myOrder: undefined,
    recommendation: undefined,
    offers: undefined,
    support: undefined
  }
  Myorders = [
    { name: 'Item in cart', value: 'orders_ItemInCart', selected: false },
    { name: 'Reminders for payments, credit and insurance', value: 'orders_PaymentCreditInsurance', selected: false },
    { name: 'Notify me for subscriptions and answered questions', value: 'orders_SubscriptionQuestionAns', selected: false },
  ]
  Recommend = [
    { name: 'Offers based on your interests', value: 'recommendations_YourInterests', selected: false },
    { name: 'Offers to complement your purchases, credit and insurance', value: 'recommendations_YourPurchase', selected: false },
  ]
  Offer = [
    { name: 'Welcome offers', value: 'offers_Welcome', selected: false },
    { name: 'Offers to complement your purchases, credit and insurance', value: 'offers_DealsDiscount', selected: false },
    { name: 'Notify me for subscriptions and answered questions', value: 'offers_Occasional', selected: false },
  ]
  Support = [
    { name: 'Feedback on product', value: 'support_QueryReply', selected: false },
    { name: 'Answer questions by your fellow buyers', value: 'support_QueryStatus', selected: false },
  ]
  settingdetails = this.fb.group({
    userId: [this.Allsettings.userId],
    orders_ItemInCart: [this.Allsettings.orders_ItemInCart],
    orders_PaymentCreditInsurance: [this.Allsettings.orders_PaymentCreditInsurance],
    orders_SubscriptionQuestionAns: [this.Allsettings.orders_SubscriptionQuestionAns],
    recommendations_YourInterests: [this.Allsettings.recommendations_YourInterests],
    recommendations_YourPurchase: [this.Allsettings.recommendations_YourPurchase],
    offers_Welcome: [this.Allsettings.offers_Welcome],
    offers_DealsDiscount: [this.Allsettings.offers_DealsDiscount],
    offers_Occasional: [this.Allsettings.offers_Occasional],
    support_QueryReply: [this.Allsettings.support_QueryReply],
    support_QueryStatus: [this.Allsettings.support_QueryStatus],
    myOrder: [this.Allsettings.myOrder],
    recommendation: [this.Allsettings.recommendation],
    offers: [this.Allsettings.offers],
    support: [this.Allsettings.support],

  })
  getNotificationDetail() {
    this.orderservice.getNotificationDetail(this.createdBy).subscribe({
      next:(res: any) => {
        this.NotifyDetails = res
        this.Myorders = [
          { name: 'Item in cart', value: 'orders_ItemInCart', selected: this.NotifyDetails.orders_ItemInCart == true ? true : false },
          { name: 'Reminders for payments, credit and insurance', value: 'orders_PaymentCreditInsurance', selected: this.NotifyDetails.orders_PaymentCreditInsurance == true ? true : false },
          { name: 'Notify me for subscriptions and answered questions', value: 'orders_SubscriptionQuestionAns', selected: this.NotifyDetails.orders_SubscriptionQuestionAns == true ? true : false },
        ],
          this.Recommend = [
            { name: 'Offers based on your interests', value: 'recommendations_YourInterests', selected: this.NotifyDetails.recommendations_YourInterests == true ? true : false },
            { name: 'Offers to complement your purchases, credit and insurance', value: 'recommendations_YourPurchase', selected: this.NotifyDetails.recommendations_YourPurchase == true ? true : false },
          ]
        this.Offer = [
          { name: 'Welcome offers', value: 'offers_Welcome', selected: this.NotifyDetails.offers_Welcome == true ? true : false },
          { name: 'Offers to complement your purchases, credit and insurance', value: 'offers_DealsDiscount', selected: this.NotifyDetails.offers_DealsDiscount == true ? true : false },
          { name: 'Notify me for subscriptions and answered questions', value: 'offers_Occasional', selected: this.NotifyDetails.offers_Occasional == true ? true : false },
        ]
        this.Support = [
          { name: 'Feedback on product', value: 'support_QueryReply', selected: this.NotifyDetails.support_QueryReply == true ? true : false },
          { name: 'Answer questions by your fellow buyers', value: 'support_QueryStatus', selected: this.NotifyDetails.support_QueryStatus == true ? true : false },
        ]
      },error:(err)=> {
        // console.log(err);
        this.app.commonLoader=false;
      },complete:()=> {
        this.app.commonLoader=false;
      }
    });
  }
  SettingOrderList(event: any) {
    this.settingdetails.value.userId = this.createdBy
    if (this.NotifyDetails.orders_ItemInCart == true) {
      this.settingdetails.value.orders_ItemInCart = this.NotifyDetails.orders_ItemInCart
    }
    if (this.NotifyDetails.orders_PaymentCreditInsurance == true) {
      this.settingdetails.value.orders_PaymentCreditInsurance = this.NotifyDetails.orders_PaymentCreditInsurance
    }
    if (this.NotifyDetails.orders_SubscriptionQuestionAns == true) {
      this.settingdetails.value.orders_SubscriptionQuestionAns = this.NotifyDetails.orders_SubscriptionQuestionAns
    }
    if (event.target.name == 'orders_ItemInCart') {
      this.settingdetails.value.orders_ItemInCart = event.target.checked
    }
    if (event.target.name == 'orders_PaymentCreditInsurance') {
      this.settingdetails.value.orders_PaymentCreditInsurance = event.target.checked
    }
    if (event.target.name == 'orders_SubscriptionQuestionAns') {
      this.settingdetails.value.orders_SubscriptionQuestionAns = event.target.checked
    }

    if (this.settingdetails.value.orders_SubscriptionQuestionAns == true && this.settingdetails.value.orders_PaymentCreditInsurance == true && this.settingdetails.value.orders_ItemInCart == true) {
      this.settingdetails.value.myOrder = this.NotifyDetails.myOrder
    }
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  allowAllOrders(event: any) {
    const checked = event.target.checked;
    this.settingdetails.value.userId = this.createdBy
    this.settingdetails.value.orders_ItemInCart = checked
    this.settingdetails.value.orders_PaymentCreditInsurance = checked
    this.settingdetails.value.orders_SubscriptionQuestionAns = checked
    this.Myorders.forEach((item: { selected: any; }) => item.selected = checked);
    this.settingdetails.value.myOrder = checked
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  SetRecommendList(event: any) {
    this.settingdetails.value.userId = this.createdBy
    if (this.NotifyDetails.recommendations_YourInterests == true) {
      this.settingdetails.value.recommendations_YourInterests = this.NotifyDetails.recommendations_YourInterests
    }
    if (this.NotifyDetails.recommendations_YourPurchase == true) {
      this.settingdetails.value.recommendations_YourPurchase = this.NotifyDetails.recommendations_YourPurchase
    }
    if (event.target.name == 'recommendations_YourInterests') {
      this.settingdetails.value.recommendations_YourInterests = event.target.checked
    }
    if (event.target.name == 'recommendations_YourPurchase') {
      this.settingdetails.value.recommendations_YourPurchase = event.target.checked
    }
    if (this.settingdetails.value.recommendations_YourInterests == true && this.settingdetails.value.recommendations_YourPurchase == true) {
      this.settingdetails.value.recommendation = this.NotifyDetails.recommendation
    }
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  allowAllRecommend(event: any) {
    const checked = event.target.checked;
    this.settingdetails.value.userId = this.createdBy
    this.settingdetails.value.recommendations_YourInterests = checked
    this.settingdetails.value.recommendations_YourPurchase = checked
    this.Recommend.forEach((item: { selected: any; }) => item.selected = checked);
    this.settingdetails.value.recommendation = checked
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  SetOfferList(event: any) {
    this.settingdetails.value.userId = this.createdBy
    if (this.NotifyDetails.offers_Welcome == true) {
      this.settingdetails.value.offers_Welcome = this.NotifyDetails.offers_Welcome
    }
    if (this.NotifyDetails.offers_DealsDiscount == true) {
      this.settingdetails.value.offers_DealsDiscount = this.NotifyDetails.offers_DealsDiscount
    }
    if (this.NotifyDetails.offers_Occasional == true) {
      this.settingdetails.value.offers_Occasional = this.NotifyDetails.offers_Occasional
    }
    if (event.target.name == 'offers_Welcome') {
      this.settingdetails.value.offers_Welcome = event.target.checked
    }
    if (event.target.name == 'offers_DealsDiscount') {
      this.settingdetails.value.offers_DealsDiscount = event.target.checked
    }
    if (event.target.name == 'offers_Occasional') {
      this.settingdetails.value.offers_Occasional = event.target.checked
    }
    if (this.settingdetails.value.offers_Welcome == true && this.settingdetails.value.offers_DealsDiscount == true && this.settingdetails.value.offers_Occasional == true) {
      this.settingdetails.value.offers = this.NotifyDetails.offers
    }
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  allowAllOffer(event: any) {
    const checked = event.target.checked;
    this.settingdetails.value.userId = this.createdBy
    this.settingdetails.value.offers_DealsDiscount = checked
    this.settingdetails.value.offers_Occasional = checked
    this.settingdetails.value.offers_Welcome = checked
    this.Offer.forEach((item: { selected: any; }) => item.selected = checked);
    this.settingdetails.value.offers = checked
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  SetSupportList(event: any) {
    this.settingdetails.value.userId = this.createdBy
    if (this.NotifyDetails.support_QueryReply == true) {
      this.settingdetails.value.support_QueryReply = this.NotifyDetails.support_QueryReply
    }
    if (this.NotifyDetails.support_QueryStatus == true) {
      this.settingdetails.value.support_QueryStatus = this.NotifyDetails.support_QueryStatus
    }
    if (event.target.name == 'support_QueryReply') {
      this.settingdetails.value.support_QueryReply = event.target.checked
    }
    if (event.target.name == 'support_QueryStatus') {
      this.settingdetails.value.support_QueryStatus = event.target.checked
    }
    if (this.settingdetails.value.support_QueryStatus == true && this.settingdetails.value.support_QueryReply == true) {
      this.settingdetails.value.support = this.NotifyDetails.support
    }
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
  allowAllSupport(event: any) {
    const checked = event.target.checked;
    this.settingdetails.value.userId = this.createdBy
    this.settingdetails.value.support_QueryReply = checked
    this.settingdetails.value.support_QueryStatus = checked
    this.Support.forEach((item: { selected: any; }) => item.selected = checked);
    this.settingdetails.value.support = checked
    this.orderservice.updateSetting(this.settingdetails.value).subscribe((res: any) => {
    });
  }
}