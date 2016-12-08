'use strict'
const _ = require('lodash');

const fees = {
  pickAndPack,
  isStandardSize,
  weightHandling
};

function pickAndPack (standard, media) {
  return standard ? (media ? 0.90 : 1.55) : 2.65;
}

function isStandardSize (l, w, h, g) {
  const [ length, width, height, grams ] = _.map([l, w, h, g], (i) => parseFloat(i));

  // we are given weight in grams
  const kg = grams / 1000;
  // get longest, median, shortest sides
  const sorted = _.orderBy([length, width, height], 'desc');

  return (
    sorted[0] <= 45 &&
    sorted[1] <= 35 &&
    sorted[2] <= 20 &&
    kg <= 9
  );
}

function weightHandling (weight) {
  return (
    weight <= 100 ? 1.90
    : weight <= 500 ? 1.90 + (0.25 * (Math.ceil(weight - 100) / 100))
    : 3.75 + (0.37 * (weight - 500))
  );
}

module.exports = fees;
