'use strict'
const _ = require('lodash');

const fees = {
  estimateFbaFee,
  productSizeTier,
  outboundWeight
};

function estimateFbaFee (profile, media, weight) {
  const tierName = media ? profile + ' Media' : profile + ' Non-Media';

  const standardBase = {
    'Standard-Size Media': {
      'order-handling': 0,
      'pick-pack': 1.06
    },
    'Standard-Size Non-Media': {
      'order-handling': 1,
      'pick-pack': 1.06
    }
  };

  // const oversizeBase = {
  //   'Oversize': {
  //     'order-handling': 0
  //   },
  // }

  const tiers = {
    'Small Standard-Size': (weight, media) => {
      let fees = {};
      fees['weight-handling'] = 0.47 * Math.ceil(weight);
      const rmSize = tierName.substr(tierName.indexOf(' ') + 1);
      _.merge(fees, standardBase[rmSize]);

      fees['total'] = _.round(_.valuesIn(fees).reduce((a, b) => a + b), 2);
      return fees;
    },
    // NOV - DEC PRICING!!
    'Large Standard-Size': (weight, media) => {
      let fees = {};
      if (media) {
        fees['weight-handling'] = weight <= 1 ? 0.71
        : weight <= 2 ? 0.95 : 0.95 + (weight - 2) * 0.37;
      } else {
        fees['weight-handling'] = weight <= 1 ? 0.82
        : weight <= 2 ? 1.66 : 1.66 + Math.ceil((weight - 2)) * 0.35;
      }
      1.66 + 2.11 * 0.35
      fees['weight-handling'] = _.round(fees['weight-handling'], 2);
      const rmSize = tierName.substr(tierName.indexOf(' ') + 1);
      _.merge(fees, standardBase[rmSize]);

      fees['total'] = _.round(_.valuesIn(fees).reduce((a, b) => a + b), 2);
      return fees;
    }
  }

  return tiers[profile](weight, media);
}

function productSizeTier (length, width, height, weight, media) {
  const girth = 2 * (width + height) + length;
  // convert to longest, media, shortest sides
  const sorted = _.orderBy([length, width, height], 'desc');
  const grouped = _.zipObject(['longest', 'median', 'shortest'], sorted);
  // create object and combine with girth and weights
  const product = _.assign(grouped, {girth}, {weight});
  // make array
  const arr = _.valuesIn(product, (item) => {
    return item;
  });

  const prelimTiers = {
    '15 12 .75 n/a .75': 'Small Standard-Size',
    '18 14 8 n/a 20': 'Large Standard-Size',
    '60 30 n/a 130 70': 'Small Oversize',
    '108 n/a n/a 130 150': 'Medium Oversize',
    '108 n/a n/a 165 150': 'Large Oversize',
    '9999999 n/a n/a 9999999 9999999': 'Special Oversize'
  };

  // .875 lbs = 14 ounces
  const mediaTier = {'15 12 .75 n/a .875': 'Small Standard-Size'}
  const tiers = media ? _.merge(mediaTier, prelimTiers) : prelimTiers;

  const answer = _.find(_.keysIn(tiers), (row) => {
    return compare(arr, row.split(' '));
  })

  function compare (product, tier) {
    const res = _.zip(product, tier);
    return res.every((item) => {
      const spex = parseFloat(item[1]) || item[1];
      return item[0] <= spex || spex === 'n/a';
    });
  }

  return tiers[answer];
}

function outboundWeight (length, width, height, weight) {
  if (weight <= 1) {
    return Math.ceil(weight + 0.25);
  }
  const volume = length * width * height;
  const dimWeight = volume / 166;
  return Math.ceil(Math.max(dimWeight, weight) + 0.25);
}

module.exports = fees;
