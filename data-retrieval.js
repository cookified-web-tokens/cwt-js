const { runAsync } = require('./async-util');

const using = (storage, webTokenProvider, key) => {
  let tokenStore = storage;
  let jwt = webTokenProvider;
  let JWT_SECRET_KEY = key;

  const retrieveData = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
  };

  const onRetrievedData = (token) => {
    const subscribe = (onSuccess, onError) => {
      runAsync(() => {
        try {
          const data = jwt.verify(token, JWT_SECRET_KEY)['data'];
          tokenStore.get(token, (err, res) => {
            if (''+data === ''+res) {
              onSuccess(data);
            } else {
              onError('Token not in store', err);
            }
          });
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
          const data = jwt.verify(token, JWT_SECRET_KEY)['data'];
          tokenStore.get(token, (err, res) => {
            if (''+data === ''+res) {
              resolve(data)
            } else {
              reject('Invalid token');
            }
          });
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
