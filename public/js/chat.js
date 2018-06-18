var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  var parmas = jQuery.deparam(window.location.saerch);
  socket.emit('join', parmas, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('disconnect to server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach((user) => {
     ol.append(jQuery('<li></li>').text(user));
  })

  jQuery('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
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
