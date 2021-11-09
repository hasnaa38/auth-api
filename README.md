# auth-api

## Description

This is a fully authenticated API server.

## Links

## Endpoints

## Tests

### Auth Routes Testing

- happy sign-up scenario for all roles - can add records to the db
- happy basic auth sign-in scenario for all roles
- happy bearer auth scenario using the correct token
- basic auth sign-in with correct username but incorrect password
- basic auth sign-in with unsigned user (doesn't have a record)
- bearer auth with incorrect token

### v1 Routes Testing

- Can add an item to the DB and returns an object with the added item
- Can return a list of all :model items
- Can return a single item by ID
- Can return a single updated item by ID
- Can delete a record and returns an empty object after

## v2 Routes Testing

- Can create a record in the DB and returns an object with the added item

## UML