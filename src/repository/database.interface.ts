import { Octokit } from 'octokit';

interface Database {
  handler: Octokit | any
  configs: any
}

export default Database;
