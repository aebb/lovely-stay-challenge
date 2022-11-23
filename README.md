### Technical Assessment

#### Tech Stack:
- Docker
- Node
- Typescript
- Postgres

```bash
#run application
$ docker-compose up -d

#access node container
$ docker exec -it ls_node /bin/bash

#install dependencies
$ npm install

#compile application
$ npm run build

#run application
$ node dist/main.js
```