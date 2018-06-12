var socket = io();

socket.on('connect', function () {
  console.log('connect to server');
});

socket.on('disconnect', function () {
  console.log('disconnect to server');
});

socket.on('newMessage', function (message) {
  console.log('Receive new message', message);

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var hyperLink = jQuery('<a target="_blank">Current Location</a>');

  li.text(`${message.from}: `);
  hyperLink.attr('href', message.url);
  li.append(hyperLink);
  jQuery('#messages').append(li);
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
