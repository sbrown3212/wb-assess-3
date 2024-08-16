import express from 'express';
import session from 'express-session';
import lodash from 'lodash';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import ViteExpress from 'vite-express';

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const MOST_LIKED_FOSSILS = {
  aust: {
    img: '/img/australopith.png',
    name: 'Australopithecus',
    num_likes: 584,
  },
  quetz: {
    img: '/img/quetzal_torso.png',
    name: 'Quetzal',
    num_likes: 587,
  },
  steg: {
    img: '/img/stego_skull.png',
    name: 'Stegosaurus',
    num_likes: 598,
  },
  trex: {
    img: '/img/trex_skull.png',
    name: 'Tyrannosaurus Rex',
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: '/img/ammonite.png',
    name: 'Ammonite',
  },
  {
    img: '/img/mammoth_skull.png',
    name: 'Mammoth',
  },
  {
    img: '/img/ophthalmo_skull.png',
    name: 'Opthalmosaurus',
  },
  {
    img: '/img/tricera_skull.png',
    name: 'Triceratops',
  },
];

// Renders homepage.html, or redirects to /top-fossils if session.name exists
app.get('/', (request, response) => {
  if (!request.session.name) {
    // If name is not saved to session, got to home page
    response.render('homepage.html');
  } else {
    // If name exists in session, redirect to /top-fossils end point
    response.redirect('/top-fossils');
  };
});

// Saves user input from form on homepage to session
app.get('/get-name', (request, response) => {
  request.session.name = request.query.name;
  response.redirect('/top-fossils')
})

// Renders top-fossils.html and sends MOST_LIKED_FOSSILS object and name from session
app.get('/top-fossils', (request, response) => {
  const name = request.session.name;
  if (!request.session.name) {
    // If a name key is not in session data, redirect to homepage
    response.redirect('/');
  } else {
    // If name key is in session data, render top-fossils.html
    response.render('top-fossils.html', {
      MOST_LIKED_FOSSILS,
      name, });
  };
});

// Increment num_likes of fossil from form on top-fossils.html
app.post('/like-fossil', (request, response) => {
  MOST_LIKED_FOSSILS[request.body.fossilKey].num_likes += 1;
  
  // render thank-you.html passing the name saved in session
  response.render('thank-you.html', {
    name: request.session.name,
  })
})

app.get('/random-fossil.json', (req, res) => {
  const randomFossil = lodash.sample(OTHER_FOSSILS);
  res.json(randomFossil);
});

ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
