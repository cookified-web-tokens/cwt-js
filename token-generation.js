const { runAsync } = require('./async-util');

const using = (storage, webTokenProvider, key) => {
  let tokenStore = storage;
  let jwt = webTokenProvider;
  let JWT_SECRET_KEY = key;

  const generateToken = (data) => {
    if (data === null || data === undefined) {
      throw Error('Invalid data');
    }
    const token = jwt.sign({data}, JWT_SECRET_KEY);
    tokenStore.set(token, data);
    return token;
  };

  const onGeneratedToken = (data) => {
    const subscribe = (onSuccess, onError) => {
      runAsync(() => {
        if (data === null || data === undefined) {
          return onError('Invalid data');
        }
        try {
          const token = jwt.sign({data}, JWT_SECRET_KEY);
          tokenStore.set(token, data);

          return onSuccess(token);
        } catch(e) {
          return onError('Invalid data or secret key', e);
        }
      });
    }
    return {subscribe};
  };

  const promiseToken = (data) => {
    return new Promise((resolve, reject) => {
      runAsync(() => {
        if (data === null || data === undefined) {
          return reject('Invalid data');
        }
        try {
          const token = jwt.sign({data}, JWT_SECRET_KEY);
          tokenStore.set(token, data);
          return resolve(token);
        } catch(e) {
          return reject('Invalid data or secret key');
        }
      });
    });
  };

  const resetSecretKey = (newKey) => {
    JWT_SECRET_KEY = newKey;
  };

  return {
    generateToken,
    onGeneratedToken,
    promiseToken,
    resetSecretKey
  };
};

module.exports = { using };
