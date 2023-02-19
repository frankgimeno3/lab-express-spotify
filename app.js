require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
  });  

app.get("/artist-search", (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists);
            res.render('artist-search-results', data.body.artists)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res, next) => {
    let id = req.params.id
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            res.render("albums", data.body)
        })
        .catch(err => next(err))  
});


app.get("/tracks/:trackId", (req, res, next) => {
    let trackId = req.params.trackId
    spotifyApi
        .getAlbumTracks(trackId)
        .then(data => {
            res.render("track-information", data.body)
        })
        .catch(err => next(err))
})

  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
