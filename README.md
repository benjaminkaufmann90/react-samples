## React Samples

These samples were taken from a project that used to be a live application.
This folder contains a few components and a few of their dependencies as a code sample and resembles the original folder structure in a very simplified way.
The application structure was based off the react arc template (https://github.com/diegohaz/arc).
The folders "components", "containers" and "store" each contain webpack scripts at the top level for easy access to the exported entities of all js files inside them. This reduces the effort and lines of code for writing import statements.

####The Folder Structure

**components**

It contains the actual components and is split into different subfolders (following the atomic design).

**"containers"**

It contains higher-order-components for injecting redux state properties and dispatch methods.
When intending to import a component that used a container the respective container for that component was imported instead.

**"definitions"**

It contains global translation definitions based on the react-intl library.

**"store"**

It contains redux store related information.
The store is split into subcategories represented by subfolders inside the store folder.
The webpackscript for the selectors make them accessible via the naming convention "from<subcategory>" returning an object of that name with the selector functions as methods.
Per subcategory five code files exist:

  * "constants.js" -> mainly for providing action names as constants
  * "actions.js" -> containing all the action dispatcher methods
  * "reducer.js" -> containing the reducer of the subcategory and an export of the default state
  * "sagas.js" -> generator functions for asynchronous code based off the redux-saga library
  * "selectors.js" -> getter functions for the redux state

**"utils"**

Contains helper functions for application-wide use

####Storybook

Some component folders also contains an index.stories.js file. These are used by the tool Storybook which we used to present some of the components to the product team at request and document essential components.
