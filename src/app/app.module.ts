import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './Account/sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyCardComponent } from './my-card/my-card.component';
import { AddAddressComponent } from './Account/add-address/add-address.component';
import { ProductService } from './_services/product/product.service';
import { SubCategoryComponent } from './category/sub-category/sub-category.component';
import { MainCategoryComponent } from './category/main-category/main-category.component';
import { CategoryComponent } from './category/category/category.component';
import { BottomLayoutComponent } from './bottom-layout/bottom-layout.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountListComponent } from './account-list/account-list.component';
import { MyOrderComponent } from './setting/my-order/my-order.component';
import { OrderDetailsComponent } from './setting/my-order/order-details/order-details.component';
import { SaveAddressComponent } from './setting/save-address/save-address.component';
import { EditProfileComponent } from './setting/edit-profile/edit-profile.component';
import { SetPasswordComponent } from './setting/edit-profile/set-password/set-password.component';
import { DeactivatedAccountComponent } from './setting/edit-profile/deactivated-account/deactivated-account.component';
import { SelectLanguageComponent } from './setting/select-language/select-language.component';
import { CustomerInfoComponent } from './Order/customer-info/customer-info.component';
import { ToastrModule } from 'ngx-toastr';
import { RecentViewComponent } from './recent-view/recent-view.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeaturedComponent } from './featured/featured.component';
import { ContactSupportComponent } from './Order/contact-support/contact-support.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TOSComponent } from './tos/tos.component';
import { RefundPolicyComponent } from './refund-policy/refund-policy.component';
import { Environment } from './_common/Environment';
import { CookiesComponent } from './cookies/cookies.component';
import { TermsandConditionsComponent } from './termsand-conditions/termsand-conditions.component';
import { GeneralConditionsComponent } from './general-conditions/general-conditions.component';
import { EditAddressComponent } from './Account/edit-address/edit-address.component';
import { SearchListComponent } from './Account/search-list/search-list.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { UnavailableComponent } from './unavailable/unavailable.component';
import { RecentlyviewedComponent } from './_common/component/recentlyviewed/recentlyviewed.component';
import { RelatedproductsComponent } from './_common/component/relatedproducts/relatedproducts.component';
import { GoogleLoginProvider,SocialLoginModule,SocialAuthServiceConfig} from '@abacritt/angularx-social-login';
import { OrderStatusComponent } from './notifications/order-status/order-status.component';
import { PushNotificationComponent } from './notifications/push-notification/push-notification.component';
import { Frames } from 'projects/frames-angular/src/public-api';
import { ConfirmOrderComponent } from './Order/confirm-order/confirm-order.component';
import { LocateMeComponent } from './setting/locate-me/locate-me.component';
import { PlaceorderComponent } from './Order/placeorder/placeorder.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OffersComponent } from './offers/offers.component';
import { BulkOfferComponent } from './offers/bulk-offer/bulk-offer.component';
import { BundleOfferComponent } from './offers/bundle-offer/bundle-offer.component';
import { BagaOfferComponent } from './offers/baga-offer/baga-offer.component';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductsComponent } from './category/products/products.component';
import { SafePipe } from './safepipe';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    CategoryComponent,
    MyCardComponent,
    AddAddressComponent,
    SubCategoryComponent,
    MainCategoryComponent,
    BottomLayoutComponent,
    WishListComponent,
    NotificationsComponent,
    AccountListComponent,
    MyOrderComponent,
    OrderDetailsComponent,
    SaveAddressComponent,
    EditProfileComponent,
    SetPasswordComponent,
    DeactivatedAccountComponent,
    SelectLanguageComponent,
    CustomerInfoComponent,
    RecentViewComponent,
    FeaturedComponent,
    ContactSupportComponent,
    PrivacyPolicyComponent,
    TOSComponent,
    RefundPolicyComponent,
    CookiesComponent,
    TermsandConditionsComponent,
    GeneralConditionsComponent,
    EditAddressComponent,
    SearchListComponent,
    SplashScreenComponent,
    UnavailableComponent,
    RecentlyviewedComponent,
    RelatedproductsComponent,
    OrderStatusComponent,
    PushNotificationComponent,
    ConfirmOrderComponent,
    ProductsComponent,
    LocateMeComponent,
    PlaceorderComponent,
    OffersComponent,
    BulkOfferComponent,
    BundleOfferComponent,
    BagaOfferComponent,
    SafePipe
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgOtpInputModule,
    NgxPaginationModule,
    MatSnackBarModule,
    SocialLoginModule,
    Frames,
    NgxIntlTelInputModule,
    BsDropdownModule,
    PdfViewerModule,
    PinchZoomModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    })
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '945557653115-ek527n5rgb2kdm74j6kfq3guanqpd1o1.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    HttpClientModule,ProductService,Environment],
  bootstrap: [AppComponent]
})
export class AppModule { }
