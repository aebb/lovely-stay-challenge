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
$ node dist/main.js
```

### Using the application
```bash
#create a user options list
$ node dist/main.js create --help

#create a user from github
$ node dist/main.js create --username aebb

#list users options --help
$ node dist/main.js list --help

#list users by location
$ node dist/main.js list --location Portugal

#list users by location & language(s)
$ node dist/main.js list --location Portugal --language PHP TypeScript Java

#list users with simple pagination
node dist/main.js list --limit 10 --offset 10
```

### Running the tests
```bash
#run tests
$ npm run test

#run coverage
$ npm run test:cov
```

### Considerations and Limitations

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

- Application logger be used to serve the result to the user