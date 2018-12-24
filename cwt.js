const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'shhhh...';
const id = 1234;

const generateToken = (data) => {
  if (data === null || data === undefined) {
    throw Error('Invalid data');
  }
  return jwt.sign({data}, JWT_SECRET_KEY);
};

const onGeneratedToken = (data) => {
  const subscribe = (onSuccess, onError) => {
    if (data === null || data === undefined) {
      return onError('Invalid data');
    }
    try {
      const token = jwt.sign({data}, JWT_SECRET_KEY);
      return onSuccess(token);
    } catch(e) {
      return onError('Invalid data or secret key', e);
    }
  }
  return {subscribe};
};

const promiseToken = (data) => {
  return new Promise((resolve, reject) => {
    if (data === null || data === undefined) {
      return reject('Invalid data');
    }
    try {
      const token = jwt.sign({data}, JWT_SECRET_KEY);
      return resolve(token);
    } catch(e) {
      return reject('Invalid data or secret key');
    }
  });
}

const retrieveData = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

const onRetrievedData = (token) => {
  const subscribe = (onSuccess, onError) => {
    try {
      const data = jwt.verify(token, JWT_SECRET_KEY);
      return onSuccess(data['data']);
    } catch (e) {
      return onError('Invalid token', e);
    }
  }
  return {subscribe};
};

const promiseData = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const data = jwt.verify(token, JWT_SECRET_KEY);
      return resolve(data['data']);
    } catch (e) {
      return reject('Invalid token', e);
    }
  });
};

promiseToken(id)
  .then(token => promiseData(token))
  .then(id => console.log('ID:', id))
  .catch(error => console.log(error));




// let token;
// onGeneratedToken(id).subscribe(
//   result => token = result,
//   error => console.log(error)
// );
//
// onRetrievedData(token).subscribe(
//   result => console.log('ID:', result),
//   (msg, error) => console.log(msg)
// );
