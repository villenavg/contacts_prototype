var _uuid;
window.onload = function() {
  // Retrieve header from DOM
  var header = document.querySelector('header');

  // Connect with our 'service' of navigation.
  var client = threads.client('navigation-service');

  // First of all every panel must be registered.
  client.method('register', 'detail').then(function(uuid) {
    _uuid = uuid;
  });

  // If we want to navigate to this panel, we will execute some
  // activities before navigating (for example start retrieving
  // info from contacts)
  client.on('beforenavigating', function(properties) {
    if (properties.uuid === _uuid) {
      // Clean styles before rendering anything new
      header.style.background = '';
      header.classList.remove('image-hack'); // XXX Remove hack for image

      // Update title properly
      header.querySelector('span').textContent = properties.params.title;

      // XXX Remove hack with image
      if (properties.params.title === 'C') {
        header.style.background = '';
        header.classList.add('image-hack');
      } else {
        header.style.background = '' + properties.params.color;
      }
    }
  });

  // Add listener to the 'back' button
  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      client.method(
        'goto',
        _uuid,
        {
          destination: 'list',
          effect: 'fade'
        }
      );
      // No need to wait, due to no animation is needed in Detail
      client.method('navigationready');
    }
  )
}