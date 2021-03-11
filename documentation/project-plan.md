# Project Plan

## Setup project

- [x] Create server
- [x] Integrate Sequelize
- [x] Install postgres

## Setup database

- [x] Build models
- [x] Connect tables with associations

## Define routes

- [x] User
- [x] Project
- [x] Scene
- [x] Track
- [x] Clip
- [x] Message

## Define tests

- [x] User

  - [x] check creation parameters
    - [x] has valid username
    - [x] has valid password

- [x] Project

  - [x] check creation parameters
    - [x] User is on database
    - [x] valid user id, name, tempo, time signature

- [x] Scene

  - [x] check creation parameters
    - [x] project is in database
    - [x] valid name, tempo and time signature if present

- [x] Track

  - [x] check creation parameters
    - [x] project is in database
    - [x] valid name and settings
  - [x] check if is in database

- [x] Clip

  - [x] check creation parameters
    - [x] track and scene are in database
    - [x] valid id and type
    - [x] valid name, tempo and time signature if present
  - [x] check if is in database

- [x] Message

  - [x] check creation parameters
    - [x] user is in database
    - [x] project is in database
    - [x] has valid content

- [x] Helpers
  - [x] validate name
  - [x] validate password
  - [x] validate tempo
  - [x] validate time signature
  - [x] validate message content
  - [x] validate settings
  - [x] validate types
  - [x] authorize user to change user
  - [x] authorize user to change project and contents (scenes, track and clips)

## Define handlers

- [x] User

  - [x] check creation parameters
    - [x] has valid username
    - [x] has valid password
  - [x] check if is in database
  - [x] login

- [x] Project

  - [x] check creation parameters
    - [x] User id is on database
    - [x] valid id, tempo, time signature

- [x] Scene

  - [x] check creation parameters
    - [x] project is in database
    - [x] have valid id
    - [x] valid name, tempo and time signature if present
  - [x] check if is in database

- [x] Track

  - [x] check creation parameters
    - [x] project is in database
    - [x] valid name, type and settings
  - [x] check if is in database

- [x] Clip

  - [x] check creation parameters
    - [x] track and scene are in database
    - [x] valid name, type, tempo and time signature
  - [x] check if is in database

- [x] Message

  - [x] check creation parameters
    - [x] user is in database
    - [x] project is in database
    - [x] has id and valid content

- [x] Helpers
  - [x] validate name
  - [x] validate password
  - [x] validate tempo
  - [x] validate time signature
  - [x] validate message content
  - [x] validate settings
  - [x] validate types
  - [x] authorize user to change user
  - [x] authorize user to change project and contents (scenes, track and clips)

## Add route functionality

- [x] **User**

  - [x] authentication
    - [x] sign-up
    - [x] login
  - [x] authorization
  - [x] create User
  - [x] get User data
  - [x] get User's projects
  - [x] get user's avatar
  - [x] get project user has been invited to
  - [x] change name
  - [x] change avatar
  - [x] accept an invitation to a project
  - [x] delete user

- [ ] **Project**

  - [x] create a new project
  - [x] get info about all projects
  - [x] get info about one project
  - [x] get users in project
  - [x] get scenes in projects
  - [x] get tracks in project
  - [ ] subscribe to changes in project
  - [x] get all scenes in a project
  - [x] get all tracks in a project
  - [x] change name of project
  - [x] change tempo of project
  - [x] change time signature of project
  - [ ] change order of scenes
  - [ ] change order of tracks
  - [x] invite a user to a project
  - [x] request access to a project
  - [x] accept a request to a project
  - [x] leave project
  - [ ] undo action
  - [ ] redo undo

- [ ] **Scene**

  - [x] create a new scene at end of scenes in project
  - [x] get info about a scene
  - [x] get all clips in scene with track ids
  - [ ] add or change tempo of scene
  - [ ] add or change time signature of scene
  - [ ] delete scene and all clips in scene

- [ ] **Track**

  - [x] create a new track at end of tracks in project
  - [x] get info about a track
  - [x] get all clips in track with scene ids
  - [ ] change name of track
  - [ ] change settings of track
  - [ ] delete track and all clips in track

- [ ] **Clip**

  - [ ] add/change content to clip
    - [ ] take id and add audio or midi to clip
  - [x] get metadata of clip, including reference to content
  - [x] get id of clip by SceneId and ProjectId
  - [ ] get content of clip by ClipId
  - [ ] remove content from clip

- [x] **Message**
  - [x] create a new message
  - [x] get all messages in project

## Review

- [ ] has acceptable coverage
- [ ] all tests are passing
- [ ] clean up code and docs

## Deploy
