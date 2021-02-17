# Ambitus Studio API

Ambitus Studio is a collaborative music making platform that allows you to create music across the internet with anyone. Supports both audio and midi tracks and works like many moderns DAWs where the smallest unit of music is a clip which is owned by both a track and a scene. A track assigns the timbre of each clip and can only contain clips of either entirely audio or midi. Roughly, this translates to a single instrument, like a guitar or a drumset. A scene is like a section of music that can contain zero or one clip per track that is meant to be played simultaneously with the rest of the clips in the scene.

## Setup

To start api run these commands in a location you want to store the project:

```shell
git clone https://github.com/isfopo/ambitus-studio-api.git
cd ambitus-studio-api
npm install
npm start
```

This will start a server on [localhost:3000](http://localhost:3000).

(Uses node.js version 14.15.4)

## Project Plan

### Setup project

- [x] Create server
- [x] Integrate Sequelize
- [x] Install postgres

### Setup database

- [x] Build models
- [x] Connect tables with associations

### Define routes

- [x] User
- [x] Project
- [x] Scene
- [x] Track
- [x] Clip
- [x] Message

### Define tests

- [ ] User

  - [x] check creation parameters
    - [x] has valid username
    - [x] has valid password
  - [ ] check if is in database

- [ ] Project

  - [ ] check creation parameters
    - [ ] User is on database
    - [x] valid user id, name, tempo, time signature
  - [ ] check if is in database

- [ ] Scene

  - [ ] check creation parameters
    - [ ] project is in database
    - [x] valid name, tempo and time signature if present
  - [ ] check if is in database

- [ ] Track

  - [ ] check creation parameters
    - [ ] project is in database
    - [x] valid name and settings
  - [ ] check if is in database

- [ ] Clip

  - [ ] check creation parameters
    - [ ] track and scene are in database
    - [ ] valid name, type, tempo and time signature
  - [ ] check if is in database

- [ ] Message

  - [ ] check creation parameters
    - [ ] user is in database
    - [ ] project is in database
    - [x] has valid content

- [ ] Helpers
  - [x] validate name
  - [x] validate password
  - [x] validate tempo
  - [x] validate time signature
  - [x] validate message content
  - [x] validate settings
  - [x] validate types
  - [ ] authorize user to change user
  - [ ] authorize user to change project and contents (scenes, track and clips)

### Define handlers

- [ ] User

  - [x] check creation parameters
    - [x] has valid username
    - [x] has valid password
  - [ ] check if is in database

- [ ] Project

  - [ ] check creation parameters
    - [ ] User id is on database
    - [x] valid id, tempo, time signature
  - [ ] check if is in database

- [ ] Scene

  - [ ] check creation parameters
    - [ ] project is in database
    - [x] have valid id
    - [ ] valid name, tempo and time signature if present
  - [ ] check if is in database

- [ ] Track

  - [ ] check creation parameters
    - [ ] project is in database
    - [x] valid name, type and settings
  - [ ] check if is in database

- [ ] Clip

  - [ ] check creation parameters
    - [ ] track and scene are in database
    - [ ] valid name, type, tempo and time signature
  - [ ] check if is in database

- [ ] Message

  - [ ] check creation parameters
    - [ ] user is in database
    - [ ] project is in database
    - [x] has id and valid content

- [ ] Helpers
  - [x] validate name
  - [x] validate password
  - [x] validate tempo
  - [x] validate time signature
  - [x] validate message content
  - [x] validate settings
  - [x] validate types
  - [ ] authorize user to change user
  - [ ] authorize user to change project and contents (scenes, track and clips)

### Add route functionality

- [ ] **User**

  - [ ] authentication
    - [ ] sign-up
    - [ ] login
  - [ ] authorization
  - [ ] create User
  - [ ] get User data
  - [ ] change name
  - [ ] change avatar
  - [ ] leave project
  - [ ] delete user

- [ ] **Project**

  - [ ] create a new project
  - [ ] get all projects
  - [ ] get info about one project
  - [ ] get all scenes in a project
  - [ ] get all tracks in a project
  - [ ] get all clips in project organized by scenes and tracks
  - [ ] change name of project
  - [ ] change tempo of project
  - [ ] change time signature of project
  - [ ] change order of scenes
  - [ ] change order of tracks
  - [ ] invite a user to a project
  - [ ] accept an invitation to a project
  - [ ] request access to a project
  - [ ] accept a request to a project
  - [ ] undo
  - [ ] redo

- [ ] **Scene**

  - [ ] create a new scene at end of scenes in project
  - [ ] get info about a scene
  - [ ] get all clips in scene
  - [ ] change tempo of scene
  - [ ] change time signature of scene
  - [ ] delete scene and all clips in scene

- [ ] **Track**

  - [ ] create a new track at end of tracks in project
  - [ ] get info about a track
  - [ ] get all clips in track
  - [ ] change name of track
  - [ ] change settings of track
  - [ ] delete track and all clips in track

- [ ] **Clip**

  - [ ] create new clip referencing a scene and a track
    - [ ] gather metadata and return an id
  - [ ] add content to clip
    - [ ] take id and add audio or midi to clip
  - [ ] get metadata of clip, including reference to content
  - [ ] get content of clip
  - [ ] delete clip

- [ ] **Message**
  - [ ] create a new message
  - [ ] get all messages in project

### Review

- [ ] has acceptable coverage
- [ ] all tests are passing

### Deploy
