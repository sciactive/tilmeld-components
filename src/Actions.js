import { User } from 'tilmeld-client';

let clientConfig = null;
let clientConfigPromise = null;
export function getClientConfig() {
  if (!clientConfig) {
    if (!clientConfigPromise) {
      clientConfigPromise = User.getClientConfig().then(config => clientConfig = config);
    }
    return clientConfigPromise;
  }
  return Promise.resolve(clientConfig);
}

export function login(username, password) {
  if (username === '') {
    return Promise.reject('You need to enter a username.');
  }
  if (password === '') {
    return Promise.reject('You need to enter a password');
  }

  return User.loginUser({
    username,
    password,
  }).then(
    data => {
      if (!data.result) {
        return Promise.reject(data.message);
      }
      return data;
    },
    err => {
      return Promise.reject(err.message || 'An error occurred.');
    },
  );
}

export function register(userDetails) {
  if (userDetails.username === '') {
    return Promise.reject('You need to enter a username.');
  }
  if (!userDetails.usernameVerified) {
    return Promise.reject('The username you entered is not valid.');
  }
  if (userDetails.password !== userDetails.password2) {
    return Promise.reject('Your passwords do not match.');
  }
  if (userDetails.password === '') {
    return Promise.reject('You need to enter a password');
  }

  // Create a new user.
  let user = new User();
  user.username = userDetails.username;
  return getClientConfig().then(config => {
    if (config.email_usernames) {
      user.email = userDetails.username;
    } else if (config.reg_fields.indexOf('email') !== -1) {
      user.email = userDetails.email;
    }
    if (config.reg_fields.indexOf('name') !== -1) {
      user.nameFirst = userDetails.nameFirst;
      user.nameLast = userDetails.nameLast;
    }
    if (config.reg_fields.indexOf('phone') !== -1) {
      user.phone = userDetails.phone;
    }
    if (config.reg_fields.indexOf('timezone') !== -1) {
      user.timezone = userDetails.timezone;
    }

    return user.$register({ password: userDetails.password }).then(
      data => {
        if (!data.result) {
          return Promise.reject(data.message);
        }
        return data;
      },
      err => {
        return Promise.reject(err.message || 'An error occurred.');
      },
    );
  });
}

export function checkUsername(username) {
  let user = new User();
  user.username = username;
  return getClientConfig().then(config => {
    if (config.email_usernames) {
      user.email = username;
    }
    return user.$checkUsername().then(
      data => ({
        result: data.result,
        message: data.result ? '' : data.message
      }),
      err => ({
        result: false,
        message: 'Error checking username: '+err.message
      })
    );
  });
}