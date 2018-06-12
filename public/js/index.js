var socket = io();

socket.on('connect', function () {
  console.log('connect to server');
});

socket.on('disconnect', function () {
  console.log('disconnect to server');
});

socket.on('newMessage', function (message) {
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var messageHtml = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formatedTime
  });

  jQuery('#messages').append(messageHtml);
});

socket.on('newLocationMessage', function (message) {
  var formatedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var messageHtml = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formatedTime
  });

  jQuery('#messages').append(messageHtml);
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  locationButton.attr('disabled', true).text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.attr('disabled', false).text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.attr('disabled', false).text('Send location');
    alert('Unable to fetch location');
  });
});
