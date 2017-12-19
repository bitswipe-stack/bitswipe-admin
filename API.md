# API

For the time being, our product is in private beta. If you'd like to try it out, please [leave us your email address](http://bitswipe.com).

## Quick start
Following code will create a payment of 1 BTC.

```
$ curl https://api.bitswipe.com/payments   \
       -XPOST                              \
       -u username:password                \
       -H 'Content-Type: application/json' \
       -d '{"amount": "1"}'
```

## Current API endpoints

  * Production - https://api.bitswipe.com

## Authentication

Bitswipe API uses Basic Auth for authentication.

## Resources

Bitswipe API is a JSON REST API organized around resources. There are following resources:

  * [Payment](#payment)
  * [User](#user)
  
### Payment

Payment resource has the following properties:

  * `id` - string, unique payment ID
  * `amount` - string, payment amount
  * `user` - string, user this payment belongs to
  * `address` - string, Bitcoin address this payment should be paid to
  * `state` - string, either `'waiting'` - meaning that payment wasn't received yet, `'accepted'` - meaning that payment was accepted and will be sent to merchant during next payout or `'paid'` - meaning that the payment was paid out.
  * `txid` - string, Bitcoin transaction ID, assigned when payment is received

#### Methods

##### Create - `POST /payments`

###### Arguments

  * `amount` - string, payment amount (*Note: it is required to be a string to avoid potential rounding problems*)

###### Returns

A new Payment object if successful, an error otherwise.

##### Get all payments - `GET /payments`

###### Returns

All your payments.

##### Get a payment - `GET /payments/:id`

###### Returns

Payment with the ID `:id` if successful, an error otherwise.

### User

User resource has the following properties:

 * `name` - string, username
 * `email` - string, user's email address
 * `webhooks` - object, specifying what URLs [webhooks](#webhooks) should be sent to
     * `accepted` - string, what URL [accepted](#accepted) webhook should be sent to
     * `paid` - string, what URL [paid](#paid) webhook should be sent to

## Webhooks

Bitcoin payments usually take longer than authorizing a credit card payment. Thus, creating a payment doesn't block until we receive a payment - we use webhooks instead.

Webhooks are sent as a HTTP POST request with JSON body to a URL specified in user account (in `webhooks` property).

If you want to test webhooks out, we recommend using [requestb.in](http://requestb.in/).

There are 2 types of webhooks:

### Accepted
Sent when a Bitcoin payment is accepted. It means that customer paid the requested amount.

Webhook body is a [Payment](#payment) object.

You can use this hook to, for example, send your user an email with a digital good you're selling or update user's subscription data.

### Paid
Sent when payout is complete (once a day, if any payments occured during the day).

Webhook body has the following attributes:

  * `amount` - string, total amount we paid you (sum of all transactions from the day minus fees)
  * `payments` - array of [Payment](#payment) objects included in this payout