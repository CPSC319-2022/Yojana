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

## /api/users/:id

```yaml
get:
  responses:
    200:
      description: user data with matching id
      object:
        id: string
        name: string
        email: string
        isAdmin: boolean
    400:
      description: no id, id is not a string
      text: Bad Request
    401:
      description: user is not admin
      text: Unauthorized
    404:
      description: user id not found
      text: Not Found
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/dates

```yaml
get:
  responses:
    200:
      description: list of date entries
      array:
        object:
          categoryId: string
          date: string
          dateId: String
post:
  body:
    categoryId: int
    dates: ISOString[]
  responses:
    200:
      description: entries inserted successfully
      int: number of entries inserted
    400:
      description: invalid body
      text: Bad Request
    401:
      description: user is not an admin
      text: Unauthorized
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/dates/:id

```yaml
delete:
  query:
    id: int
  responses:
    200:
      description: entry deletion is successful
      object:
        id: int
        date: ISOString
        categoryId: int
    400:
      description: invalid date id
      text: Bad Request
    401:
      description: user is not an admin
      text: Unauthorized
    404:
      description: entry with provided id does not exist
      text: Not Found
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/dates/export

```yaml
get:
  query:
    master?: boolean
    userID?: string
    categories?: string (comma separated) # "1,2,3"
  responses:
    200:
      description: generation of iCalendar file is successful
      ICalCalendar: string
    400:
      description: invalid query parameters
      text: Bad Request
    401:
      description: user is not authorized to export dates for query parameters
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
          icon: string
          cron: string
          startDate: ISOString
          endDate: ISOString
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
    icon: string
    isMaster: boolean
    toDelete: Entry[]
  responses:
    200:
      description: update existing category details by its id
      object:
        id: int
        name: string
        description: string
        color: string
        icon: string
        cron: string
        startDate: ISOString
        endDate: ISOString
        isMaster: boolean
        creatorId: string
        entries: Entry[]
    401:
      description: user is not authorized to create a category
      text: Unauthorized
    404:
      description: category does not exist
      text: category does not exist
post:
  body:
    name: string
    description: string
    color: string
    icon: string
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
        icon: string
        cron: string
        startDate: ISOString
        endDate: ISOString
        isMaster: boolean
        creatorId: string
        entries: Entry[]
    401:
      description: user is not authorized to create a category
      text: Unauthorized
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/cats/[id]

```yaml
get:
  responses:
    200:
      description: details about a single category, its dates, and its creator
      object:
        id: int
        icon: string
        name: string
        description: string
        color: string
        cron: string
        startDate: ISOString
        endDate: ISOString
        isMaster: boolean
        creatorId: string
    409:
      description: internal error
      text: There was an error getting the category
delete:
  responses:
    200:
      description: delete a category by its id and return the deleted category
      object:
        id: int
        icon: string
        name: string
        description: string
        color: string
        cron: string
        startDate: ISOString
        endDate: ISOString
        isMaster: boolean
        creatorId: string
    401:
      description: user is not authorized to delete category
      text: Unauthorized
    404:
      description: category does not exist
      text: category does not exist
    409:
      description: internal error
      text: There was an error deleting the category
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```

## /api/cats/batch

```yaml
post:
  body:
    object:
      key: category id
      value: array of dates (YYYY-MM-DD)
  responses:
    201:
      description: batch of entries added to categories
      object:
        success:
          createdEntries: Entry[]
          appData: CategoryFull[]
        error: undefined
    400:
      description: incorrect request body schema
      success: undefined
      error:
        code: integer
        message: string
        uneditableCategories: CategoryID[]
    401:
      description: user attempts to batch add to a category that they do not have access to
      success: undefined
      error:
        code: integer
        message: string
        uneditableCategories: CategoryID[]
    405:
      description: endpoint only allows POST requests
      success: undefined
      error:
        code: integer
        message: string
        uneditableCategories: CategoryID[]
    422:
      description: No changes made to any categories
      success: undefined
      error:
        code: integer
        message: string
        uneditableCategories: CategoryID[]
    500:
      description: internal error
      text: Internal Server Error
other:
  responses:
    405:
      description: invalid method
      text: Method Not Allowed
```
