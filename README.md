<p align="center">
    <a href="https://repository.airsdk.dev" rel="noopener" target="_blank">
        <img width="150" 
            src="https://raw.githubusercontent.com/airsdk/airsdk.dev/main/static/images/air-logo.png" 
            alt="AIR SDK logo">
    </a>
</p>

<h1 align="center">repository.airsdk.dev</h1>

<div align="center">
    Source for the repository.airsdk.dev site. Repository server backend for hosting packages for the `apm` client.
</div>

---

## Getting Started

This site is built with [NextJS](https://nextjs.org/) using React, TypeScript and prisma for data modelling. It is setup to use a mysql database but there is no direct requirement for this, any database can be configured to be the data source.

It currently has been built with Node v12.

### Install

To setup your development environment download the code and then install the dependencies using npm

```bash
nvm use
npm install
```

### Setup

Setup the environment by connecting a database. Create a `.env` in the root of the project and add a definition for `DATABASE_URL` as your database connection string, eg:

```
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/apm_repository"
```

To generate your initial prisma mappings run:

```bash
npx prisma generate
```

Prisma supports the native connection string format for PostgreSQL, MySQL and SQLite. See the documentation for all the [connection string options](https://pris.ly/d/connection-strings)

Populate the database with the correct database structure by running:

```bash
npx prisma db push
```

This will create all the required tables in the database.

### Running

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Deploy

```bash
npm run build
```

