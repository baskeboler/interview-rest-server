var _ = require('lodash');
var redis = require('redis');
var crypto = require('crypto');
var uuid = require('node-uuid');


function AuthController() {
  var redisOpts = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  };
  console.log(`redis config ${JSON.stringify(redisOpts)}`);
  this.redisClient = redis.createClient(redisOpts);
  this.redisClient.on('error', err => {
    console.log(`[ERROR] AuthController REDIS :: ${err}`);
  });
}

AuthController.prototype.SESSION_TIMEOUT = 60 * 30;
AuthController.prototype.createUser = function ({
  username,
  password
}) {

  this.redisClient.hmset(`username:${username}`, {
    password: createPasswordHash(password)
  }, function (err, res) {

  })
};

AuthController.prototype.createSession = function ({
  username
}) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var sessionId = uuid.v4();
    var sessionKey = `session:${sessionId}`;
    self.redisClient.set(sessionKey, `username:${username}`, (err, res) => {
      self.redisClient.set(`username:${username}:session`, sessionId);
      self.redisClient.expire(sessionKey, self.SESSION_TIMEOUT, (err, res) => {
        resolve(sessionId);
      })
    });

  })
}

AuthController.prototype.getUser = function ({
  username
}) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.redisClient.hgetall(`username:${username}`, (err, obj) => {
      if (err) {
        return reject(err);
      } else if (_.isNil(obj)) {
        return reject('User does not exist');
        }else {
        self.redisClient.get(`username:${username}:session`, (err, session) => {
          obj.session = session;
          resolve(obj);
        });
      }
    });
  });
}

AuthController.prototype.isValidSessionId = function({sessionId}) {
  return new Promise((resolve, reject) => {
    this.redisClient.get(`session:${sessionId}`, (err, val) => {
      if (_.isNil(err)) {
        resolve(val);
      } else {
        reject(err);
      }
    });
  });
}

AuthController.prototype.login = function ({
  username,
  password
}) {
  return this.getUser({
    username: username
  }).then(user => {
    var hash = createPasswordHash(password);
    if (hash == user.password) {
      // auth success
      return this.createSession({
        username: username
      });
    } else {
      return Promise.reject('Incorrect password.');
    }
  });
}

function createPasswordHash(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('base64');
}

module.exports = AuthController;
