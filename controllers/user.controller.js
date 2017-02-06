var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var dataMap = {};
var data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/cards.json'), 'utf-8')).map(card => [card.username, card]);
data.forEach(card => dataMap[card[0]] = card[1]);
console.log('user cards loaded.');

function controller(cards){
  this.data = cards;
}
// controller.data = data;
controller.prototype.find = function({pageNumber, pageSize}) {
  var keys = Object.keys(this.data);
  var values = _.map(_.range(pageNumber*pageSize, pageNumber*pageSize + pageSize), n => this.data[keys[n]]);
  // this.data
    // .slice(pageNumber*pageSize)
    // .forEach((value, key) => values.push(value));
  return values;
};

controller.prototype.getSize = function() {
  return Object.keys(this.data).length;
}

module.exports = new controller(dataMap);
