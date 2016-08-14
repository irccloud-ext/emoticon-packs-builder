module.exports = function (obj) {
  var newObj = {};
  for (var i in obj.channels) {
    newObj[i] = {
      name: 'twitch-sub-' + i,
      match: 'word',
      template: '<img src="//static-cdn.jtvnw.net/emoticons/v1/:image_id/1.0" alt=":match" title=":match">',
      icons: []
    };
    for (var j in obj.channels[i].emotes) {
      newObj[i].icons.push({
        match: obj.channels[i].emotes[j].code,
        image_id: obj.channels[i].emotes[j].image_id,
      });
    }
  }
  return newObj;
};
