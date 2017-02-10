# NextFaze Serverless Seed Project

Serverless Framework is great at deploying lambda functions to AWS, taking care of all your CloudFormation configuration and stuff like that.

But the development environment is a bit barebones. This project is a starting point for Typescript based Serverless deployments.

## Initial Setup

1. Clone the repository

1. npm install

## Creating Lambda functions

* Create your lambda functions in separate files in `src/lambdas`.

* Don't forget to export your new function in `src/lambdas/index`

* Add your lambda function to `serverless.yml`

Have a look at the example `hello` function to see what the deal is.


## deployment

### Stages

Project is configured with two environments: `staging` and `production`.

The starting `serverless.yml` is configured to set the environment as `NODE_ENV` Lambda Environment Variable. This means you can use `process.env.NODE_ENV` like you would in a regular node application.

#### Deploying to staging

    npm run deploy:staging


#### Deploying to production

    npm run deploy:production

