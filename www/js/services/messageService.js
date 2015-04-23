/**
 * Message Service.
 *
 */

dingo.services.factory('Message', function($http) {

  return {

    active_peer: {},

    getPeers: function(callback){
      $http.get('/api/v1/messages/peers').success(function(peers){
        callback(peers);
      });
    },

    loadChat: function(conversationId,callback){
      $http.get('/api/v1/messages?conversationId='+conversationId).success(function(res){
        callback(res.messages.reverse());
      });
    },

    sendMessage: function(msg,callback){
      var self = this;
      $http.post('/api/v1/messages',{
        receiver_id: self.active_peer.user_id,
        content: msg
      }).success(callback);
    }
    

  };

});