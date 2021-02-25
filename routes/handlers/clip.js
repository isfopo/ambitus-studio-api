const validate = require("./helpers/validate");

const Clip = require("../../db/models").Clip;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.sceneId) {
    errors.push("body should contain an sceneId");
  } else if (!body.trackId) {
    errors.push("body should contain an trackId");
  } else if (!body.tempo) {
    errors.push("body should contain a tempo");
  } else if (!body.time_signature) {
    errors.push("body should contain a time_signature");
  }

  try {
    validate.id(body.sceneId);
    validate.id(body.trackId);
    validate.tempo(body.tempo);
    validate.timeSignature(body.time_signature);
    body.name && validate.name(body.name);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return body;
  }
};

/**
 * determines if given clip id is present in database
 * @param {string} id the id of the clip to be found
 * @returns {boolean} if the clip is found
 */
const isInDatabase = async (id = "") => {
  const clip = await Clip.findByPk(id);

  if (clip === null) {
    throw new Error("Couldn't find requested clip in database");
  } else {
    return clip;
  }
};

const post = async (req, res) => {
  try {
    const clipParameters = validatePost(req.body);

    const scene = await Scene.isInDatabase(req.body.sceneId);
    const track = await Track.isInDatabase(req.body.trackId);

    const clip = await scene.createClip({
      name: clipParameters.name,
      tempo: clipParameters.tempo,
      time_signature: clipParameters.time_signature,
    });

    await track.addClip(clip); // TODO: overwrite a clip with the same scene and track

    return res.status(200).json(clip);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const get = async (req, res) => {
  try {
    const clip = await Clip.findByPk(req.body.id);
    return res.status(200).json(clip);
  } catch (e) {
    return res.status(404).json(e);
  }
};

const getContent = async (req, res) => {
  const clip = await isInDatabase(req.body.id);
  const stream = Readable.from(clip.content);

  stream.pipe(res);
};

const putName = async (req, res) => {
  const clip = await User.findByPk(req.body.id);

  clip.name = req.body.name;
  await clip.save();

  res.status(200).json(clip);
};

const putContent = async (req, res) => {
  const clip = await isInDatabase(req.body.id);

  if ((clip.type = req.file.mimetype)) {
    const clipBuffer = fs.readFileSync(req.file.path);
    clip.content = clip;
    await clip.save();

    res.status(200).json(clip);
  } else {
    return res.status(400).json({
      error: "Clip type cannot be changed. Put clip in new track instead.",
    });
  }
};

module.exports = {
  validatePost,
  isInDatabase,
  post,
  get,
  getContent,
  putName,
  putContent,
};
