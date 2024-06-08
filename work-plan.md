# Implementation

## Data model

## Data Model

The `user_interviews` table stores information about user interviews. Below is the schema for the table:

| Column       | Type         | Description                           |
| ------------ | ------------ | ------------------------------------- |
| id           | INT          | Primary Key, Auto Increment           |
| availability | DATE         | Date of user's availability           |
| phone_number | VARCHAR(255) | User's phone number                   |
| birthdate    | DATE         | User's birth date                     |
| created_at   | TIMESTAMP    | Timestamp when the record was created |

### SQL Table Creation

```sql
CREATE TABLE IF NOT EXISTS `tellonym_testing`.`user_interviews` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `availability` DATE NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `birthdate` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## Endpoints

### POST /userinterview

This endpoint allows the creation of a new user interview record.

#### Request Body Parameters:

- `availability` (date): The date of user's availability.
- `phone_number` (varchar): The user's phone number.
- `birthdate` (date): The user's birth date.

#### Example Request:

```json
{
  "availability": "2024-01-01",
  "phone_number": "123-456-7890",
  "birthdate": "2000-01-01"
}
```

#### Example Response:

```json
{
  "insertId": 1
}
```

### GET /userinterview

This endpoint retrieves the latest user interviews, ordered from newest to oldest.

#### Query Parameters:

- `limit` (int): The number of entries to retrieve. Default value is 20 if not specified.

#### Example Request:

```
GET /userinterview?limit=10
```

#### Example Response:

```json
{
  "payload": {
    "data": {
      "1": {
        "id": 1,
        "availability": "2024-01-01",
        "phone_number": "123-456-7890",
        "birthdate": "2000-01-01",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    },
    "ids": [1]
  },
  "meta": {
    "hasMore": false
  }
}
```

## The Logic

Following the original project structure, new methods have been created for the `Chats` and `UserInterviews` tables. The logic is broken down into smaller, more manageable pieces to improve understanding and maintainability.

### Chats Table Methods:

- **deleteMessageById**: Deletes a message by its ID.
- **getNewestMessageId**: Retrieves the newest message ID for a given chat.
- **deleteNewestMessage**: Deletes the newest message in a chat.

### UserInterviews Table Methods:

- **createUserInterview**: Creates a new user interview record.
- **getLatestUserInterviews**: Retrieves the latest user interviews with a specified limit.
- **countUserInterviews**: Counts the total number of user interview records in the database.

## Endpoints

- `POST /userinterview`:
  Allows for 3 paramaters inside the body:

  - availability: date
  - phone_number: varchar
  - birthdate: date

- `GET /userinterview`:
  Allos for 1 parameter in the query string:
  - limit: int

## The Logic

Following the original project structure, I created new methods for Chats table.

- deleteMessageById
- getNewestMessageId
- deleteNewestMessage

Methods for UserInterviews table:

- createUserInterview
- getLatestUserInterviews
- countUserInterviews

The ideas is to break down the logic into smaller pieces and make it easier to understand and maintain.

## Testing

Integration tests have been created for both the refactored `deletenewestmessage` endpoint and the new `userinterview` endpoints (POST and GET).
