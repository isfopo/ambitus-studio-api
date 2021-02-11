# Ambitus Studio API

Ambitus Studio is a collaborative music making platform that allows you to create music across the internet with anyone. Supports both audio and midi tracks and works like many moderns DAWs where the smallest unit of music is a clip which is owned by both a track and a scene. A track assigns the timbre of each clip and can only contain clips of either entirely audio or midi. Roughly, this translates to a single instrument, like a guitar or a drumset. A scene is like a section of music that can contain zero or one clip per track that is meant to be played simultaneously with the rest of the clips in the scene.

To start api run these commands in a location you want to store the project:

```shell
git clone https://github.com/isfopo/ambitus-studio-api.git
cd ambitus-studio-api
npm install
npm start
```

This will start a server on your localhost at port 3000.
