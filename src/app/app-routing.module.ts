import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiesComponent } from './cookies/cookies.component';
import { TermsandConditionsComponent } from './termsand-conditions/termsand-conditions.component';
import { GeneralConditionsComponent } from './general-conditions/general-conditions.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { MainCategoryComponent } from './category/main-category/main-category.component';
import { ProductsComponent } from './category/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './Account/sign-in/sign-in.component';
import { MyCardComponent } from './my-card/my-card.component';
import { CategoryComponent } from './category/category/category.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountListComponent } from './account-list/account-list.component';

/* SETTONG MODULE */
import { MyOrderComponent } from './setting/my-order/my-order.component';
import { OrderDetailsComponent } from './setting/my-order/order-details/order-details.component';
import { SaveAddressComponent } from './setting/save-address/save-address.component';
import { EditProfileComponent } from './setting/edit-profile/edit-profile.component';
import { SetPasswordComponent } from './setting/edit-profile/set-password/set-password.component';
import { DeactivatedAccountComponent } from './setting/edit-profile/deactivated-account/deactivated-account.component';
import { SelectLanguageComponent } from './setting/select-language/select-language.component';

/* ORDER MODULES */
import { CustomerInfoComponent } from './Order/customer-info/customer-info.component';
import { RecentViewComponent } from './recent-view/recent-view.component';
import { FeaturedComponent } from './featured/featured.component';
import { SubCategoryComponent } from './category/sub-category/sub-category.component';
import { ContactSupportComponent } from './Order/contact-support/contact-support.component';
import { TOSComponent } from './tos/tos.component';
import { EditAddressComponent } from './Account/edit-address/edit-address.component';
import { SearchListComponent } from './Account/search-list/search-list.component';
import { UnavailableComponent } from './unavailable/unavailable.component';
import { AddAddressComponent } from './Account/add-address/add-address.component';
import { PushNotificationComponent } from './notifications/push-notification/push-notification.component';
import { ConfirmOrderComponent } from './Order/confirm-order/confirm-order.component';
import { HomeComponent } from './home/home.component';
import { LocateMeComponent } from './setting/locate-me/locate-me.component';
import { PlaceorderComponent } from './Order/placeorder/placeorder.component';
import { OffersComponent } from './offers/offers.component';
import { BundleOfferComponent } from './offers/bundle-offer/bundle-offer.component';
import { BagaOfferComponent } from './offers/baga-offer/baga-offer.component';
import { BulkOfferComponent } from './offers/bulk-offer/bulk-offer.component';

const routes: Routes = [
  { path: 'splash-screen', component: SplashScreenComponent },
  { path: 'SignIn', component: SignInComponent },

  { path: 'EditAddress/:userId/:addId/:HubId', component: EditAddressComponent },
  { path: 'Home/:userId', component: HomeComponent },
  { path: 'Notifications/:userId/:HubId', component: NotificationsComponent },
  { path: 'Notifi-setting/:userId/:HubId', component: PushNotificationComponent },
  { path: 'Main-Category/:userId/:HubId', component: MainCategoryComponent },
  { path: 'Main-Category/SubCategory/ProductList/:mncatId/:userId/:HubId/:orderby/:sortId/:catId', component: SubCategoryComponent },
  { path: 'Main-Category/SubCategory/Category/:id/:userId/:HubId', component: CategoryComponent },
  { path: 'Main-Category/SubCategory/Category/Products/:id/:mncatId/:userId/:HubId/:orderby/:sortId/:catId', component: ProductsComponent },
  { path: 'MyCart/:userId/:HubId', component: MyCardComponent },
  { path: 'Wish-list/:userId/:HubId', component: WishListComponent },
  { path: 'search-list/:userId/:value/:HubId', component: SearchListComponent },
  { path: 'AddAddress/:userId/:HubId/:type/:backurl/:cartId', component: AddAddressComponent },
  { path: 'Locateme/:backurl/:cartId', component: LocateMeComponent },
  { path: 'offers/:userId/:HubId', component: OffersComponent },
  { path: 'offers/bundle-offer/:userId/:HubId', component: BundleOfferComponent },
  { path: 'offers/baga-offer/:userId/:HubId', component: BagaOfferComponent },
  { path: 'offers/bulk-offer/:userId/:HubId', component: BulkOfferComponent },


  /* SETTING MODULES */
  { path: 'Account/:userId/:HubId', component: AccountListComponent },
  { path: 'Setting/MyOrder/:userId/:HubId', component: MyOrderComponent },
  { path: 'Setting/MyOrder/Detail/:orderId/:userId/:HubId', component: OrderDetailsComponent },
  { path: 'Setting/SaveAddress/:userId/:HubId', component: SaveAddressComponent },
  { path: 'Setting/EditProfile/:userId/:HubId', component: EditProfileComponent },
  { path: 'Setting/EditProfile/SetPassword/:HubId', component: SetPasswordComponent },
  { path: 'Setting/EditProfile/DeactivatedAccount', component: DeactivatedAccountComponent },
  { path: 'Setting/SelectLanguage/:userId/:HubId', component: SelectLanguageComponent },

  /* ORDER MODULES */
  { path: 'Order/CustomerInfo/:userId/:cartId/:HubId', component: CustomerInfoComponent },
  { path: 'Order/ConfirmOrder/:userId/:cartId/:addId/:transactionId/:HubId',component:ConfirmOrderComponent},
  { path: 'Order/PlaceOrder/:userId/:cartId/:addId/:orderId/:HubId/:delivery/:couponId/:paymentmethod',component:PlaceorderComponent},
  { path: 'recentview/:userId/:HubId', component: RecentViewComponent },
  { path: 'featured-item/:userId/:HubId', component: FeaturedComponent },
  { path: 'Order/contact-support/:userId', component: ContactSupportComponent },

  {path:'TOS',component:TOSComponent},
  {path:'privacy',component:PrivacyPolicyComponent},
  {path:'RefundPolicy',component:RefundPolicyComponent},
  {path:'Cookies',component:CookiesComponent},
  {path:'terms-and-conditions',component:TermsandConditionsComponent},
  {path:'general-conditions-of-sale',component:GeneralConditionsComponent},

  {path:'unavailable',component:UnavailableComponent},
  { path: '', redirectTo: '/splash-screen', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
