# User Api

## Description

These endpoints facilitate interaction with the authentication system.

## Config

| key             | Value                             |
| :-------------- | :-------------------------------- |
| Default Headers | `Content-Type : application/json` |

## Login

### Request

| Verb | Path     |
| :--- | :------- |
| POST | `/login` |

#### Body

| Key      | Type     | Validation                                         | Description                                                            |
| :------- | :------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| email    | `string` | Must be a valid email                              | This field should contain the email address of the user                |
| password | `string` | Password length must be greater than or equal to 8 | This field should contain the password for the user wishing to log in. |

### Response

```typescript
// RESPONSE STATUS 200
{
  body : {
    "_id": "64282940238cca3f04a079ca", // string
    "firstName": "jhon", // string
    "lastName": "doe", // string
    "email": "jhon@gmail.com", // string
    "deletedAt": null, // string | null
    "createdAt": "2023-04-01T12:53:20.829Z", // string
    "updatedAt": "2023-04-01T17:40:58.647Z", // string
    "__v": 18 // number
  },
  headers : {
    "set-cookie" : [
      "refreshToken=refreshToken",
      "accessToken=accessToken"
    ]
  }
 }
```

```typescript
// RESPONSE STATUS 400
{
  "message": "Email Address or Password is not correct"
}
```

```typescript
// RESPONSE STATUS 400
{
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "email"
      ],
      "message": "Required"
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "password"
      ],
      "message": "Required"
    }
  ]
}
```

## Register

> Note : An Email Will be sent to the user for email confirmation

### Request

| Verb | Path        |
| :--- | :---------- |
| POST | `/register` |

#### Body

| Key                   | Type     | Validation                                                         | Description                           |
| :-------------------- | :------- | :----------------------------------------------------------------- | :------------------------------------ |
| firstName             | `string` | Minimum length of 3 characters and maximum length of 60 characters | The first name of the user            |
| lastName              | `string` | Minimum length of 3 characters and maximum length of 60 characters | The last name of the user             |
| email                 | `string` | Must be a valid email address                                      | The Email address of the user         |
| password              | `string` | Minimum length of 8 And must match Password Confirmation           | The desired password of the user      |
| password_confirmation | `string` | must match Password Confirmation                                   | Password Confirmation of the password |

### Response

```typescript
// RESPONSE STATUS 201
{
  body : {
    "firstName": "John", // string
    "lastName": "Doe", // string
    "email": "john@example.com", // string
    "deletedAt": null, // null | string
    "_id": "64295b23e45fd94cd775125a", // string
    "updatedAt": "2023-04-02T10:38:27.743Z", // string
    "createdAt": "2023-04-02T10:38:27.743Z", // string
    "__v": 0 // number
  },
  headers : {
    "set-cookie" : [
      "accessToken=accessToken" // string,
      "refreshToken=refreshToken" // string
    ]
  }
}
```

```typescript
// RESPONSE STATUS 400
{
  "message": "Email Address is already taken"
}
```

```typescript
// RESPONSE STATUS 400
{
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "lastName"
      ],
      "message": "Required"
    }
  ]
}
```

```typescript
// RESPONSE STATUS 400
{
  "errors": [
    {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 8 character(s)",
      "path": [
        "password"
      ]
    },
    {
      "code": "custom",
      "path": [
        "password"
      ],
      "message": "Password and Password confirmation does not match"
    }
  ]
}
```

## Logout

### Request

| Verb | Path      |
| :--- | :-------- |
| POST | `/logout` |

#### Headers

| Key           | Value                  |
| :------------ | :--------------------- |
| Authorization | Bearer ${refreshToken} |

## Response

```typescript
// RESPONSE STATUS 204
{
  headers : {
    "set-cookie" : [
      "refreshToken=; Max-Age=0",
      "accessToken=; Max-Age=0"
    ]
  }
}
```

```typescript
// RESPONSE STATUS 401
{
  "message": "unauthorized"
}
```

## Refresh

### Request

| Verb | Path       |
| :--- | :--------- |
| POST | `/refresh` |

#### Headers

| Key           | Value                  |
| :------------ | :--------------------- |
| Authorization | Bearer ${refreshToken} |

### Response

```typescript
// RESPONSE STATUS 200
{
  headers : {
    "set-cookie" : [
      "refreshToken=refreshToken;",
      "accessToken=accessToken;"
    ]
  }
}
```

```typescript
// RESPONSE STATUS 401
{
  "message": "unauthorized"
}
```

## Verify

### Request

| Verb | Path      |
| :--- | :-------- |
| GET  | `/verify` |

#### Headers

| Key           | Value                 |
| :------------ | :-------------------- |
| Authorization | Bearer ${accessToken} |

## Response

```typescript
// RESPONSE STATUS 200
{
  "_id": "64282940238cca3f04a079ca", // string
  "firstName": "jhon", // string
  "lastName": "doe", // string
  "email": "jhon@gmail.com", // string
  "deletedAt": null, // string | null
  "createdAt": "2023-04-01T12:53:20.829Z", // string
  "updatedAt": "2023-04-01T17:40:58.647Z", // string
  "__v": 19 // number
}
```

```typescript
// RESPONSE STATUS 401
{
  "message": "unauthorized"
}
```

```typescript
// RESPONSE STATUS 401
{
  "message": "token expired"
}
```

## Forgot Password

### Request

> Note : Only 5 Requests per hour

| Verb | Path               |
| :--- | :----------------- |
| POST | `/forgot-password` |

#### Body

