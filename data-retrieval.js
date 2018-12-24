const { runAsync } = require('./async-util');

const using = (webTokenProvider, key) => {
  let jwt = webTokenProvider;
  let JWT_SECRET_KEY = key;

  const retrieveData = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
  };

  const onRetrievedData = (token) => {
    const subscribe = (onSuccess, onError) => {
      runAsync(() => {
        try {
          const data = jwt.verify(token, JWT_SECRET_KEY);
          return onSuccess(data['data']);
        } catch (e) {
          return onError('Invalid token', e);
        }
      });
    }
    return {subscribe};
  };

  const promiseData = (token) => {
    return new Promise((resolve, reject) => {
      runAsync(() => {
        try {
          const data = jwt.verify(token, JWT_SECRET_KEY);
          return resolve(data['data']);
        } catch (e) {
          return reject('Invalid token', e);
        }
      });
    });
  };

  const resetSecretKey = (newKey) => {
    JWT_SECRET_KEY = newKey;
  };

  return {
    retrieveData,
    onRetrievedData,
    promiseData,
    resetSecretKey
  };
};

module.exports = { using };
