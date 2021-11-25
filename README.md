# Metestates

The new digital land-rush is upon us! Will you become the next land-baron?

![WIP](static/assets/readme/Screen%20Shot%202021-11-25%20at%2015.34.11.png)

## Codegen

### Generate GraphQL JSON Schema

```bash
apollo client:download-schema ./marketplace.schema.json
```

### Generate GraphQL TypeScript interfaces

```bash
apollo codegen:generate \
    --localSchemaFile=./marketplace.schema.json \
	--target=typescript \
	--tagName=gql
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
