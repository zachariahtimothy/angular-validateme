/*!
angular-validateme - 0.0.4
Inline, per-field validation for Angular using the internal Angular and browser validation. Prevents you from needing to add markup manually for each element requiring validation. Customizable but designed for Bootstrap form validation.
Build date: 2014-10-13 
*/
angular.module('validateMe', []);
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
angular.module('validateMe')
.provider('validationOptions', function () {
	'use strict';

	this.animationSpeed = '10';
	this.containerClasses = {
		success: 'has-success',
		error: 'has-error',
		feedback: 'has-feedback'
	};

	this.validationElement = function (errorTag) {
		var choices = {
			required: {
				message: 'This field is required'
			},
			minlength: {
				message: 'Input is not long enough'
			},
			maxlength: {
				message: 'Input is too long'
			},
			pattern: {
				message: 'Pattern not matched'
			},
			min: {
				message: 'Minimum not met'
			},
			max: {
				message: 'Exceeded maximum'
			}
		};
		var choice = choices[errorTag];
		if (!choice) {
			choice = {
				message: 'Invalid input'
			};
		}
		choice.type = choice.type || 'span';
		return angular.element('<' + choice.type + ' class="help-block text-danger ' + errorTag + '">' + choice.message + '</' + choice.type + '>');
	};

	this.validationElement.prototype.setMessage = function (key, message) {
		
	};

	this.$get = function () {
		return {
			containerClasses: this.containerClasses,
			animationSpeed: this.animationSpeed,
			validationElement: this.validationElement
		};
	};
});
angular.module('validateMe')
.service('validationService', ['validationOptions', function (validationOptions) {
	var remove = function () {
		this.remove();
	};
	
	var showErrors = function (container, model) {
		for (var name in model.$error) {
			var foundElement = container.find('.' + name);
			console.log('foundElement',foundElement.length);
			if (model.$error[name]) {
				if (foundElement.length === 0) {
					foundElement = new validationOptions.validationElement(name);
					container.append(foundElement);
				} 
			} else {
				if (foundElement.length > 0) {
					foundElement.fadeOut(validationOptions.animationSpeed, remove);
				} 
			}
		}
	};
	var hideErrors = function (container) {
		var foundElement = container.find('.text-danger');
		if (foundElement) {
			foundElement.fadeOut(validationOptions.animationSpeed, remove);
		}
	};

	return {
		showErrors: showErrors,
		hideErrors: hideErrors
	};
}]);