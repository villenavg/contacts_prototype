
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
    return { top: _y, left: _x };
}

// We will cache our UUID in order to establish the communication channel
var _uuid;
// Element clicked must be cached for animations
var element;

window.onload = function() {

  var client = threads.client('navigation-service');

  client.method('register', 'list').then(function(uuid) {
    _uuid = uuid;
  });

  client.on('beforenavigating', function(params) {
    if (params.uuid === _uuid) {
      // TODO Currently we dont need anything, but it would be useful
      // for updating the list before showing it again.
    }
  });

  client.on('navigationend', function(params) {
    if (params.uuid === _uuid) {
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
    }
  });

  // Render colors based on dataset
  var lis = document.querySelectorAll('li');
  for (var i = 0; i < lis.length; i++) {
    var div = lis[i].querySelector('div');
    div.style["background-color"] = div.dataset.color;
  }

  // Add listeners for 'tap' actions in the list
	document.querySelector('ul').addEventListener(
    'click',
    function(e) {
      // Get position for moving the element
      var position = getOffset(e.target);
      // Retrieve the element and add all effects magic
      element = e.target;
      // Let navigation we are moving
      client.method(
        'goto',
        _uuid,
        {
          destination: 'detail',
          effect: 'fade',
          params: {
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
              client.method('navigationready');
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