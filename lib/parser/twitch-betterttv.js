module.exports = function (obj) {
  var newObj = {
    name: 'twitch-betterttv',
    match: 'word',
    template: '<img src="//cdn.betterttv.net/emote/:image_id/1x" alt=":match" title=":match">',
    icons: [],
  }, i, key = '', value = '';
  if (obj.hasOwnProperty('emotes')) {
    obj.emotes.forEach(function (emote) {
      newObj.icons.push({ match: emote.code, image_id: emote.id });
    });
  }
  return newObj;
};
