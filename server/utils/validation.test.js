const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string value', () => {
    var str = 1;
    expect(isRealString(str)).toBe(false);
  });

  it('should rejct empty value', () => {
    var str = '';
    expect(isRealString(str)).toBe(false);

    str = '   ';
    expect(isRealString(str)).toBe(false);
  });

  it('should accept valid value', () => {
    var str = 'david';
    expect(isRealString(str)).toBe(true);
  });
});
