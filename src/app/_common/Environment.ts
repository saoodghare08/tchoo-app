export class Environment {
    live = "https://villiyantapi.cxengine.net/api/";
    local = "http://localhost:5114/api/";  // Local API URL
    stage = "";                         // Set this to 'dev' to use local
    baseUrl: string = this.stage == 'dev' ? this.local : this.live;
    ProductBaseUrl: string = `${this.baseUrl}Product/`;
    OrderBaseUrl: string = `${this.baseUrl}`;
    AccountBaseUrl: string = `${this.baseUrl}Authenticate/`;
    PaymentApiUrl: string = `${this.baseUrl}`;
    LoginUrl: string = `${this.baseUrl}/login/`;
    NotificationUrl: string = `${this.baseUrl}Notification/`;
    createcontact: string = `${this.baseUrl}Authenticate/register-user`;
    localBaseUrl: string = "http://localhost:5114/";  // Local host URL
}
