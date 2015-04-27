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

var _uuid;
window.onload = function() {
  var client = threads.client('navigation-service');

  client.method('register', 'list').then(function(uuid) {
    _uuid = uuid;
  });

  client.on('enteringstart', function(params) {
    if (params.uuid === _uuid) {
      console.log('enteringstart received en LISTA');
    }
  });

  // client.method('exitingstart').then(function(value) {
  //   console.log('VAMOS! ' + value);
  // });


  // client.method('waitforevent');
  // client.on('pepito', function() {
  //   console.log('Event received en LISTA');
  // });

  // Render colors based on dataset
  var lis = document.querySelectorAll('li');
  for (var i = 0; i < lis.length; i++) {
    var div = lis[i].querySelector('div');
    div.style["background-color"] = div.dataset.color;
  }

  // Connect with parent
  var app;
  var element;
  // window.addEventListener(
  //   'message',
  //   function onMessage (event) {
  //     // Cache parent
  //     app = event.source;
  //     // Retrieve action requested
  //     var action = event.data.split('?')[0];

  //     switch(action) {
  //       case 'init':
  //         console.log('List initialized');
  //         break;
  //       case 'reset':
  //         // Remove effect from element moved previously
  //         element.style.transform = '';
  //         element.addEventListener(
  //           'transitionend',
  //           function tmp() {
  //             element.removeEventListener('transitionend', tmp);
  //              element.classList.remove('selected');
  //           }
  //         );
  //         element.classList.remove('move-me');
  //         break;
  //     }
  //   }
  // );

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
        'exitingstart',
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
        function tmp() {
          element.removeEventListener('transitionend', tmp);
          // Add params to be sent to the parent
          // var params = 'color='+ e.target.dataset.color;
          // params += '&title=' + element.textContent;
          element.addEventListener(
            'transitionend',
            function tmp2() {
              element.removeEventListener('transitionend', tmp2);
              // Send a request in order to navigate to the right panel
              client.method('exitingend');
              // app.postMessage('navigate?' + params, '*');
            }
          );

          element.classList.add('move-me');
        }
      );
      element.classList.add('selected');
      // element.classList.add('move-me');
      element.style.transform = 'translate( ' + (-1 * position.left) + 'px, ' + (-1 * position.top) + 'px)';
    }
  );
}