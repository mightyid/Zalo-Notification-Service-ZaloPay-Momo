# Zalo Notification Service & ZaloPay & Momo

## Project setup

```bash
$ npm install
```

## 🔧 Environment Configuration (`.env` file)

To run this module successfully, you must define the following environment variables in a `.env` file at the root of your project:

## Required Variables

| Variable                     | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `ZALO_APP_ID`                | Your Zalo Official Account (OA) App ID                                                                   |
| `ZALO_APP_SECRET`            | The secret key associated with your OA App                                                               |
| `REDIS_PORT`                 | Port number used by Redis (default: `6379`)                                                              |
| `PORT`                       | Port number used by server (default: `3000`)                                                             |
| ZALO                         | -----------------------------------------------------------------------------                            |
| `APP_ID`                     | ZaloPay application ID provided when registering for integration.                                        |
| `KEY1`                       | MAC Key 1 provided by ZaloPay when registering application                                               |
| `KEY2`                       | MAC Key 2 provided by ZaloPay when registering application                                               |
| `ZALO_CREATE_ENDPOINT`       | Endpoint for creating a payment transaction.                                                             |
| `ZALO_REFUND_ENDPOINT`       | Endpoint for initiating a refund.                                                                        |
| `ZALO_QUERY_STATUS_ENDPOINT` | Endpoint for querying the status of a payment transaction.                                               |
| `ZALO_QUERY_REFUND_ENDPOINT` | Endpoint for querying the status of a refund request.                                                    |
| MOMO                         | -----------------------------------------------------------------------------                            |
| `PARTNER_CODE`               | Information to define the business account.                                                              |
| `ACCESS_KEY`                 | Grants access to the MoMo system.                                                                        |
| `SECRET_KEY`                 | Used to create an electronic signature.                                                                  |
| `REDIRECT_URL`               | A partner's URL. This URL is used to redirect from MoMo page to partner's page after customer's payment. |
| `IPN_URL`                    | Partner API. Used by MoMo to submit payment results by IPN method (server-to-server) method              |
| `MOMO_CREATE_ENDPOINT`       | Endpoint for creating a payment transaction.                                                             |
| `MOMO_QUERY_STATUS_ENDPOINT` | Endpoint for querying the status of a payment transaction.                                               |
| `MOMO_CONFIRM_ENDPOINT`      | Endpoint for canceling or capturing a payment transaction.                                               |
| `MOMO_REFUND_ENDPOINT`       | Endpoint for initiating a refund.                                                                        |

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Oauth Zalo API

## 1. `GET /oauth-zalo/authorize`

## Description

Generates the authorization URL.

## Query Parameters

| Query param   | Data type | Require | Description                              |
| ------------- | --------- | ------- | ---------------------------------------- |
| `redirectUri` | `string`  | yes     | The URL to redirect back to after login. |

## Response

```json
{
  "authorizationUrl": "https://oauth.zaloapp.com/v4/oa/permission?app_id=**&redirect_uri=**&code_challenge=**"
}
```

## 2. `GET /oauth-zalo/new-token`

## Description

Handles the callback from Zalo after the user successfully authorize. Exchanges the received `code` and `state` for an access and refresh token.

## Query Parameters

| Name    | Type     | Required | Description                                       |
| ------- | -------- | -------- | ------------------------------------------------- |
| `code`  | `string` | Yes      | The authorization code returned by Zalo           |
| `state` | `string` | Yes      | A state parameter to protect against CSRF attacks |

## Example Request

`GET http://localhost:3000/oauth-zalo/new-token?code=***&state=***`

### Example Response

```json
{
  "access_token": "zalo_access_token_here",
  "refresh_token": "zalo_refresh_token_here",
  "expires_in": "90000"
}
```

## 3. `POST /oauth-zalo/refresh-token`

## Example Request Body

```json
{
  "refresh_token": "your_refresh_token_here"
}
```

## Example Response

```json
{
  "access_token": "zalo_access_token_here",
  "refresh_token": "zalo_refresh_token_here",
  "expires_in": "90000"
}
```

# Zalo Notification Service API

