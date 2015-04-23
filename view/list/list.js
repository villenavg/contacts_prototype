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

window.onload = function() {
  // Render different colors
  var lis = document.querySelectorAll('li');
  for (var i = 0; i < lis.length; i++) {
    var div = lis[i].querySelector('div');
    div.style.background = div.dataset.color;
  }

  // Connect with parent
  var app;
  var element;
  window.addEventListener(
    'message',
    function onMessage (event) {
      app = event.source;
      var action = event.data.split('?')[0];
      console.log('ACTION ' + action);
      switch(action) {
        case 'init':
          console.log('Lista iniciada');
          // app.postMessage('Desde lista', '*');
          break;
        case 'reset':

          element.style.transform = '';
          element.classList.add('delay');
          element.classList.remove('move-me');
          break;
      }
    }
  );


	document.querySelector('ul').addEventListener(
    'click',
    function(e) {
      var position = getOffset(e.target);
      console.log(window.pageYOffset);
      console.log(position);
      element = e.target;
      e.target.addEventListener(
        'transitionend',
        function() {
          console.log('terminado');
        }
      );
      e.target.style.transform = 'translate( -' + position.left + 'px, -' + position.top + 'px)';
      e.target.classList.add('move-me');
      app.postMessage('navigate?color = ' + e.target.dataset.color, '*');
		}
  );


}