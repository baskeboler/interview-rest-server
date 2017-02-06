var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');

/* GET users listing. */
router.get('/', function (req, res) {
  var pageOpts = {
    pageNumber: req.query.page || 0,
    pageSize: req.query.pageSize || 10
  };
  var list = userController.find(pageOpts);
  res.setHeader('PAGINATION-TOTAL', userController.getSize());
  res.setHeader('PAGINATION-PAGE', pageOpts.pageNumber);
  res.setHeader('PAGINATION-SIZE', pageOpts.pageSize);
  res.status(200).send(list);
});

module.exports = router;
