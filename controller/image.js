const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '46c42d2e183b4c748705881006b79edc'
   });

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        return res.json(data);
    })
    .catch(err => res.status(400).json('unable to connect to clarifai'));
}


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
       res.json(entries);
    }).catch(err => res.status(400).json('unable to get entries')); 
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}