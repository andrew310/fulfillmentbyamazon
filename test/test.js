const should = require('should');

describe('constructor', function() {
  describe('given us country key', function() {
    it('should set up for us', function(){
      const fba = require('..')('us');
      fba.country().should.eql('us');
    })
  }),
  describe('given canada country key', function(){
    it('should set up client for canada', function(){
      const fba = require('..')('canada');
      fba.country().should.eql('canada');
    })
  }),
  describe('given non-existent country key', function(){
    it('should throw an error', function(){
      const foo = () => require('..')('foo')
      should(foo).throw('invalid country');
    })
  })
})

describe('base and storage functions', function(){
  describe('volume', function(){
    describe('given 14, 11.3, 0.9', function (){
      it('should be 142.38000000000002', function(){
        const fba = require('..')('us');
        fba.volume(14, 11.3, 0.9).should.eql(142.38000000000002);
      })
    })
  }),
  describe('longestSide', function(){
    describe('given 14, 11.3, 0.9', function () {
      it('should be 14', function() {
        const fba = require('..')('us');
        fba.longestSide(14, 11.3, 0.9).should.eql(14);
      })
    })
  }),
  describe("isMedia", function() {
    describe('given all media items', function() {
      it("should be true", function() {
        const categories =  ['Books', 'Music', 'Videos', 'Video Games', 'DVDs', 'Software'];
        const fba = require('..')('us');
        const result = categories.every((item) => {
          return fba.isMedia(item) ? true : false;
        });
        result.should.be.true;
      })
    }),
    describe('given one non media item', function() {
      it("Should be false", function() {
        const categories =  ['Books', 'Music', 'Videos', 'Video Games', 'Toys', 'Software'];
        const fba = require('..')('canada');
        const result = categories.every((item) => {
          return fba.isMedia(item) ? true : false;
        })
        result.should.be.false;
      })
    }),
    describe('given all non media items', function() {
      it("Should be false", function() {
        const categories =  ['Apparel', 'Toys'];
        const fba = require('..')('canada');
        const result = categories.every((item) => {
          return fba.isMedia(item) ? true : false;
        })
        result.should.be.false;
      })
    })
  }),
  describe('cubic --feet', function() {
    describe('given 142.38000000000002', function() {
      it('should be 0.08239583333333335', function() {
        const fba = require('..')('us');
        const result = fba.cubic(fba.volume(14, 11.3, 0.9));
        result.should.eql(0.08239583333333335)
      })
    })
  }),
  describe('cubic --meters', function() {
    describe('given 142.38000000000002', function() {
      it('should be 0.00014238000000000003', function() {
        const fba = require('..')('canada');
        const result = fba.cubic(fba.volume(14, 11.3, 0.9));
        result.should.eql(0.00014238000000000003);
      })
    })
  }),
  describe('multiplier --us', function() {
    describe('given 14, 11.9, 0.9 (standard size), beginning of year', function() {
      it("Should be .54", function() {
        const width = 11.3;
        const height = 0.9;
        const length = 14;
        const fba = require('..')('us');
        const result = fba.multiplier(fba.longestSide(length, width, height))(8);
        result.should.eql(0.54);
      })
    }),
    describe('given 14, 11.9, 0.9 (standard size), end of year', function() {
      it("Should be 2.25", function() {
        const width = 11.3;
        const height = 0.9;
        const length = 14;
        const fba = require('..')('us');
        const result = fba.multiplier(fba.longestSide(length, width, height))(10);
        result.should.eql(2.25);
      })
    })
  }),
  describe('multiplier --canada', function() {
    describe('given beginning of year', function() {
      it("Should be 16", function() {
        const width = 11.3;
        const height = 0.9;
        const length = 14;
        const fba = require('..')('canada');
        const result = fba.multiplier(fba.longestSide(length, width, height))(8);
        result.should.eql(16);
      })
    }),
    describe('given end of year', function() {
      it("Should be 23", function() {
        const width = 11.3;
        const height = 0.9;
        const length = 14;
        const fba = require('..')('canada');
        const result = fba.multiplier(fba.longestSide(length, width, height))(9);
        result.should.equal(23);
      })
    })
  }),
  describe('storageFee --us', function() {
    describe('given standard size, end of year', function() {
      it("Should be .19", function() {
        const width = 11.3;
        const height = .9;
        const length = 14;
        const fba = require('..')('us');
        const result = fba.storageFee(11.3, .9, 14, 11);
        result.should.eql(0.19);
      });
    })
  }),
  describe('storageFee --ca', function() {
    describe('given standard size, end of year', function() {
      it("Should be .01", function() {
        const fba = require('..')('canada');
        const result = fba.storageFee(9.19, 6.8, 6.59, 10);
        result.should.eql(.01);
      })
    }),
    describe('given standard size, end of year', function() {
      it("Should be .11", function() {
        const fba = require('..')('canada');
        const result = fba.storageFee(22.59, 18.4, 11.19, 10);
        result.should.eql(.11);
      })
    })
  })
})
