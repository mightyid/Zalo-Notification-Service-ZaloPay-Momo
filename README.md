# Zalo Notification Service

## Project setup

```bash
$ npm install
```

## 🔧 Environment Configuration (`.env` file)

To run this module successfully, you must define the following environment variables in a `.env` file at the root of your project:

### Required Variables

| Variable          | Description                                 |
| ----------------- | ------------------------------------------- |
| `ZALO_APP_ID`     | Your Zalo Official Account (OA) App ID      |
| `ZALO_APP_SECRET` | The secret key associated with your OA App  |
| `REDIS_PORT`      | Port number used by Redis (default: `6379`) |

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Oauth Zalo API

### 1. `GET /oauth-zalo/authorize`

### Description

Generates the authorization URL.

### Query Parameters

| Query param   | Data type | Require | Description                              |
| ------------- | --------- | ------- | ---------------------------------------- |
| `redirectUri` | `string`  | yes     | The URL to redirect back to after login. |

### Response

```json
{
  "authorizationUrl": "https://oauth.zaloapp.com/v4/oa/permission?app_id=**&redirect_uri=**&code_challenge=**"
}
```

### 2. `GET /oauth-zalo/new-token`

### Description

Handles the callback from Zalo after the user successfully authorize. Exchanges the received `code` and `state` for an access and refresh token.

### Query Parameters

| Name    | Type     | Required | Description                                       |
| ------- | -------- | -------- | ------------------------------------------------- |
| `code`  | `string` | Yes      | The authorization code returned by Zalo           |
| `state` | `string` | Yes      | A state parameter to protect against CSRF attacks |

### Example Request

`GET http://localhost:3000/oauth-zalo/new-token?code=***&state=***`

#### Example Response

```json
{
  "access_token": "zalo_access_token_here",
  "refresh_token": "zalo_refresh_token_here",
  "expires_in": "90000"
}
```

### 3. `POST /oauth-zalo/refresh-token`

### Example Request Body

```json
{
  "refresh_token": "your_refresh_token_here"
}
```

### Example Response

```json
{
  "access_token": "zalo_access_token_here",
  "refresh_token": "zalo_refresh_token_here",
  "expires_in": "90000"
}
```

## Zalo Notification Service API

DTO: CreateZaloNotiDto
| Field | Type | Required | Description |
| --------------- | -------- | -------- | ----------------------------------------------------- |
| `mode` | `string` | Optional | Specifies the environment mode. Only accepts: `"development"`|
| `phone` | `string` | ✅ | Recipient's phone number.|
| `template_id` | `string` | ✅ | ID of the ZNS template provided by Zalo for each partner. |
| `template_data` | `object` | ✅ | Parameters (key-value pairs) defined in the Zalo template.|
| `sending_mode` | `string` | Optional | Sending mode: <br><br>**1 (default)** – Normal sending <br>**3** – Quota-bypass sending <br><br>**Note**: Mode 3 (quota-bypass) is only available for whitelisted OA (Official Accounts)
| `tracking_id` | `string` | ✅ | Custom identifier defined by the partner for tracking API calls|

### 1. POST /zalo-noti/send-zns

### Headers

| Name           | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `access_token` | `string` | Yes      | Zalo access token for authentication |

### Request Body (`CreateZaloNotiDto`)

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

### 2. POST /zalo-noti/send-zns/hashphone

### Description

Sends a ZNS message using a hashed phone number (used for data privacy or compliance).

### Headers

| Name           | Type     | Required | Description                          |
| -------------- | -------- | -------- | ------------------------------------ |
| `access_token` | `string` | Yes      | Zalo access token for authentication |

### Request Body (`CreateZaloNotiDto`)

Same as send-zns, but phone should be a hashed value.
