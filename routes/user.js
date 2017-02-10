var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var _ = require('lodash');

/* GET users listing. */
router.get('/', function (req, res) {
  var pageOpts = {
    pageNumber: _.toNumber(req.query.page) || 0,
    pageSize: _.toNumber(req.query.pageSize) || 10
  };
  var list = userController.find(pageOpts);
  list = _.map(list, card => _.pick(card, [
    'name', 'username', 'email',
    'address', 'phone', 'website',
    'company'])
  );
  res.setHeader('PAGINATION-TOTAL', userController.getSize());
  res.setHeader('PAGINATION-PAGE', pageOpts.pageNumber);
  res.setHeader('PAGINATION-SIZE', pageOpts.pageSize);
  res.status(200).send(list);
});

router.get('/:username', (req, res) => {
  var card = userController.get({
    username: req.params.username
  });
  if (_.isObject(card)) {
    res.status(200).send(_.pick(card, [
      'name', 'username', 'email',
      'address', 'phone', 'website',
      'company'
      ])
    );
  } else {
    res.status(404).end();
  }
});

router.get('/:username/posts', (req, res) => {
  var card = userController.get({
    username: req.params.username
  });
  if (card != null) {
    res.status(200).send(card.posts);
  } else {
    res.status(404).end();
  }
});

router.get('/:username/account-history', (req, res) => {
  var card = userController.get({
    username: req.params.username
  });
  if (card != null) {
    res.status(200).send(card.accountHistory);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
