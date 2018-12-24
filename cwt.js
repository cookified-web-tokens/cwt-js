const redisClient = require("redis").createClient();
// redisClient.on("error", (err) => console.log("Dang it" + err));

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'shhhh...';
const {
  generateToken,
  onGeneratedToken,
  promiseToken
} = require('./token-generation')
    .using(redisClient, jwt, JWT_SECRET_KEY);
const {
  retrieveData,
  onRetrievedData,
  promiseData
} = require('./data-retrieval').using(jwt, JWT_SECRET_KEY);

const id = 1234;

promiseToken(id)
  .then(token => promiseData(token))
  .then(id => console.log('ID:', id))
  .catch(error => console.log(error));

onGeneratedToken(id).subscribe(
  result => {
    onRetrievedData(result).subscribe(
      result => console.log('ID:', result),
      (msg, error) => console.log(msg, error)
    );
  },
  (msg, error) => console.log(msg, error)
);
