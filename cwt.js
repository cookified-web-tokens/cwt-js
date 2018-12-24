const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'shhhh...';
const id = 1234;

const generateToken = (data) => {
  return jwt.sign({data}, JWT_SECRET_KEY);
};

const onGeneratedToken = (data) => {
  const subscribe = (onSuccess, onError) => {
    try {
      const token = jwt.sign({data}, JWT_SECRET_KEY);
      return onSuccess(token);
    } catch(e) {
      return onError('Invalid data or secret key', e);
    }
  }
  return {subscribe};
};

const retrieveData = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

const onRetrievedData = (token) => {
  const subscribe = (onSuccess, onError) => {
    try {
      const data = jwt.verify(token, JWT_SECRET_KEY);
      return onSuccess(data);
    } catch (e) {
      return onError('Invalid token', e);
    }
  }
  return {subscribe};
};

let token;
onGeneratedToken(id).subscribe(
  result => token = result,
  error => console.log(error)
);

onRetrievedData(token).subscribe(
  result => console.log('ID:', result['data']),
  (msg, error) => console.log(msg)
);
