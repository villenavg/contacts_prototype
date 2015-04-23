

window.onload = function() {
  var list = document.getElementById('list-iframe');
  var detail = document.getElementById('detail-iframe');
  list.contentWindow.postMessage('init?', '*');
  detail.contentWindow.postMessage('init?', '*');



  window.addEventListener(
    'message',
    function onMessage (event) {
      console.log(event.data);
      var action = event.data.split('?')[0];
      var params = event.data.split('?')[1];
      switch(action) {
        case 'navigate':
          // TODO Leer parametros
          console.log('Navega desde lista!!!');
          detail.parentNode.addEventListener(
            'transitionend',
            function tmp() {
              detail.parentNode.removeEventListener('transitionend', tmp);

              setTimeout(function() {
                detail.parentNode.classList.remove('transitioning');
                list.parentNode.classList.remove('current');
              }, 100);

            }
          )
          detail.parentNode.classList.add('transitioning');
          list.parentNode.classList.remove('effect');
          detail.parentNode.classList.add('effect');
          setTimeout(function() {
            detail.parentNode.classList.add('current');
          }, 500);

          detail.contentWindow.postMessage('color?' + params, '*');
          break;
        case 'back':
          // alert('vamos!');
          list.parentNode.classList.add('transitioning');
          list.parentNode.classList.add('current');
          detail.parentNode.classList.add('transitioning');
          // // detail.parentNode.classList.remove('current');
          // // console.log('Back a la lista');
          detail.parentNode.addEventListener(
            'transitionend',
            function tmp() {
              detail.parentNode.removeEventListener('transitionend', tmp);
              detail.parentNode.classList.remove('transitioning');
              list.parentNode.classList.remove('transitioning');
            }
          )

          // list.parentNode.classList.remove('current');

          setTimeout(function() {
            detail.parentNode.classList.remove('current');
          }, 500);


          // // list.parentNode.classList.add('transitioning');
          // // list.parentNode.classList.add('current');
          list.contentWindow.postMessage('reset?', '*');
          break;
        default:
          console.log('Mensaje aun no reconocido');
      }

    }
  );
}