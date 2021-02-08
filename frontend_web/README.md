## Frontend Web

The frontend part of the app 

### Getting Started

Go into the frontend_web directory and run install the app by running:

```bash
yarn install
```

You should then be able to start the server with the command:

```bash
yarn start
```

If you plan on implementing tests, simply run:

```bash
yarn test
```

To load data in the app, you can use the following URLs:

- http://localhost:3000/api/companies-{page}.json
- http://localhost:3000/api/companies/{id}.json

### Mission

1. Make sure that the home page displays a list of companies
   - Use the JSON API as explained in "Getting Started"
   - Table rows should show the company's name and ID
   - Pick the strategy you want to deal with API pagination, but display almost 9000 lines in a page is not a good idea
2. Provide a way to navigate from a row in the list of companies, to a page showing a specific company's details
   - Use the JSON API to get company details from the ID
   - Show as many details as possible
3. Provide a mechanism to hide a company from the list
4. Provide a mechanism to hide a company from the company details page



