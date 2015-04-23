
window.onload = function() {
  var app;
  window.addEventListener(
    'message',
    function onMessage (event) {
      var action = event.data.split('?')[0];
      switch(action) {
        case 'init':
          app = event.source;
          console.log('Detalle iniciado');
          // app.postMessage('Desde Detalle', '*');
          break;
        case 'color':
          var params = event.data.split('?')[1];
          var color = params.split('=')[1];
          console.log('EL COLOR ES ' + color);

          document.querySelector('header').style.background = '' + color;
          // console.log(document.querySelector('header'));
          break;
      }
    }
  );


  document.getElementById('back-button').addEventListener(
    'click',
    function() {
      // alert('vamos pa tras');
      app.postMessage('back', '*');
    }
  )
}