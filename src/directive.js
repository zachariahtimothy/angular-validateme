angular.module('validateMe')
.directive('validation', ['validationService', 'validationOptions', function (validationService, validationOptions) {
	'use strict';
	return {
		priority: 9999, /// Important! Need this so built-in parsers work first
		scope: false,
		require: ['ngModel','^form'],
		link: function (scope, element, attrs, ctrls) {
			var $validElement = angular.element('<span class="form-control-feedback glyphicon glyphicon-ok control-valid" />');
			var $errorElement = angular.element('<span class="form-control-feedback glyphicon glyphicon-remove control-invalid" />');

			var model = ctrls[0];
      var form = ctrls[1];
      var container = element.parent();
      
      /// Append the base feedback containers to the parent.
      container.append($validElement).append($errorElement);

      model.$parsers.push(function (viewValue) {
      	if (model.$dirty) {
      		container.addClass(validationOptions.containerClasses.feedback);
      		/// Models valid, show it
	      	if (model.$valid) {
	      		container.addClass(validationOptions.containerClasses.success);
	      	} else {
	      		container.removeClass(validationOptions.containerClasses.success);
	      	}
	      	/// Model invalid, tell them how bad they suck
	      	if (model.$invalid) {
	      		container.addClass(validationOptions.containerClasses.error);
	      		validationService.showErrors(container, model);
	      	} else {
	      		validationService.hideErrors(container);
	      		container.removeClass(validationOptions.containerClasses.error);
	      	}
	      }
	      return viewValue;
      
      });
    
		}
	};
}]);