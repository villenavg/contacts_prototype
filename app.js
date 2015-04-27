

window.onload = function() {
  var list = document.getElementById('list-iframe');
  var detail = document.getElementById('detail-iframe');


  var client = threads.client('navigation-service');

  // Listen about requests of navigation
  client.on('navigate', function(params) {
    // TODO Add a switch in order to have multiple transitions

    // Get panels registered
    var fromPanel = document.getElementById(params.from);
    var toPanel = document.getElementById(params.to);

    // Add the 'magic'
    fromPanel.classList.add('effect');
    toPanel.classList.add('effect');

    // Show the next panel first
    toPanel.classList.add('future');

    toPanel.addEventListener(
      'transitionend',
      function transitionHandler() {
        toPanel.removeEventListener('transitionend', transitionHandler);

        fromPanel.classList.remove('effect');
        toPanel.classList.remove('effect');
        fromPanel.classList.remove('current');
        toPanel.classList.remove('future');

        // Let our service that navigation is over
        client.method('navigationend');
      }
    );
    toPanel.classList.add('current');
  });
}