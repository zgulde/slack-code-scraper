# Code Scraper Bot

A slack bot that archives any code sent out by certain individuals. Used at
[codeup](http://codeup.com) to keep track of code samples sent out by
instructors in various slack channels, but could be used anywhere you want to
keep track of code sent out in a slack channel.

## How it works

The bot will listen in on any channel it is invited into. It will only pay
attention to messages from a list of individuals you specify. It will try to
identify code samples (both shared "snippets", and plaintext code delimeted by
triple backticks), and save them to a mysql database.

The database connection details, along with a list of individuals whose code
samples should be archived, live in `src/.env.js`.

## Setup

We'll need to obtain two tokens from slack, one for our bot user, and one to
read uploaded files (there might be a way to combine these two, but I have yet
to figure it out). We will also need a mapping of slack ids to slack usernames,
so that we know which individuals we should pay attention to, and a database and
table for the application.

1. Clone this repo

1. Create the `.env.js` file

    ```
    cp src/env.example.js src/.env.js
    ```

1. Create a bot user on slack, and put the token for bot access in the `.env`
   file.

1. Obtain a token from slack that has either `read` or `files:read` scope. Put
   it in the `.env` as well.

1. Get a mapping of slack ids to slack usernames, and put it in the `.env` file
   under the `instructors` key. The keys should be slack ids and the values
   should be the username. The `src/getInstructorIds.js` file can help with
   this.

1. Create a database and one table for the application.

    The application will expect a database already created, and a table named
    `code_samples` that has the following columns:

    - id
    - title: the title of the code snippet
    - code: the actual code
    - author: the slack username of the person that created the code

1. Fill in the `database` key in the `.env` file.

    As you might expect the credentials under the `testing` key are used when
    the tests are run, and the credentials under the `production` key are used
    when the app is run directly.

Once all of the above is done, you are ready to go! Now you can:

run the tests:

```
npm test
```

lint your code

```
npm run lint
```

## Running

To start the application,

```
npm start
```

as long as the application is running, your bot will listen for code in
whichever channels it is invited into. In production, you can start the bot
inside of a screen or tmux session, or do something even simpler with `nohup`.
