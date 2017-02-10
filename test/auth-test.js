var AuthController = require('../controllers/auth.controller');

var ctrl = new AuthController();

ctrl.createUser({
  username: 'user1',
  password: 'pass1'
});

ctrl.createSession({
  username: 'user1'
}).then(console.log).catch(console.log);


ctrl.getUser({username: 'user1'}).then(console.log).catch(console.log);

ctrl.login({
  username: 'user1',
  password: 'pass1'
}).then(console.log).catch(console.log);


ctrl.login({
  username: 'user1',
  password: 'pass2'
}).then(console.log).catch(console.log);
