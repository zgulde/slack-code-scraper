module.exports = {
  token: 'put the slack token here',
  readFilesToken: 'a slack token that has "read" or "files:read" scope',

  // map slack ids to usernames
  instructors: {
    'U1SNVSTPB': 'benroberts',
    'U1QMCDLVC': 'fernando',
    'U1SS52BJQ': 'jreich5',
    'U1SNP0HR6': 'liz.peacock',
    'U0MKKNF0T': 'montealegreluis',
    'U037MJFLX': 'ryanorsinger',
    'U1UH3NFJ8': 'zach',
  },

  database: {
    testing: {
      host: '',
      user: '',
      password: '',
      database: '',
    },
    production: {
      host: '',
      user: '',
      password: '',
      database: '',
    }
  }
};
