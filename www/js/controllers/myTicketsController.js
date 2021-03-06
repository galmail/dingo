/**
 * MyTickets controller.
 *
 */

dingo.controllers.controller('MyTicketsCtrl', function($scope,$location,$stateParams,$ionicActionSheet,$ionicPopup,Ticket,Event,Category,User,Util) {

	$scope.tickets = [];
  $scope.currentTicket = null;
  $scope.currentEvent = null;

  $scope.showSellingTickets = function(){
    $location.path("/app/mytickets/selling");
  };

  $scope.showSoldTickets = function(){
    $location.path("/app/mytickets/sold");
  };

  $scope.showPurchasedTickets = function(){
    $location.path("/app/mytickets/purchased");
  };

  $scope.gotoTicketDetails = function(ticket,action){
    var ticketId = ticket.id;
    var eventId = ticket.event_id;
    window.location.href += '/' + eventId + '/' + ticketId + '/' + action;
  };

  $scope.showOptions = function(){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<b>Modify</b>' }
      ],
      destructiveText: 'Delete',
      titleText: 'Ticket Options',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
        hideSheet();
      },
      buttonClicked: function(index){
        if(index>0) return false;
        var editTicketUrl = window.location.href.replace('show','edit');
        window.location.href = editTicketUrl;
        return true;
      },
      destructiveButtonClicked: function(){
        var confirmPopup = $ionicPopup.confirm({
          title: 'Imporant Message',
          template: 'Are you sure you want to delete this ticket?'
        });
        confirmPopup.then(function(yes) {
          if(yes){
            Ticket.deleteTicket($scope.currentTicket,function(){
              alert('Ticket Deleted!');
              $location.path('/app/mytickets');
            });
          }
        });
        return true;
      }
    });
  };

  $scope.modifyTicket = function(){
    Ticket.editTicket($scope.currentTicket,function(){
      alert('Ticket modified successfully!');
    });
  };

	var init = function(){
		console.log('Running MyTickets Controller...');
    var ticketsType = $stateParams.ticketsType;
    $scope.showContextMenu = (ticketsType=='selling');
    var eventId = $stateParams.eventId;
    var ticketId = $stateParams.ticketId;
    var allLoaded = {};
    var loaded = function(key){
      allLoaded[key] = true;
      for(obj in allLoaded){
        if(allLoaded[obj]==false) return false;
      }
      // done loading
      Util.hideLoading();
    };
    if(eventId){
      allLoaded.event = false;
      Event.getById(eventId,function(event){
        $scope.currentEvent = event;
        $scope.currentEvent.category_image = Category.getImage($scope.currentEvent.category_id);
        loaded('event');
      });
    }
    if(ticketId){
      allLoaded.ticket = false;
      Ticket.getById(ticketId,function(ticket){
        $scope.currentTicket = Ticket.parseTicket(ticket);
        loaded('ticket');
      });
    }
    if(ticketsType){
      allLoaded.mytickets = false;
      $scope.ticketsType = Util.capitalizeFirstLetter(ticketsType);
      Ticket.getMyTickets($scope.ticketsType,function(tickets){
        $scope.tickets = tickets;
        loaded('mytickets');
      });
    }
    if(Util.isEmptyObject(allLoaded)){
      Util.hideLoading();
    }
	};

  // run on init for every controller
  (function(){
    Util.showLoading();
    if(User.isLogged()){
      init();
    } else {
      User.registerToLoginCallback(init,'MyTicketsCtrl');
    }
  })();
  
});
