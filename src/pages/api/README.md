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

## /api/cats

```yaml
get:
  responses:
    200:
      description: list of categories
      array:
        object:
          id: string
          name: string
          description: string
          color: string
          isMaster: boolean
          creatorId: User
          dates: Date
put:
  responses:
    200:
      description: update existing category by its id (unchangeable creatorId)
      object:
          id: string
          name: string
          description: string
          color: string
          isMaster: boolean
          creatorId: User
          dates: Date
    404:
      description: category does not exist
      text: category does not exist
    409:
      description: updating an existing category with a name that already exists
      text: category name conflicting other category
post:
  responses:
    201:
      description: create a new category
      object:
          id: string
          name: string
          description: string
          color: string
          isMaster: boolean
          creatorId: User
          dates: Date
    409:
      description: creating a new category with a non-unique name
      text: category name must be unique
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```