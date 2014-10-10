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