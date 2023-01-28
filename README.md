# Yojana

Yojana is a calendar app made using Next.js.

## Getting Started

### Installation

- [MySQL 8](https://dev.mysql.com/downloads/mysql/)
- [MySQL Shell](https://dev.mysql.com/downloads/shell/)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [install Node](https://nodejs.org/) - the current version of Node used is in [`.nvmrc`](.nvmrc).
- [install Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [install nvm](https://github.com/nvm-sh/nvm) (optional) - to ensure the correct version of Node is used. Take a look
  at [this](https://stackoverflow.com/a/57839539/8488681) to see how to use [`.nvmrc`](.nvmrc) to automatically switch
  to the correct version of Node.

```bash
# clone the repository
git clone https://github.com/Team-Yojana/client.git

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

See [this](https://www.prisma.io/dataguide/mysql) for more information on interacting with MySQL using MySQL Shell.

### Environment Variables

You will need to create a `.env` file in the root directory of the project with your environment variables.

You can use the `.env.example` file present in the root directory as a template.

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

# start the app in production mode (after building)
yarn start

# run linter
yarn lint

# run formatter
yarn format

# check for formatting errors
yarn format:check

# push database
yarn prisma:push

# migrate database
yarn prisma:migrate

# reset database
yarn prisma:reset

# run prisma studio (database GUI)
yarn prisma:studio

# format prisma schema
yarn prisma:format
```

## Contributing

- When you make a PR, please make sure that the branch name is in the format `your-name/feature-name`. For
  example, `john/update-readme`.
- Do **NOT** push directly to `main`. Always create a new branch and make a PR.
- Always squash and merge PRs to `main` to keep the commit history clean.

## Deployment

Work in progress... :construction:

## Links

- [React](https://reactjs.org)
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Azure](https://azure.microsoft.com/)
- [MySQL](https://www.mysql.com/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Credits

This project was bootstrapped with [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
