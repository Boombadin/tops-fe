# Magenta

## Intro
This is the base app to build UI Interface for a Magento Headless App.

There are 3 apps within this project:
- **Client**: The client app is built using the ReactJs. It's responsible for the UI.
- **API**: The backend API app which fetches data from top's magento app for the client app to consume. *Generally not a good idea to allow direct access to Magento API from javascript*

### Client App
Like mentioned earlier, it's build with React. Also uses React Router v4 for routing and Redux for state management. Uses Redux-Saga for async api calls.
All code related to the client app can be found in the `/client` folder.

### Server App
Built using ExpressJS. All code related to API is in the `/app` folder.


## Bundling and Transpiling
The app is transpiled using Babel and packaged using webpack.

## Dependencies
This app depends on the [magenta-ui](https://bitbucket.org/centralonline/magenta-ui) component library to render data. Magenta-ui used to be part of this project but was removed to be an independant project so the components could easily be used across multiple projects.

## How to use this app for your headless Magento
- Clone this repo
- Create a .env file. You can use the .env.example as a template.
- Check the Permission of node package magenta-ui.
- `npm login`
- `npm install`
- `npm run build` -> *Starts the server*
- `npm start` -> *Watches the react app and recompiles when changed*

## Add your own styles
You can add your own css file in *client/styles* folder. All *.css* files from this folder will be combined, minfied and auto-prefixed to create one file, *styles.min.css*, which is located in the public folder. Make sure your .css files follow the specs provided by the [magenta-ui](https://bitbucket.org/centralonline/magenta-ui) project.

You should also run the `npm run grunt:link` script. This way when there are new changes in magento-ui's style, you wouldn't have to manually update the styles yourself. This script creates a symlink between the *public/magenta-ui.min.css* file and the main styles file in the magenta-ui folder in your node_modules file.



