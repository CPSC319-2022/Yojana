# Yojana

Yojana is a calendar app made using Next.js.

## Getting Started

### Prerequisites

- [MySQL 8](https://dev.mysql.com/downloads/mysql/)
- [MySQL Shell](https://dev.mysql.com/downloads/shell/)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
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

### GitHub Actions

We use the following GitHub Actions to automate our workflow:

- [Format Code](https://github.com/CPSC319-2022/Yojana/actions/workflows/format-code.yml) - formats code using Prettier
  and commits the changes to the PR branch. This is triggered when a PR is opened or updated. Remember to pull the
  latest changes from the PR branch before making any changes to your local branch.

### Code Style

We use the Prettier with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to
format our code. Please ensure that you have the following configuration in your settings:

![](https://user-images.githubusercontent.com/39626451/215233714-16225c53-9012-4e5e-a8ed-ea4016cd0e24.png)

Alternatively, you can use to following scripts to format your code before making PRs:

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
