❗️BETA

This project is a minimal Angular wrapper of [Checkout.com Frames](https://docs.checkout.com/integrate/frames). This version only supports the [multiple iframes](https://docs.checkout.com/integrate/frames/frames-customization-guide#Framescustomizationguide-Multipleiframes) configuration in beta version.

# :rocket: Install

```bash
npm install frames-angular
```

# :globe_with_meridians: Load the CDN script

Make sure that you load the Checkout&#46;com CDN script before you mount any Frames components. You can add this, for example, in your _index.html_ file.

```html
<script src="https://cdn.checkout.com/js/framesv2.min.js"></script>
```



# :sparkles: Import the main component

```js
import { Frames } from 'frames-angular';
```

# :book: Example Usage

To tokenize the payment card, this wrapper includes method `submitCard()`. In the below example, we call this when the "Pay Now" button is clicked.

```js
<div id="payment-form">
  <label for="card-number">CARD NUMBER</label>
  <card-number></card-number>
  <div class="date-and-code">
    <div>
      <label for="expiry-date">EXPIRY DATE</label>
      <div class="input-container expiry-date">
        <expiry-date></expiry-date>
      </div>
    </div>
    <div>
      <label for="cvv">SECURITY CODE</label>
      <div class="input-container cvv">
        <cvv></cvv>
      </div>
    </div>
  </div>
  <button ion-button (click)="submitCard()" id="pay-button" disabled="">
    PAY NOW
  </button>

  <p class="success-payment-message">{{ cardToken }}</p>
</div>
```

```js
ngOnInit() {
    this.Frames = new CkoFrames({
      publicKey: '<<your public key>>',
      cardValidationChanged: this.onCardValidationChanged.bind(this),
      frameValidationChanged: this.onValidationChanged.bind(this),
      cardTokenizationFailed: this.onCardTokenizationFailed.bind(this),
      paymentMethodChanged: this.onPaymentMethodChanged.bind(this)
    });
    this.Frames.init();
  }
...
async submitCard() {
    let payload = await this.Frames.getTokenisedCard();
    this.cardToken = 'The card token: ' + payload.token;
  }
```


Also, include css files from `styles.css` and `app.component.css`


## Props

| prop                   | description                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| config                 | The config is an object following [Checkout.com Frames reference](https://docs.checkout.com/integrate/frames/frames-reference#Framesreference-Configurationoptions). |
| ready                  | Triggered when Frames is registered on the global namespace and safe to use.                                                                             |
| frameActivated         | Triggered when the form is rendered.                                                                                                                     |
| frameFocus             | Triggered when an input field receives focus. Use it to check the validation status and apply the wanted UI changes.                                     |
| frameBlur              | Triggered after an input field loses focus. Use it to check the validation status and apply the wanted UI changes.                                       |
| frameValidationChanged | Triggered when a field's validation status has changed. Use it to show error messages or update the UI.                                                  |
| paymentMethodChanged   | Triggered when a valid payment method is detected based on the card number being entered. Use this event to change the card icon.                        |
| cardValidationChanged  | Triggered when the state of the card validation changes.                                                                                                 |
| cardSubmitted          | Triggered when the card form has been submitted.                                                                                                         |
| cardTokenized          | Triggered after a card is tokenized.                                                                                                                     |
| cardTokenizationFailed | Triggered if the card tokenization fails.                                                                                                                |

## Functions

| function               | description                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| init                   | Initializes (or re-initializes) Frames.                                                                              |
| isCardValid            | Returns the state of the card form validation.                                                                       |
| submitCard             | Submits the card form if all form values are valid.                                                                  |
| enableSubmitForm       | Retains the entered card details and allows you to resubmit the payment form.                                        |
