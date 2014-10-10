angular.module('app', ['validateMe'])
.config(function (validationOptionsProvider) {
	
});

function isProd() {
  return (window.location.href.indexOf('http://zachariahtimothy.github.io/angular-validateme') >= 0);
}