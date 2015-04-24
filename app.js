

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
          list.parentNode.classList.remove('effect');
          detail.parentNode.classList.add('show');
          detail.parentNode.classList.add('transitioning');
          detail.parentNode.classList.add('effect');

          detail.contentWindow.postMessage('render?' + params, '*');

          detail.parentNode.addEventListener(
            'transitionend',
            function tmp() {
              detail.parentNode.removeEventListener('transitionend', tmp);
              detail.parentNode.classList.remove('effect');
              detail.parentNode.classList.remove('transitioning');
              list.parentNode.classList.remove('show');
              list.parentNode.classList.remove('current');
            }
          );

          window.requestAnimationFrame(function() {
            detail.parentNode.classList.add('current');
          });
          break;
        case 'back':
          list.parentNode.classList.add('show');
          list.parentNode.classList.add('current');
          list.parentNode.classList.add('transitioning');
          detail.parentNode.classList.add('transitioning');
          detail.parentNode.classList.add('effect');

          detail.parentNode.addEventListener(
            'transitionend',
            function tmp() {
              detail.parentNode.removeEventListener('transitionend', tmp);
              detail.parentNode.classList.remove('show');
              detail.parentNode.classList.remove('effect');
              detail.parentNode.classList.remove('transitioning');
              list.parentNode.classList.remove('transitioning');
              list.contentWindow.postMessage('reset?', '*');
            }
          );

          window.requestAnimationFrame(function() {
            detail.parentNode.classList.remove('current');
          });

          break;
        default:
          console.log('Message not handled.');
      }

    }
  );
}