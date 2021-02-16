# Route Documentation

## User Routes

### POST api/sign-up

- create a new user
  - success returns id, name and avatar (if present)
  - return error if no name an password are sent
  - return error if name is not unique

### GET api/user/login

- authorizes session for an onboarded user
  - return error if no user is present

### GET api/user/[id]

- get id, name and avatar of user
  - returns error if no user matches sent id

### PUT api/user/name/[id]

- updates name of user
  - returns error if no user matches sent id
  - must be authorized by user (add password or token)

### PUT api/user/avatar/[id]

- updates avatar of user
  - returns error if no user matches sent id
  - must be authorized by user (add password or token)

### PUT api/user/leave/[id]

- remove a project from user's projects
  - must receive user id and project id
  - must be authorized by user
  - when all users are gone, delete project (send warning when last user is leaving)

### DELETE api/user/[id]

- deletes user
  - must be authorized by user

## Project Routes

### POST api/project

- creates a new project
  - needs a userID
  - adds user to project's users and project to user's projects
  - project name is defaults to "Untitled" if not given
  - tempo defaults to 120 if not given
  - time signature defaults to "4/4" if not given

### GET api/project/[id]

- gets array of scenes with clip data and array of tracks
  - user must be in projects users
  - allows option to subscribe to changes in project

### PUT api/project/invite/[id]

- adds a user to list of invited users
  - notifies other user on invitation
  - returns error if no user name is given
  - returns error if user name does not exist
  - returns error if sender is not a user in project

### PUT api/project/accept/[id]

- accepts invitation
  - adds new user to list of users
  - removes user from invited users list

### PUT api/project/scene/[id]

- changes order of scenes

### PUT api/project/track/[id]

- changes order of tracks

### PUT api/project/name/[id]

- changes name of project

### PUT api/project/tempo/[id]

- changes tempo if project
  - validate within 30-300 bpm

### PUT api/project/time-signature/[id]

- changes time signature if project
  - validate to logical time signatures

### PUT api/project/undo/[id]

- reverts project back to last backlog entry
  - removes last backlog, adds to frontlog

### PUT api/project/redo/[id]

- reverts project back to first frontlog entry
  - removes first frontlog, adds to backlog

## Scene Routes

### POST api/scene

- creates a new scene at end of scenes
  - returns error if no projectID is given
  - returns error if user is not in project

### GET api/scene/[id]

- returns array of clips in scene
  - returns error if no userID, projectID and sceneID are given
  - returns error if user is not in project

### PUT api/scene/tempo/[id]

- add tempo change to scene
  - 'null' will return to global tempo
  - returns error if no userID, projectID and sceneID are given
  - returns error if user is not in project

### PUT api/scene/time-signature/[id]

- add tempo change to scene
  - 'null' will return to global time signature
  - returns error if no userID, projectID and sceneID are given
  - returns error if user is not in project

### DELETE api/scene/[id]

- deletes scene
  - returns error if there are clips in scene
  - option to override and delete anyway
  - returns error if no userID, projectID and sceneID are given
  - returns error if user is not in project

## Track Routes

### POST api/track

- creates new track at end of tracks
  - return error if no projectId of type
  - default name to "track" followed by track number
  - default settings to empty object

### GET api/track/[id]

- get id, name, type and setting from track

### PUT api/track/name/[id]

- change name of track
  - return error if no projectId, new name or trackId is present

### PUT api/track/settings/[id]

- changes settings of track
  - return error if no projectId, settings or trackId are present

### DELETE api/track/[id]

- deletes track
  - returns error if there are clips on track
  - option to override and delete anyway
  - returns error if no userID, projectID and trackID are given
  - returns error if user is not in project

## Clip Routes

### POST api/clip

- creates new clip
  - returns error if no type, content or tempo is given
  - name defaults to 'clip' followed by clip number

### GET api/clip/[id]

- get info from clip
  - returns error if no userID, songId, projectId and sceneId is not present
  - returns error if user is not in project

### PUT api/clip/record/[id]

- replace content of clip
  - returns error if no content or tempo is given
  - returns error if no userID, songId, projectId and sceneId is not present
  - returns error if user is not in project

### PUT api/clip/name/[id]

- change name of clip
  - returns error if no userID, songId, projectId and sceneId is present
  - returns error if user is not in project

### DELETE api/clip/[id]

- delete clip
  - returns error if no userID, songId, projectId and sceneId is present
  - returns error if user is not in project

## Message Routes

### POST api/message

- post a new message
  - return error if no projectId and userId is present
  - return error if user is not in project

### GET api/message

- get all messages in room
  - return as array of object
  - return error no projectId and userId is present
  - return error if user is not in project
