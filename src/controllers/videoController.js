import Video from '../models/Video.js';

export const homeController = async (req, res) => {
  const pageTitle = `Welcome Home`;
  try {
    const videoDB = await Video.find();
    res.render('home.pug', { pageTitle, videoDB });
  } catch (error) {
    res.render('serverError', { error });
  }
};

export const searchController = (req, res) => {
  res.send('Search Videos');
};

export const videoDetailController = async (req, res) => {
  const pageTitle = `Watching `;
  const videoID = req.params;
  console.log(videoID);
  const videoDB = await Video.findById(videoID.id);
  console.log(videoDB);
  if (videoDB) {
    res.render('videoDetail', { pageTitle, videoDB });
  } else {
    res.render('status404', { pageTitle: `404 error! Video not found` });
  }
};

export const videoGetEditController = async (req, res) => {
  const videoID = req.params.id;
  const videoDB = await Video.findById(videoID);
  console.log(videoDB);
  const pageTitle = `Edit`;
  if (!videoDB) {
    return res.render('status404', { pageTitle: 'Video not found!' });
  } else {
    return res.render('editVideo', {
      pageTitle: `Edit: ${videoDB.title}`,
      videoDB,
    });
  }
};

export const videoPostEditController = async (req, res) => {
  console.log(req.body);
  const videoID = req.params.id;
  const videoDB = await Video.findById(videoID);
  if (!videoDB) {
    return res.render('status404', { pageTitle: 'Video not found!' });
  }
  const { title, description, hashTags } = req.body;
  videoDB.title = title;
  videoDB.description = description;

  videoDB.hashTags = hashTags
    .split(',')
    .map((word) => (word.startsWith('#') ? word : `#${word}`));
  await videoDB.save();
  res.redirect('edit');
};

export const videoGetUploadController = (req, res) => {
  const pageTitle = `Upload Video`;
  res.render('uploadVideo', { pageTitle });
};
export const videoPostUploadController = async (req, res) => {
  const { title, description, hashTags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashTags: hashTags
        .split(',')
        .map((word) => (word.startsWith('#') ? word : `#${word}`)),
    });
    res.redirect('/');
  } catch (error) {
    const errorMessage = error._message;
    res.render('uploadVideo', { errorMessage });
  }
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
