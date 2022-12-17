### Technical Assessment

### Tech Stack:
- **Docker**
- **Node**
- **Typescript**
- **Postgres**

### Notable Libraries:
- **commander**: cli application
- **pg-promise**: pg database access
- **octokit**: official github api library
- **jest**: testing
- **winston**: logging

### Project Structure
- **./config**: project configurations - alternative to dotenv
- **./dist**: application transpiled in .js format
- **./migrations**: database migrations
- **./node_modules**: libraries dependencies
- **./src/command**: cli-builder
- **./src/model**: application request and data types
- **./src/repository**: database functions
- **./src/service**: application business layer functions
- **./src/utils**: helper functions
- **./test**: application tests

### Running the infrastructure

Tested on Docker for Linux and Docker Desktop + WSL

```bash
#run the infrastructure
$ docker-compose up -d
```

### Setting up the database

```bash
#access pg container
$ docker exec -it ls_database /bin/bash

#run the migrations
$ psql -U postgres -d ls -a -f app/migrations/migration1/migration1-up.sql

#undo the migrations
$ psql -U postgres -d ls -a -f app/migrations/migration1/migration1-down.sql
```

### Building and running the node application
```bash
#access node container
$ docker exec -it ls_node /bin/bash

#install dependencies
$ npm install

#compile application
$ npm run build

#run application
$ node dist/src/main.js

#or
$ npx ts-node ./src/main.ts
```

### Using the application
```bash
#create a user options list
$ node dist/src/main.js create --help

#create a user from github
$ node dist/src/main.js create --username aebb

#list users options --help
$ node dist/src/main.js list --help

#list users by location
$ node dist/src/main.js list --location France

#list users by location & language(s)
$ node dist/src/main.js list --location France --language PHP TypeScript Java

#list users with simple pagination
node dist/src/main.js list --limit 10 --offset 10
```

### Running the tests

Test coverage at around ~80%

```bash
#run tests
$ npm run test

#run coverage
$ npm run test:cov
```

### Considerations and Limitations

- The code has a limit of 80 chars per line except for function definitions so its easier to read


- Listing the users has a special where clause to make the implementation of the filters cleaner and future proof
https://w3schools.invisionzone.com/topic/47773-whats-the-use-of-where-true/?do=findComment&comment=264814


- The application uses a mix of pgp helpers and Prepared Statements based on the notes from the creator itself
https://www.reddit.com/r/node/comments/kl4kxm/comment/gh75ht4/ 
https://stackoverflow.com/questions/67344790/order-by-command-using-a-prepared-statement-parameter-pg-promise/67347202#67347202


- The application uses native High Order Functions to inject dependencies


- Some insert and intersect queries where optimized for performance based on
https://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise
https://stackoverflow.com/a/65525615


- The application only fetches the most used language from each user repository
1. This improves performance(2 http requests instead of 1+n_repositories)
2. Github api only allows 60 requests per hour, a user with 60 repositories would break the application and make the data incomplete 

- Application logger can be extended to store data on file


- Application logger can be used to serve the result to the user

### Challenge

Your goal is to develop a command-line application, whose goals are:

1. Fetch information about a given GitHub user (passed as a command-line argument) using the GitHub API, and store it on one or more database tables - the mandatory fields are Name and Location, but you will get bonus points for additional fields;
2. Using a different command-line option, it should be possible to fetch and display all users already on the database (showing them on the command line);
3. Improving on the previous requirement, it should also be possible to list users only from a given location (again, using a command-line option);
4. Finally, the application should also query the programming languages this user seems to know/have repositories with, and store them on the database as well - allowing to query a user per location and/or programming languages;

## There are some mandatory requirements:

You must use NodeJS, TypeScript, and PostgreSQL;

All code must be in English;

You should setup the database using migrations, if possible (preferably using SQL, but not mandatory);

Code should be split into database functions and general processing functions, when possible;

For the database access, you must use this library: https://github.com/vitaly-t/pg-promise

For the processing (business logic) functions you should use either native ES6 functions or the library https://ramdajs.com/docs/ (or both);

All async functions must be composable, meaning you can call them in sequence without asynchronicity issues;

You shall have one main function and you should avoid process.exit() calls to the bare minimum;

You must not use classes, as it is not justified for such a small app (and we use almost no classes on our code);

Your code must be safe, assume all input strings as insecure and avoid SQL injections;

Each line shall not exceed 80 characters (bonus points if you include/follow some eslint rules), and it should use 2 spaces instead of tabs;

Your code must be uploaded to GitHub, GitLab, or bitbucket, and you shall present it as a Pull Request over your very first commit;

And finally, very important, don't forget to include a proper ReadMe.md, that documents your application and tells us how to use it.
