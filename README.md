# Ambitus Studio API

Ambitus Studio is a collaborative music making platform that allows you to create music across the internet with anyone. Supports both audio and midi tracks and works like many moderns DAWs where the smallest unit of music is a clip which is owned by both a track and a scene. A track assigns the timbre of each clip and can only contain clips of either entirely audio or midi. Roughly, this translates to a single instrument, like a guitar or a drumset. A scene is like a section of music that can contain zero or one clip per track that is meant to be played simultaneously with the rest of the clips in the scene.

## Setup

This project will need to use PostgreSQL. If you do not have it installed on your machine, please use the following instructions:
[Windows](https://www.postgresqltutorial.com/install-postgresql/) ||
[Mac](https://www.postgresqltutorial.com/install-postgresql-macos/) ||
[Linux](https://www.postgresqltutorial.com/install-postgresql-linux/)

To start api run these commands in a location you want to store the project:

```shell
git clone https://github.com/isfopo/ambitus-studio-api.git
cd ambitus-studio-api
npm install
npm start
```

This will seed the database and start a server on [localhost:3000](http://localhost:3000).

(Uses node.js version 14.15.4)

## Demonstration

Using either Insomnia or Postman with the server running, feel free to explore any available route. Routes with multiple functionality (like GET /project) will have separate request demonstrations to show each way to use the route.

Some routes require an authorization token in order to work. The routes that do have a placeholder token, but that token will not work because it is expired. To get a fresh token, use the "Login" request. You can use the default example user "jim" which has access to the rest of the example requests, or, after using the "Create User" request, login to your newly created user.

This token can be copied and pasted into the authorization header of any route that requires it and expires after an hour. After that to continue to use the api, request another token via the "Login" request.

## Socket Demo

To see client-to-client real-time updates using Socket.io, open the repo [ambitus-studio-api-socket-demo](https://github.com/isfopo/ambitus-studio-api-socket-demo)

While having this api running, follow the instructions in the README.md.

## testing

To run tests, have the repo download and the dependencies installed then run:

```shell
npm test
```

This will run all tests. To run only specific test suites, see package.json. All test scripts are prefixed with "test-" and can be run using "npm run script-name"

## Challenges

- Authentication and authorization

  - hashes and safely stores passwords using bcrypt.
  - allows users to have an access token for authentication using JSON Web Token.
  - has two authentication processes - one to authorize the user and another to allow user to have access to a given project.

- File Storage

  - uses multer to store an audio or image file on the system, saving the path to that file in the database
  - deletes old file when new file is added

- Testing
  - uses Mocha and the node assert library to drive unit driven development
  - learning best practices regarding breaking down functionality led to smarter refactoring and abstraction of code and ultimately produced better code faster than without testing

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Sequelize
- Mocha
- bcrypt
- JWT
- multer

For project breakdown, see [/documentation/project-plan.md](https://github.com/isfopo/ambitus-studio-api/blob/main/documentation/project-plan.md)
