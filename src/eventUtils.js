const eventsToListenFor = ['message', 'file_upload'];
const { instructors } = require('./.env');
const { insert } = require('./persistance');
const { getFile } = require('./fileUtils');

const instructorIds = Object.keys(instructors);

const shouldIgnoreEvent = event => {
  return (typeof event.type === 'undefined') ||
    (typeof event.user === 'undefined') ||
    ! eventsToListenFor.includes(event.type) ||
    ! instructorIds.includes(event.user);
};

const isSnippet = event => {
  return event.subtype && event.subtype === 'file_share' &&
    event.file && event.file.mimetype && event.file.mimetype === 'text/plain';
};

const containsCode = event => {
  const lines = event.text.split('\n');
  const isMultilineCodeBlock = lines.length >= 3 &&
    lines[0].includes('```') &&
    lines[lines.length - 1].includes('```');
  const isSinglelineCodeBlock = /^```.+```$/.test(event.text);

  return isMultilineCodeBlock ||
    isSinglelineCodeBlock ||
    isSnippet(event);
};

const stripBackticks = s => s.replace(/^```|```$/g, '').trim();

const saveSnippet = (event, cb) => {
  const author = instructors[event.user];
  const downloadUrl = event.file.url_private_download;
  const title = event.file.title;

  getFile(downloadUrl).then(fileText => {
    insert(fileText, author, title, cb);
  }).catch(err => {
    throw err;
  });
};

const savePlaintext = (event, cb) => {
  insert(stripBackticks(event.text), instructors[event.user], null, cb);
};

const save = (event, cb) => {
  isSnippet(event) ? saveSnippet(event, cb) : savePlaintext(event, cb);
};

module.exports = {
  containsCode,
  isSnippet,
  shouldIgnoreEvent,
  savePlaintext,
  stripBackticks,
  saveSnippet,
  save,
};
