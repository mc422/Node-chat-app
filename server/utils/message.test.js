const expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message', () => {
    var from = 'user123';
    var text = 'A new message';

    var message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({
      from,
      text
    });
  });
});

describe('generateLocationMessage', () => {
  it('should genereate correct location message', () => {
    var from = 'user123';
    var latitude = '123';
    var longitude = '156';
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`

    var message = generateLocationMessage(from, latitude, longitude);
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({
      from,
      url
    });
  });
});
