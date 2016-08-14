module.exports = function (obj) {
  var newObj = {
    name: 'twitch-global',
    match: 'word',
    template: '<img src="//static-cdn.jtvnw.net/emoticons/v1/:image_id/1.0" alt=":match" title=":match">',
    icons: []
  };
  Object.keys(obj.emotes).forEach(function (key) {
    newObj.icons.push({ match: key, image_id: obj.emotes[key].image_id })
  });
  return newObj;
};
