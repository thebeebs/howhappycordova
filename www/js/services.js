angular.module('starter.services', [])

.factory('Results', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
    var chats = [];

  return {
      all: function () {
      return chats;
      },
      clear: function () {
          chats = [];
      },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    add: function (dataurl, scores) {
        var item = {};
        item.id = chats.length + 1;
        item.name = "User";
        item.lastText = "Happy";
        item.face = dataurl;
        item.happiness = this.round(scores.happiness);
        item.anger = this.round(scores.anger);
        item.contempt = this.round(scores.contempt);
        item.disgust = this.round(scores.disgust);
        item.fear = this.round(scores.fear);
        item.neutral = this.round(scores.neutral);
        item.sadness = this.round(scores.sadness);
        item.surprise = this.round(scores.surprise);
        chats.push(item);
    },
    round: function (val) {
        return Math.round(val * 1000) / 1000
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
