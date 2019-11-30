import Playlists from '../../api/playlists/playlists_collection.js';
import Shows from '../../api/shows/shows_collection.js';
import Profiles from '../../api/users/profiles_collection.js';
import moment from 'moment-timezone';
import { default as momentUtil } from 'moment';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

function currentDay(row) {
  var now = getLocalTime(), { showDate, startTime } = row;
  return showDate.getYear() === now.year() &&
    showDate.getMonth() === now.month() &&
    showDate.getDate() === now.date() &&
    parseInt(startTime.split(':')[0], 10) <= now.hour();
}

export const getLocalTime = function() {
  return moment.tz('Pacific/Honolulu');
};

export const currentPlaylist = function() {
  return Playlists.find({
    $where: function() {
      return currentDay(this);
    }
  }, { sort: { showDate: -1, startTime: -1 }, limit: 1 });
};

export const lastPlaylist = function() {
  var ret = currentPlaylist();
  if (!ret.length) {
    ret = Playlists.find({}, { sort: { showDate: -1,
      startTime: -1 }, limit: 1 });
  }
  return ret;
};

export const currentPlaylistFindOne = function() {
  var now = getLocalTime(),
    playlist = Playlists.findOne({
      $where: function() {
        return currentDay(this);
      }
    }, { sort: { startTime: -1 } });

  if (playlist &&
    now.getHours() >= parseInt(playlist.endTime.split(':')[0], 10)) {
    return undefined;
  }
  else {
    return playlist;
  }
};

export const currentShow = function() {
  let now = getLocalTime(),
    show = Shows.findOne({ active: true, startDay: now.day(),
      startHour: { $lte: now.hour() },
      endDay: now.day() }, { sort: { startHour: -1 } });

  if (show === undefined) return undefined;

  let { endMinute, endHour, startMinute } = show;

  if (startMinute === 1) { startMinute--; }

  if (endMinute === 59) {
    endMinute = 0;
    endHour = (endHour + 1) % 24;
  }

  if (endHour && now.hour() < endHour) {
    return show;
  }
  else if (endHour === 0 && now.hour() < 24) {
    return show;
  }
  else {
    return undefined;
  }
};

export const nextShow = function() {
  let now = getLocalTime(),
    sameDay = Shows.findOne({ active: true, startDay: now.day(),
      startHour: { $gt: now.hour() }, endDay: now.day() }),
    tmr1 = Shows.findOne({ active: true, startDay: {
      $gte: (now.day() + 1) % 7 }
    }, { sort: { startDay: 1, startHour: 1, startMinute: 1 } }),
    tmr2 = Shows.findOne({ active: true, startDay: { $gte: 0 } },
      { sort: { startDay: 1, startHour: 1, startMinute: 1 } });
  return sameDay || tmr1 || tmr2;
};

export const thumbnailUrl = function(url, maxW) {
  Meteor.call('requestFrom', url, maxW, (err, data) => {
    if (!err) return data;
  });
  return `https://s3-${Meteor.settings.awsRegion}.amazonaws.com/${
    Meteor.settings.bucket}/thumbs/${url.split('/').slice(-1)[0]}.jpg`;
};

export const displayNameById = (userId) => {
  let profile = Profiles.findOne({ userId });
  if (profile) return profile.name;
};

export const usernameById = (userId) => {
  var user = Meteor.users.findOne({ _id: userId });
  if (user) return user.username;
};

export const usernameFromDisplayName = (name) => {
  var profile = Profiles.findOne({ name: name });
  var user = profile && Meteor.users.findOne({ _id: profile.userId });
  return user && user.username;
};

export const displayNameFromUsername = (username) =>
  Profiles.findOne({ userId: Meteor.users.findOne({
    username: username
  })._id }).name;

export const showByShowId = (spinId) =>
  Shows.findOne({ showId: spinId });

export const timeDiffString = (str) => momentUtil(str).fromNow();

export const dateFormat = (date, format) =>
  momentUtil(date).format(format);

export const renderSummary = function(summary, numWords) {
  if (summary.indexOf('<') > -1) {
    summary = $.parseHTML(summary).map(node => node.innerText).join(' ');
  }
  var regex = new RegExp(`(([^\\s]+\\s\\s*){${numWords}})(.*)`),
    match = regex.exec(summary);
  return `${match && match[1] || summary}…`;
};

export const getPathBySlug = function(template, slug) {
  return FlowRouter.path(template, { slug });
};

export const pages = function(items, per) {
  var retval = [], page = 0, counter = 0;
  for (var i in items) {
    if (counter === 0) {
      retval.push([]);
    }
    retval[page].push(items[i]);
    counter++;
    if (counter === per) {
      counter = 0;
      page++;
    }
  }
  return retval;
};

export const requestSpinData = async function(playlistId, cb) {
  if (playlistId < 10000) {
    return;
  }
  else {
    Meteor.call('getPlaylistSpins', playlistId, cb);
  }
};

export const requestSpinDataSync = async function(playlistId) {
  await new Promise((resolve, reject) => {
    if (playlistId < 10000) {
      return resolve(null);
    }
    else {
      Meteor.call('getPlaylistSpins', playlistId, function(error, result) {
        if (error) return reject(error);
        resolve(result);
      });
    }
  });
};