| Key      | Type     | Validation                                         | Description                                                            |
| :------- | :------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| email    | `string` | Must be a valid email                              | This field should contain the email address of the user                |


## Response

```typescript
// RESPONSE STATUS 200
{
  message: "If the email address exists within our database an email will be sent to it",
}
```

```typescript
// RESPONSE STATUS 429 FOR TOO MANY REQUESTS
{
}
```

```typescript
// RESPONSE STATUS 400
{
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "email"
      ],
      "message": "Required"
    }
  ]
}
```

## Reset Password

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| POST | `/reset-password/:token` |

#### Body

| Key      | Type     | Validation                                         | Description                                                            |
| :------- | :------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| password    | `string` | Must be at least 8 characters long                              |The reset password |
| password_confirmation    | `string` | Must be a at least 8 characters long and Must match the passsword                              |A password confirmation |

## Response

```typescript
// RESPONSE STATUS 200
{
  message: "Password Updated successfully";
}
```

```typescript
// RESPONSE STATUS 400
{
 "errors": [
   {
     "code": "invalid_type",
     "expected": "string",
     "received": "undefined",
     "path": [
       "password"
     ],
     "message": "Required"
   }
   {
     "code": "invalid_type",
     "expected": "string",
     "received": "undefined",
     "path": [
       "password_confirmation"
     ],
     "message": "Required"
   }
 ]
}
```

```typescript
// RESPONSE STATUS 400 FOR TOO MANY REQUESTS
{
 "errors": [
   {
     "code": "custom",
     "path": [
       "password",
       "password_confirmation"
     ],
     "message": "Password and Password Confirmation does not exists"
   }
  ]
}
```

```typescript
// RESPONSE STATUS 400
{
  "message": "Token is invalid"
}
```

```typescript
// RESPONSE STATUS 400
{
  message: "User not found",
}
```

## Send Email Confirmation

> Note : 5 requests per 60min is the limit

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| POST | `/send-confirmation-email` |


## Response

```typescript
// RESPONSE STATUS 204
{
}
```

```typescript
// RESPONSE STATUS 400
{
  message: "Email Address is alreay verified",
}
```

```typescript
// RESPONSE STATUS 429
{
}
```

## Email Confirmation

> Note : 5 requests per 60min is the limit

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| POST | `/confirm-email/:token` |

## Response

```typescript
// RESPONSE STATUS 200
{
}
```

```typescript
// RESPONSE STATUS 400
{
  message: "Token is not valid",
}
```
```typescript
// RESPONSE STATUS 400
{
  message: "Email Address is already verified"
}
```

```typescript
// RESPONSE STATUS 404
{
  message: "User Not Found",
}
```

## Update User Information

> Note : Requires Auth

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| PATCH | `/me` |

### Body
| Key      | Type     | Validation                                         | Description                                                            |
| :------- | :------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| firstName?    | `string` | First Name length must be greater than or equal to 3 and Less than or equal to 60   | This field should be the first name of the user                |
| lastName?    | `string` | Last Name length must be greater than or equal to 3 and Less than or equal to 60   | This field should be the lastnName of the user                |
| email?    | `string` | Password length must be greater than or equal to 8   | This field should be the email of the user                |
| password | `string` | Password length must be greater than or equal to 8 | This field should contain the current password for the user. |

## Response

```typescript
// RESPONSE STATUS 200
{
  "_id": "643cb304bc082e9212155d9f",
  "firstName": "king4",
  "lastName": "King4",
  "email": "mouhrachc@gmail.com",
  "deletedAt": null,
  "verifiedAt": "2023-04-17T17:39:19.748Z",
  "createdAt": "2023-04-17T02:46:30.264Z",
  "updatedAt": "2023-04-18T02:03:16.141Z",
  "__v": 25
}
```
```typescript
// RESPONSE STATUS 400
{
  errors : [{
   {
     "code": "too_small",
     "minimum": 3,
     "type": "string",
     "inclusive": true,
     "exact": false,
     "message": "String must contain at least 3 character(s)",
     "path": [
      "firstName"
     ]
   }
  }]
}
```
```typescript
// RESPONSE STATUS 400
{
  errors : [{
    path: ["password"],
    message: "Password is not correct"
  }]
}
```

## Change Password

> Note : Requires Auth

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| POST | `/change-password` |

#### Body

| Key      | Type     | Validation                                         | Description                                                            |
| :------- | :------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| old_password    | `string` | Password length must be greater than or equal to 8   | This field should the current password of the user                |
| password | `string` | Password length must be greater than or equal to 8 | This field should contain the new password for the user. |
| password_confirmation | `string` | Password length must be greater than or equal to 8 | This field should contain the confirmation for the new password.  |


## Response

```typescript
// RESPONSE STATUS 204
{
}
```

```typescript
// RESPONSE STATUS 200
{
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": [
        "old_password"
      ],
      "message": "Required"
    }
  ]
}
```
```typescript
// RESPONSE STATUS 400
{
 "errors": [
  {
   "path": [
     "password"
   ],
   "message": "Old Password is not correct"
  }
 ]
}
```

```typescript
// RESPONSE STATUS 400
{
  errors : [{
    path: ["password"],
    message: "Password is not correct"
  }]
}
```

## Delete Account

> Note : Requires Auth

### Request

| Verb | Path                     |
| :--- | :----------------------- |
| DELETE | `/me` |

## Response

```typescript
// RESPONSE STATUS 204
{
}
```
```typescript
// RESPONSE STATUS 404
{
   message: "User does not exists"
}
```

