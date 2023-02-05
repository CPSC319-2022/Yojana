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
      description: list of categories, their dates, and their creator
      array:
        object:
          id: int
          name: string
          description: string
          color: string
          isMaster: boolean
          creator:
            object:
              id: string
              name: string
              email: string
              isAdmin: boolean
          dates:
            array:
              object:
                id: int
                date: ISOString
                categoryId: int
put:
  body:
    id: int
    name: string
    description: string
    color: string
    isMaster: boolean
  responses:
    200:
      description: update existing category details by its id
      object:
        id: int
        name: string
        description: string
        color: string
        isMaster: boolean
        creatorId: string
    404:
      description: category does not exist
      text: category does not exist
    409:
      description: updating an existing category with a name that already exists
      text: category name conflicting other category
post:
  body:
    name: string
    description: string
    color: string
    isMaster: boolean,
    creatorId: string
    dates: ISOString[]
  responses:
    201:
      description: create a new category and possibly add dates to it
      object:
        id: int
        name: string
        description: string
        color: string
        isMaster: boolean
        creatorId: string
    409:
      description: creating a new category with a non-unique name
      text: category name must be unique
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```
