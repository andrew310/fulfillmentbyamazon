'use struct'
const _ = require('lodash');

const pods = {
  base: {
    volume,
    longestSide,
    isMedia,
    _storageFee
  },
  canada: {
    cubic: cubicMeters,
    multiplier: caMultiplier,
    country: () => 'canada'
  },
  us: {
    cubic: cubicFeet,
    multiplier: usMultiplier,
    country: () => 'us'
  },
  all: {
    cubicFeet,
    usMultiplier,
    cubicMeters,
    caMultiplier
  }
};

function volume (l, w, h) {
  const [ length, width, height ] = _.map([l, w, h], (i) => parseFloat(i));
  return (width * height * length);
}

function longestSide (l, w, h) {
  const [ length, width, height ] = _.map([l, w, h], (i) => parseFloat(i));
  return Math.max(length, width, height);
}

function cubicFeet (volume) {
  return (volume / 1728);
}

function cubicMeters (volume) {
  return (volume / 1000000);
}

function usMultiplier (longestSide) {
  return longestSide < 60
  ? (month) => { return month > 9 ? 2.25 : 0.54 } // standard-size
  : (month) => { return month > 9 ? 1.15 : 0.43 }; // oversize
}

// arg not needed but kept for class to use fns the same
function caMultiplier (arg = null) {
  return (month) => { return month < 9 ? 16 : 23 };
}

function isMedia (category) {
  const media = {
    Books: null,
    Music: null,
    Videos: null,
    'Video Games': null,
    DVDs: null,
    Software: null
  }

  return media.hasOwnProperty(category);
}

function _storageFee (multiplier, cubic) {
  return _.round((multiplier * cubic), 2);
}

module.exports = (countryKey) => _.assign(pods.base, pods[countryKey]);
