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