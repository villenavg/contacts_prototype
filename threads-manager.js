/*global threads*/

threads.manager({
  'navigation-service': {
    src: 'services/navigation.js',
    type: 'worker'
  }
});