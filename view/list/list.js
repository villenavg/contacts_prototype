var contactsService;
var firstContact = true;
var renderCount = 0;
var maxRenders = 10;
var ul;

function renderContacts(renderCB, onRenderedCB) {
  var stream = contactsService.stream('getAll');
  // Called every time the service sends a contact
  stream.listen(function(data) {
    renderCB(data);
  });

  // "closed" is a Promise that will be fullfilled when stream is closed with
  // success or rejected when the service "abort" the operation
  stream.closed.then(function onStreamClose() {
    onRenderedCB();
  }, function onStreamAbort() {
    onRenderedCB(new Error('Error when rendering'));
  });
}

function renderContact(data) {
  var contact = JSON.parse(data.contact);
  if (firstContact) {
    performance.mark('first_contact_' + renderCount);
    firstContact = false;
  }
  var li = document.createElement('li');
  var name = contact.givenName[0];
  if (data.photo && data.photo.length > 0) {
    var url = URL.createObjectURL(data.photo[0]);
    li.innerHTML = '<div data-contact="' + contact.id + '" data-url="' + url + '" class="background-image" style="background-image:url(' + url + ');">' + name.charAt(0) + '</div>';
  } else {
    li.innerHTML = '<div data-contact="' + contact.id + '" data-color="' + colors[colorIndex] + '">' + name.charAt(0) + '</div>';
    li.querySelector('div').style["background-color"] = colors[colorIndex];
    if (++colorIndex === colors.length -1) {
      colorIndex = 0;
    }
  }
  setTimeout(function() {
    ul.appendChild(li);
  });
}

function allRenderedHandler(e) {
  if (e) {
    alert('ERROR! ');
    return;
  }
  firstContact = true;
  performance.mark('contacts_rendered_' + renderCount);
  performance.measure('first_rendered_' + renderCount, 'request_all_' + renderCount, 'first_contact_' + renderCount);
  performance.measure('all_rendered_' + renderCount, 'request_all_' + renderCount, 'contacts_rendered_' + renderCount);

  if (++renderCount < maxRenders) {
    setTimeout(renderList, 1000);
  } else {
    console.log('******** PERFORMANCE SUMMARY ********');
    var measures = performance.getEntriesByType('measure');
    var performanceResult = {
      first_contact: {
        peak: 0,
        average: 0,
        average_from_first: 0
      },
      all_rendered: {
        peak: 0,
        average: 0,
        average_from_first: 0
      }
    };
    for (var i = 0; i < measures.length; i++) {
      if (i%2 === 0) {
        performanceResult.first_contact.average += measures[i].duration;
        if (i > 0) {
          performanceResult.first_contact.average_from_first += measures[i].duration;
        }

        if (measures[i].duration > performanceResult.first_contact.peak) {
          performanceResult.first_contact.peak = measures[i].duration;
        }
      } else {
        performanceResult.all_rendered.average += measures[i].duration;
        if (i > 1) {
          performanceResult.all_rendered.average_from_first += measures[i].duration;
        }

        if (measures[i].duration > performanceResult.all_rendered.peak) {
          performanceResult.all_rendered.peak = measures[i].duration;
        }
      }
    }


    performanceResult.first_contact.average_from_first = performanceResult.first_contact.average_from_first / (maxRenders - 1);
    performanceResult.all_rendered.average_from_first = performanceResult.all_rendered.average_from_first / (maxRenders - 1);

    performanceResult.first_contact.average = performanceResult.first_contact.average / maxRenders;
    performanceResult.all_rendered.average = performanceResult.all_rendered.average / maxRenders;

    console.log('**** FIRST CONTACT ****');
    console.log('Peak:' + performanceResult.first_contact.peak);
    console.log('Average:' + performanceResult.first_contact.average);
    console.log('Average after the first request:' + performanceResult.first_contact.average_from_first);

    console.log('**** ALL CONTACTS RETRIEVED ****');
    console.log('Peak:' + performanceResult.all_rendered.peak);
    console.log('Average:' + performanceResult.all_rendered.average);
    console.log('Average after the first request:' + performanceResult.all_rendered.average_from_first);

  }
}

function renderList() {
  ul.innerHTML = '';
  performance.mark('request_all_' + renderCount);
  renderContacts(
    renderContact,
    allRenderedHandler
  );
}

// Method for retrieving the position of the element taking as a reference
// the whole document (scroll included)
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    top = _y;
    left = _x;
    return { top: _y, left: _x };
}

var colors = ['#00AACC', '#FF4E00', '#B90000', '#5F9B0A', '#4D4D4D'];
var colorIndex = 0;
// We will cache our UUID in order to establish the communication channel
var _uuid;
// Element clicked must be cached for animations
var element;


