const base = require('./base');
const _ = require('lodash');

class Fba {
  constructor(country) {
    const funcs = require('./base')(country);
    Object.keys(funcs).map((key) => {
      this[key] = funcs[key];
    });
    if (this.country() != country) {
      throw Error('invalid country');
    } else {
      const fbafuncs = require(`./${country}`);
      Object.keys(fbafuncs).map((key) => {
        this[key] = fbafuncs[key];
      })
    }
    this.storageFee = this.storageFee.bind(this);
  }

  storageFee (l, w, h, month) {
    const volume = this.volume(l, w, h);
    const cubic = this.cubic(volume);
    const longestSide = this.longestSide(l, w, h);
    const multiplier = this.multiplier(longestSide)(month);

    return this._storageFee(multiplier, cubic);
  }
}

module.exports = (country) => { return new Fba(country); }
