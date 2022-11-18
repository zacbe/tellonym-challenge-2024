# Tellonym Test Task

## Usage

1. Install Docker
2. Install docker-compose (not the compose plugin): https://docs.docker.com/compose/install/other/
3. Run `yarn docker:up` to start and `yarn docker:down` to stop
4. Run `yarn` to install dependencies
5. Run `yarn watch` and start with tasks

## Task 1

We want to clean up our code base and introduce our new coding schemes also to older routes. Therefore,
please refactor the /deletenewestmessage route that you find in /src/routes/chats.ts and add necessary test.
For the refactor we also want to move SQL logic out of the route and into our logics folder.

## Task 2

Please create 2 new routes that we need for a new feature. Also create necessary tests for the routes and handle error cases.
Checkout the [notion page](https://tellonym.notion.site/Test-Task-User-Interview-Routes-cfb301e9a13841e8a961a0c70f20dcbb) for concept details.
