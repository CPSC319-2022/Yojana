# Yojana

Yojana is a calendar app made using Next.js.

## Getting Started

### Prerequisites

- [MySQL 8](https://dev.mysql.com/downloads/mysql/)
- [MySQL Shell](https://dev.mysql.com/downloads/shell/)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Docker](https://docs.docker.com/get-docker/)
- [Node](https://nodejs.org/) - the current version of Node used is in [`.nvmrc`](.nvmrc).
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [nvm](https://github.com/nvm-sh/nvm) (optional) - to ensure the correct version of Node is used. Take a look
  at [this](https://stackoverflow.com/a/57839539/8488681) to see how to use [`.nvmrc`](.nvmrc) to automatically switch
  to the correct version of Node.

### Installation

```bash
# clone the repository
git clone https://github.com/CPSC319-2022/Yojana.git

# ensure that the correct version of Node is used (optional)
nvm use

# install dependencies
yarn install
```

### MySQL

If you have installed MySQL 8 and MySQL Shell, you should already have a user called `root`. Run the following command
to log in to MySQL Shell.

```bash
mysql -u root -p # enter your password
```

To connect to a remote Azure MySQL database use:

```bash
# remove the < > and replace with the correct values
mysql -h <azure fullyQualifiedDomainName> -u <azure administratorLogin> -p # enter your password
```

See [this](https://www.prisma.io/dataguide/mysql) for more information on interacting with MySQL using MySQL Shell.

### Environment Variables

You will need to create a `.env` and a `.env.test` file in the root directory of the project with your environment variables.

You can use the `.env.example` and `.env.test.example` files present in the root directory as templates.

### Setting up Database using Prisma

```bash
# Creates database and tables in MySQL according to ./prisma/schema.prisma
yarn prisma:push
```

### Running the App

You should now be able to run the application using the following command:

```bash
# start the app on localhost:3000
yarn dev
```

## Development

### Scripts

```bash
# start the app on localhost:3000
yarn dev

# build the app
yarn build

# analyze the build
yarn build:analyze

# start the app in production mode (after building)
yarn start

# run unit tests
yarn test

# run e2e tests
yarn test:e2e

# run e2e tests in headless mode (no browser window)
yarn test:e2e:headless

# generate coverage report for tests
yarn test:coverage

# run linter
yarn lint

# run formatter
yarn format

# check for formatting errors
yarn format:check

# push database
yarn prisma:push

# migrate database (automatically seeds database if there are new migrations)
yarn prisma:migrate

# reset database (automatically seeds database)
yarn prisma:reset

# run prisma studio (database GUI)
yarn prisma:studio

# format prisma schema
yarn prisma:format

# manually seed database
yarn prisma:seed

# create docker container for MySQL
yarn docker:up

# delete docker container for MySQL
yarn docker:down
```

### Testing

#### Unit Tests

We use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com) to write Unit tests.

```bash
# run tests
yarn test
```

You can generate a coverage report by running the following command:

```bash
# generate coverage report
yarn test:coverage
```

This will generate a coverage report in the `coverage` directory.

#### E2E Tests

We use [Cypress](https://www.cypress.io/) to write E2E tests.

```bash
# run tests
yarn test:e2e
```

You can run the tests in headless mode (no browser window) by running the following command:

```bash
# run tests in headless mode
yarn test:e2e:headless
```

We use Docker to run a MySQL container for our E2E tests. The container is automatically started when you run the E2E tests.

To manually start the container and delete the container when you are done, you can use the following commands:

```bash
# start container
yarn docker:up

# delete container
yarn docker:down
```

Click [here](./docker-compose.yml) to see the configuration for the MySQL container.

### GitHub Actions

We use the following GitHub Actions to automate our workflow:

- [CI](https://github.com/CPSC319-2022/Yojana/actions/workflows/CI.yml)
  - **Unit Tests:** runs unit tests and generates a coverage report.
  - **E2E Tests:** runs E2E tests.
  - **Format:** formats files using Prettier. Make sure to pull the latest changes before making changes to your local
    branch to avoid merge conflicts.

We also use Vercel to create preview deployments of the app for every PR and branch. This is triggered when a PR is
opened or updated.

### Pre-commit Hooks

We use [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to run
pre-commit hooks. This ensures that our code is formatted correctly before we commit our code.

### Code Style

We use the Prettier with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to
format our code. Please ensure that you have the following configuration in your settings:

![](https://user-images.githubusercontent.com/39626451/223469221-ce89d37e-9ca4-44f3-93cf-96bd52d0cde2.png)

Alternatively, you can use to following scripts to manually format your code:

```bash
yarn format # to format your code
yarn format:check # to check if your code is formatted correctly
```

### Contributing

- When you make a PR, please make sure that the branch name is in the format `your-name/feature-name`. For
  example, `john/update-readme`.
- Do **NOT** push directly to `main`. Always create a new branch and make a PR.
- Always squash and merge PRs to `main` to keep the commit history clean.

## Deployment

We use [Azure](https://azure.microsoft.com/) to deploy
our [MySQL database](https://azure.microsoft.com/en-us/products/mysql) and to authenticate users
using [Azure Active Directory](https://azure.microsoft.com/en-us/products/active-directory).

We use [Vercel](https://vercel.com/) to deploy our [Next.js app](https://vercel.com/solutions/nextjs).

Visit [this](https://yojana-main.vercel.app/) link to see the latest deployed version of the app.

## Usage Demos

- Importing entries via CSV: [video](https://drive.google.com/file/d/1OdTF02FHYin3s2i62Gu28yntX-TM73iI/view?usp=share_link)
