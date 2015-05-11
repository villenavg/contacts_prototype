var _uuid;
var performance = window.parent.performance;

window.onload = function() {
  // Retrieve header from DOM
  var header = document.querySelector('header');
  var infoContainer = document.querySelector('#info-container');

  // Connect with our 'service' of navigation.
  var contactsService = threads.client('contacts-service');

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
      infoContainer.innerHTML = '';
      header.style.background = '';
      header.classList.remove('image-hack'); // XXX Remove hack for image

      // Update title properly
      header.querySelector('span').textContent = properties.params.title;

      if (!!properties.params.url) {
        // header.style.backgroundImage = 'url(' +properties.params.url+');';
        header.style.backgroundImage = 'url("' + properties.params.url +'")';
        header.classList.add('image-hack');
      } else {
        header.style.background = '' + properties.params.color;
      }

      // First of all every panel must be registered.
      performance.mark('request_get_contact_service');
      contactsService.method('get', properties.params.contact).then(function(contactSerialized) {
        performance.mark('received_contact_from_service');
        performance.measure('contact_from_service', 'request_get_contact_service', 'received_contact_from_service');
        // XXXX Optimize this when ready
        var contact = JSON.parse(contactSerialized);

        var infoHeader = document.createElement('h2');
        infoHeader.textContent = 'Name';
        var infoUL = document.createElement('ul');
        infoUL.innerHTML = '<li>' + contact.name[0] + '</li>';

        infoContainer.appendChild(infoHeader);
        infoContainer.appendChild(infoUL);


        if (contact.email && contact.email.length > 0) {
          var emailHeader = document.createElement('h2');
          emailHeader.textContent = 'Email/s';
          var emailUL = document.createElement('ul');
          for (var i = 0; i < contact.email.length; i++) {
            emailUL.innerHTML += '<li>' + contact.email[i].value + '</li>';
          }


          infoContainer.appendChild(emailHeader);
          infoContainer.appendChild(emailUL);
        }

        if (contact.tel && contact.tel.length > 0) {
          var telHeader = document.createElement('h2');
          telHeader.textContent = 'Phone number/s';
          var telUL = document.createElement('ul');
          for (var i = 0; i < contact.tel.length; i++) {
            telUL.innerHTML += '<li>' + contact.tel[i].value + '</li>';
          }

          infoContainer.appendChild(telHeader);
          infoContainer.appendChild(telUL);
        }
        // Get access to iframe-details performance object
        performance.mark('contact_rendered');
        performance.measure('contact_detail_rendered', 'request_get_contact', 'contact_rendered');

        console.log('************* CONTACT FROM SERVICE *************')
        var contact_service_measures = performance.getEntriesByName('contact_from_service');
        var last_measure = contact_service_measures[contact_service_measures.length - 1];
        console.log('Got the contact from the service in: ' + last_measure.duration);
        console.log();
        console.log("************* RENDER OF A CONTACT'S DETAIL *************");
        var durations_measures = performance.getEntriesByName('contact_detail_rendered');
        var last_measure = durations_measures[durations_measures.length - 1];
        console.log('Rendered in: ' + last_measure.duration);
      });
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