DTO: CreateZaloNotiDto
| Field | Type | Required | Description |
| --------------- | -------- | -------- | ----------------------------------------------------- |
| `mode` | `string` | Optional | Specifies the environment mode. Only accepts: `"development"`|
| `phone` | `string` | ✅ | Recipient's phone number.|
| `template_id` | `string` | ✅ | ID of the ZNS template provided by Zalo for each partner. |
| `template_data` | `object` | ✅ | Parameters (key-value pairs) defined in the Zalo template.|
| `sending_mode` | `string` | Optional | Sending mode: <br><br>**1 (default)** – Normal sending <br>**3** – Quota-bypass sending <br><br>**Note**: Mode 3 (quota-bypass) is only available for whitelisted OA (Official Accounts)
| `tracking_id` | `string` | ✅ | Custom identifier defined by the partner for tracking API calls|

## 1. `POST /zalo-noti/send-zns`

## Headers

| Name           | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `access_token` | `string` | Yes      | Zalo access token for authentication |

## Request Body (`CreateZaloNotiDto`)

```json
{
  "mode": "development",
  "phone": "84337258461",
  "template_id": "439621",
  "template_data": {
    "student_name": "Nguyen Van A",
    "school_name": "Maple Leaf International University",
    "program": "Business and Management Studies",
    "application_id": "681db3fab0bed64b56dffeff"
  },
  "tracking_id": "456781516"
}
```

## 2. `POST /zalo-noti/send-zns/hashphone`

## Description

Sends a ZNS message using a hashed phone number (used for data privacy or compliance).

## Headers

| Name           | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `access_token` | `string` | Yes      | Zalo access token for authentication |

## Request Body (`CreateZaloNotiDto`)

Same as send-zns, but phone should be a hashed value.

# ZaloPay API

### CreateTransactionDto

| Field                     | Type              | Required | Description                                                              |
| ------------------------- | ----------------- | -------- | ------------------------------------------------------------------------ |
| `app_id`                  | Integer           | ✔       | ZaloPay Application ID                                                   |
| `app_user`                | String            | ✔       | User identifier in your system                                           |
| `app_trans_id`            | String            | ✔       | Unique transaction ID (must start with `yymmdd`, Vietnam timezone GMT+7) |
| `app_time`                | Long              | ✔       | Unix timestamp (milliseconds) of transaction creation                    |
| `expire_duration_seconds` | Long              | ✘        | transaction expiration (in seconds, min: 300, max: 2592000)              |
| `amount`                  | Long              | ✔       | transaction amount in VND                                                |
| `item`                    | JSON Array String | ✔       | transaction items                                                        |
| `description`             | String            | ✔       | Description shown in ZaloPay UI and dashboard                            |
| `embed_data`              | JSON String       | ✔       | Custom data to be returned in callback                                   |
| `bank_code`               | String            | ✔ (\*)  | Bank code (optional for ZaloPay Wallet)                                  |
| `mac`                     | String            | ✔       | HMAC signature for transaction verification                              |
| `callback_url`            | String            | ✘        | Override default callback URL                                            |
| `device_info`             | JSON String       | ✘        | Device information                                                       |
| `sub_app_id`              | String            | ✘        | Partner sub-service ID                                                   |
| `title`                   | String            | ✘        | transaction title                                                        |
| `currency`                | String            | ✘        | Default is VND                                                           |
| `phone`                   | String            | ✘        | User's phone number                                                      |
| `email`                   | String            | ✘        | User's email                                                             |
| `address`                 | String            | ✘        | User's address                                                           |

- Đối với mô hình Thanh toán QR, App to App, thì `bank_code` là không bắt buộc
- Đối với mô hình Mobile Web to App, thì `bank_code` bắt buộc phải là `zalopayapp`

### RefundTransactionDto

| Field               | Type   | Required | Description                           |
| ------------------- | ------ | -------- | ------------------------------------- |
| `zp_trans_id`       | String | ✔       | ZaloPay transaction ID to be refunded |
| `amount`            | Number | ✔       | Amount to be refunded in VND          |
| `refund_fee_amount` | Number | ✘        | Refund fee (if any)                   |
| `description`       | String | ✔       | Reason for the refund                 |

## 1. `POST /zalopay/transactions`

### Request Body (`CreateTransactionDto`)

