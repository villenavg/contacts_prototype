
window.onload = function() {
  var app;
  window.addEventListener(
    'message',
    function onMessage (event) {
      var action = event.data.split('?')[0];
      switch(action) {
        case 'init':
          app = event.source;
          console.log('Detail initialized');
          break;
        case 'render':
          var header = document.querySelector('header');

          header.style.background = '';
          header.classList.add('fondo');
          header.querySelector('span').textContent = '';

          var params = event.data.split('?')[1].split('&');

          var color = params[0].split('=')[1];
          var title = params[1].split('=')[1];

          console.log(title);
          // Just a test
          if (title === 'C') {
            header.style.background = '';
            header.classList.add('fondo');
          } else {
            header.style.background = '' + color;
            header.querySelector('span').textContent = title;
          }
          break;
      }
    }
  );


  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      app.postMessage('back', '*');
    }
  )
}