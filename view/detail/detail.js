var _uuid;
window.onload = function() {
  console.log('DETALLE CARGADO');
  var header = document.querySelector('header');


  var client = threads.client('navigation-service');

  client.method('register', 'detail').then(function(uuid) {
    _uuid = uuid;
  });

  client.on('enteringstart', function(properties) {
    if (properties.uuid === _uuid) {
      console.log('enteringstart received en DETALLE');
      // Clean styles before rendering anything new
      header.style.background = '';
      header.classList.remove('fondo');
      header.querySelector('span').textContent = '';

      if (properties.params.title === 'C') {
        header.style.background = '';
        header.classList.add('fondo');
      } else {
        header.style.background = '' + properties.params.color;
        header.querySelector('span').textContent = properties.params.title;
      }
    }
  });

  // var app;
  // window.addEventListener(
  //   'message',
  //   function onMessage (event) {
  //     var action = event.data.split('?')[0];
  //     switch(action) {
  //       case 'init':
  //         app = event.source;
  //         console.log('Detail initialized');
  //         break;
  //       case 'render':
  //         var header = document.querySelector('header');

  //         header.style.background = '';
  //         header.classList.add('fondo');
  //         header.querySelector('span').textContent = '';

  //         var params = event.data.split('?')[1].split('&');

  //         var color = params[0].split('=')[1];
  //         var title = params[1].split('=')[1];

  //         console.log(title);
  //         // Just a test
  //         if (title === 'C') {
  //           header.style.background = '';
  //           header.classList.add('fondo');
  //         } else {
  //           header.style.background = '' + color;
  //           header.querySelector('span').textContent = title;
  //         }
  //         break;
  //     }
  //   }
  // );


  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      client.method(
        'exitingstart',
        _uuid,
        {
          destination: 'list',
          effect: 'fade'
        }
      );
      client.method('exitingend');
    }
  )
}