```json
Cấu hình phương thức thanh toán: `https://docs.zalopay.vn/v2/docs/gateway/guide.html#2-1-theo-cau-truc-moi`
{
  "app_user": "user123",
  "amount": 999999,
  "item": [],
  "description": "Thanh toán tiền mua hàng",
  "embed_data": {
    "redirectURL": "https://fb.com/",
     "preferred_payment_method": ["domestic_card",  "account"]
  },
  "address": "HCM",
  "bank_code": ""
}
```

### Example Response

```json
{
  "return_code": 1,
  "return_message": "Giao dịch thành công",
  "sub_return_code": 1,
  "sub_return_message": "Giao dịch thành công",
  "zp_trans_token": "ACofw5yC4Q9eMToBIe3ZnXiA",
  "order_url": "https://qcgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiJBQ29mdzV5QzRROWVNVG9CSWUzWm5YaUEiLCJhcHBpZCI6MjU1NH0=",
  "order_token": "ACofw5yC4Q9eMToBIe3ZnXiA"
}
```

## 2. `GET /zalopay/transactions/:app_trans_id/status`

### Example Response

```json
{
  "return_code": 1,
  "return_message": "Giao dịch thành công",
  "sub_return_code": 1,
  "sub_return_message": "Giao dịch thành công",
  "is_processing": false,
  "amount": 999999,
  "zp_trans_id": 250604000000118,
  "server_time": 1748999453845,
  "discount_amount": 0
}
```

## 3. `POST /zalopay/refund`

### Request Body (`RefundTransactionDto`)

```json
{
  "zp_trans_id": "250604000000118",
  "amount": 11000,
  "refund_fee_amount": 1000,
  "description": "Hoantiengiaodich"
}
```

### Example Response

```json
{
  "return_code": 3,
  "return_message": "Giao dịch đang refund!",
  "sub_return_code": 2,
  "sub_return_message": "Giao dịch đang refund!",
  "refund_id": 250604000000607
}
```

## 4. `GET /zalopay/refunds/:m_refund_id/status`

### Example Response

```json
{
  "return_code": 1,
  "return_message": "Giao dịch thành công!",
  "sub_return_code": 1,
  "sub_return_message": "Giao dịch thành công!"
}
```

# MOMO PAYMENT

#### `CreateTransactionDTO`

| Field         | Type       | Required | Description                                                      |
| ------------- | ---------- | -------- | ---------------------------------------------------------------- |
| `storeId`     | `string`   | ❌       | Store ID                                                         |
| `amount`      | `number`   | ✅       | Amount needs to be paid (min 1000 VND, max 50M VND)              |
| `orderId`     | `string`   | ✅       | Partner Transaction ID                                           |
| `orderInfo`   | `string`   | ✅       | Order's information                                              |
| `items`       | `Object[]` | ❌       | List of products displayed on the payment page.                  |
| `userInfo`    | `Object`   | ❌       | User Info                                                        |
| `autoCapture` | `boolean`  | ❌       | If set to false, the payment will not be automatically captured. |
| `lang`        | `string`   | ❌       | Language of returned message (vi or en)                          |

#### Details of items content

| Field          | Type      | Required | Description                                               |
| -------------- | --------- | -------- | --------------------------------------------------------- |
| `id`           | `string`  | ✅       | SKU number                                                |
| `name`         | `string`  | ✅       | Name of the product                                       |
| `description`  | `string`  | ❌       | Description of the product                                |
| `category`     | `string`  | ❌       | Product classification/Product category                   |
| `imageUrl`     | `string`  | ❌       | Link image of product                                     |
| `manufacturer` | `string`  | ❌       | Name of manufacturer                                      |
| `price`        | `long`    | ❌       | Unit price                                                |
| `currency`     | `string`  | ✅       | Currency: VND                                             |
| `quantity`     | `integer` | ✅       | Quantity number of the product. It must be greater than 0 |
| `unit`         | `string`  | ❌       | The units of measurement used for products                |
| `totalPrice`   | `long`    | ✅       | Total price = price x quantity                            |
| `taxAmount`    | `long`    | ❌       | Total amount of tax                                       |

#### Example item

```json
{
  "id": "204727",
  "name": "YOMOST Bac Ha&Viet Quat 170ml",
  "description": "YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop",
  "category": "beverage",
  "imageUrl": "https://momo.vn/uploads/product1.jpg",
  "manufacturer": "Vinamilk",
  "price": 11000,
  "quantity": 5,
  "unit": "hộp",
  "totalPrice": 55000,
  "taxAmount": "200"
}
```

#### Details of userInfo content

| Field         | Type     | Required | Description                                                  |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| `name`        | `string` | ❌       | Name of the customer as registered on merchant site          |
| `phoneNumber` | `string` | ❌       | Phone number of the customer as registered on merchant site  |
| `email`       | `string` | ❌       | Email address of the customer as registered on merchant site |

#### Example userInfo

```json
{
  "name": "Nguyen Van A",
  "phoneNumber": "0999888999",
  "email": "email_add@domain.com"
}
```

#### `ConfirmTransactionDTO`

| Field         | Type     | Required | Description                                                                                    |
| ------------- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `amount`      | `number` | ✅       | Amount needs to be paid (min 1000 VND, max 50M VND)                                            |
| `orderId`     | `string` | ✅       | Partner Transaction                                                                            |
| `requestType` | `number` | ✅       | Request type, with 2 values: `(Confirm transaction: capture)` - `(Cancel transaction: cancel)` |
| `lang`        | `string` | ✅       | Language of returned message (vi or en)                                                        |
| `description` | `number` | ✅       | Reason description (used in the case of rollback)                                              |

#### `RefundTransactionDTO extends ConfirmTransactionDTO`

| Field     | Type     | Required | Description                                                                                    |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `transId` | `number` | ✅       | MoMo's transaction ID. This ID is provided by MoMo when the purchase transaction is successful |

## 1. `POST /momo/transactions`

### Request Body (`CreateTransactionDto`)

```json
{
  "storeId": "123456789",
  "amount": 999999,
  "orderId": "order123",
  "orderInfo": "Order thanh toán mua hàng",
  "items": [
    {
      "image": "https://momo.vn/uploads/product1.jpg",
      "name": "Product 1",
      "quantity": 1,
      "amount": 20000
    },
    {
      "image": "https://momo.vn/uploads/product2.jpg",
      "name": "Product 2",
      "quantity": 2,
      "amount": 30000
    }
  ],
  "userInfo": {
    "username": "hung",
    "email": "hung@gmail.com"
  },
  "autoCapture": false,
  "lang": "vi",
  "extraData": ""
}
```

### Example Response

```json
{
  "partnerCode": "MOMO",
  "orderId": "order123",
  "requestId": "1749089000511",
  "amount": 999999,
  "responseTime": 1749089000488,
  "message": "Thành công.",
  "resultCode": 0,
  "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3x1c&s=a64fd2cde92",
  "shortLink": "https://test-payment.momo.vn/shortlink/Fyg0rgzGAK"
}
```

## 2. `POST /momo/transactions/status`

### Request Body

```json
{
  "orderId": "order123",
  "lang": "vi"
}
```

### Example Response

```json
{
  "partnerCode": "MOMO",
  "orderId": "order123",
  "requestId": "1749092115916",
  "extraData": "",
  "amount": 999999,
  "transId": 3305080682,
  "payType": "qr",
  "resultCode": 0,
  "refundTrans": [],
  "message": "Thành công.",
  "responseTime": 1749092115905,
  "lastUpdated": 1749087764933,
  "signature": null
}
```

## 3. `POST /momo/transactions/confirm`

### `Hóa đơn thanh toán chỉ có thể được captured nếu đang ở trạng thái Authorized (resultCode là 9000). Trạng thái authorized chỉ áp dụng cho luồng thanh toán trực tiếp với thẻ quốc tế, ví MoMo với tham số autoCapture được chỉnh giá trị là false.`

### Request Body(`ConfirmTransactionDto`)

```json
{
  "orderId": "order123",
  "requestType": "capture",
  "amount": 999999,
  "lang": "vi",
  "description": "temp"
}
```

### Example Response

```json
{
  "partnerCode": "MOMO",
  "orderId": "order123",
  "requestId": "1749090234701",
  "amount": 999999,
  "transId": 3304873833,
  "resultCode": 0,
  "message": "Thành công.",
  "responseTime": 1749090236746,
  "requestType": "capture"
}
```

## 4. `POST /momo/transactions/refund`

### Request Body (`RefundTransactionDto`)

```json
{
  "orderId": "refund123",
  "amount": 10000,
  "lang": "vi",
  "description": "temp",
  "transId": 3305081242
}
```

### Example Response

```json
{
  "partnerCode": "MOMO",
  "orderId": "refund123",
  "requestId": "1749093735514",
  "amount": 10000,
  "transId": 3305081242,
  "resultCode": 0,
  "message": "Thành công.",
  "responseTime": 1749093735969
}
```