var settingsButton;
window.onload = function() {
  ul = document.querySelector('ul');
  settingsButton = document.getElementById('settings-button');
  ul.innerHTML = '';

  // Contacts service
  contactsService = threads.client('contacts-service');




  renderList();

  // var stream = contactsService.stream('getAll');
  // // Called every time the service sends a contact
  // stream.listen(function(data) {
  //   var contact = JSON.parse(data.contact);
  //   var li = document.createElement('li');
  //   var name = contact.givenName[0];
  //   if (data.photo && data.photo.length > 0) {
  //     var url = URL.createObjectURL(data.photo[0]);
  //     li.innerHTML = '<div data-contact="' + contact.id + '" data-url="' + url + '" class="background-image" style="background-image:url(' + url + ');">' + name.charAt(0) + '</div>';
  //   } else {
  //     li.innerHTML = '<div data-contact="' + contact.id + '" data-color="' + colors[colorIndex] + '">' + name.charAt(0) + '</div>';
  //     li.querySelector('div').style["background-color"] = colors[colorIndex];
  //     if (++colorIndex === colors.length -1) {
  //       colorIndex = 0;
  //     }
  //   }



  //   setTimeout(function() {
  //     ul.appendChild(li);
  //   });

  // });

  // // "closed" is a Promise that will be fullfilled when stream is closed with
  // // success or rejected when the service "abort" the operation
  // stream.closed.then(function onStreamClose() {
  //   // // Render colors based on dataset
  //   // var lis = ul.querySelectorAll('li');
  //   // for (var i = 0; i < lis.length; i++) {
  //   //   var div = lis[i].querySelector('div');
  //   //   div.style["background-color"] = div.dataset.color;
  //   // }
  // }, function onStreamAbort() {
  //   console.log('ERROR: Stream aborted');
  // });



  // Navigation service
  var navigation = threads.client('navigation-service');

  navigation.method('register', 'list').then(function(uuid) {
    _uuid = uuid;
  });

  navigation.on('beforenavigating', function(params) {
    if (params.uuid === _uuid) {
      // TODO Currently we dont need anything, but it would be useful
      // for updating the list before showing it again.
      document.querySelector('ul').classList.remove('no-events');
    }
  });

  navigation.on('navigationend', function(params) {
    if (params.uuid === _uuid) {
      document.querySelector('ul').classList.remove('no-events');
      switch(params.previous) {
        case 'detail':
          // Remove effect from element moved previously
          element.style.transform = '';
          element.addEventListener(
            'transitionend',
            function transitionHandler() {
              element.removeEventListener('transitionend', transitionHandler);
              element.classList.remove('selected');
            }
          );
          element.classList.remove('move-me');
          break;
        case 'settings':
          settingsButton.classList.remove('rotate');
          break;
      }
      return;

    }
  });

  // Add listeners for 'tap' actions in the list
  document.querySelector('#settings-button').addEventListener(
    'click',
    function(e) {
      navigation.method(
        'goto',
        _uuid,
        {
          destination: 'settings',
          effect: 'left'
        }
      );

      // Add effects in exiting panels
      settingsButton.addEventListener(
        'transitionend',
        function elementSelectedMove() {
          settingsButton.removeEventListener('transitionend', elementSelectedMove);
          navigation.method('navigationready');
        }
      );

      settingsButton.classList.add('rotate');
    }
  );

  // Add listeners for 'tap' actions in the list
	document.querySelector('ul').addEventListener(
    'click',
    function(e) {
      document.querySelector('ul').classList.add('no-events');
      // Get position for moving the element
      var position = getOffset(e.target);
      // Retrieve the element and add all effects magic
      element = e.target;
      // Let navigation we are moving
      navigation.method(
        'goto',
        _uuid,
        {
          destination: 'detail',
          effect: 'fade',
          params: {
            contact: e.target.dataset.contact || null,
            url: e.target.dataset.url || null,
            color: e.target.dataset.color,
            title: element.textContent
          }
        }
      );

      // Add effects in exiting panels
      element.addEventListener(
        'transitionend',
        function elementSelectedMove() {
          element.removeEventListener('transitionend', elementSelectedMove);
          element.addEventListener(
            'transitionend',
            function elementWidth() {
              element.removeEventListener('transitionend', elementWidth);
              // Send a request in order to navigate to the right panel
              navigation.method('navigationready');
            }
          );

          element.classList.add('move-me');
        }
      );
      element.classList.add('selected');
      element.style.transform = 'translate( ' + (-1 * position.left) + 'px, ' + (-1 * position.top) + 'px)';
    }
  );
}