# API Documentation

## /api/hello

```yaml
get:
  responses:
    200:
      description: hello world message
      text: Hello, World!
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/users

```yaml
get:
  responses:
    200:
      description: list of users
      array:
        object:
          id: string
          name: string
          email: string
          isAdmin: boolean
    401:
      description: user is not an admin
      text: Unauthorized
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```
