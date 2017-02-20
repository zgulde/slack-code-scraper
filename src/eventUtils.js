const eventsToListenFor = ['message', 'file_upload'];
const { instructors } = require('./.env.js');

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

// const saveSnippet = event => {
//   // get the file contents
//   persist(fileContents, instrutors[event.user]);
// };

// const savePlaintext = event => {
//   persist(event.text, instructors[event.user]);
// };

// const save = event => {
//   isSnippet(event) ? saveSnippet(event) : savePlaintext(event);
// };

module.exports = {
  containsCode,
  isSnippet,
  shouldIgnoreEvent
};
