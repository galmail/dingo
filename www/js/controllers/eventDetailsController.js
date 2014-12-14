/**
 * Event Details controller.
 *
 */

dingo.controllers.controller('EventDetailsCtrl', function($scope) {

	$scope.tickets = [];

	for(var i=0;i<20;i++){
		$scope.tickets.push({
			name: 'Ticket ' + (i+1),
			photo: 'http://s3-us-west-2.amazonaws.com/dingoapp-test/events/photos/057/899/f5-/tiny_pic/Xmas-K.jpg?1416413614'
		});
	};

});