# Eritrean Full Gospel Church Cologne

## Supabase setup

1. Open the Supabase SQL Editor for project `epmeeuihtaubxireizng`.
2. Run `supabase/schema.sql` once to create the tables, indexes, Row Level Security policies, and the protected like function.
3. In Vercel, add these Production environment variables:

```text
REACT_APP_SUPABASE_URL=https://epmeeuihtaubxireizng.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

4. In Supabase Authentication URL Configuration, set the Site URL to the production Vercel URL and add the same URL to Redirect URLs.

## Administrator user management

The Finanz administrator workspace includes a **Users** menu for portal administrators. It creates Supabase Auth users and assigns application roles and finance access enforced by RLS.

After pulling this feature:

1. Run the complete `supabase/schema.sql` in the Supabase SQL Editor.
2. Deploy the protected function with `supabase functions deploy admin-users`.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` only in Supabase Edge Function secrets. Never add it to React or Vercel.
4. Add the first administrator's Auth user ID to `public.church_admins` in the Supabase Table Editor. That bootstrap administrator can then manage other users in the portal.

The browser can assign predefined access levels but cannot edit database policy SQL.

To import the existing public Render data, use a Supabase secret key locally. Never add the secret key to Vercel or commit it:

```powershell
$env:SUPABASE_URL="https://epmeeuihtaubxireizng.supabase.co"
$env:SUPABASE_SECRET_KEY="your_secret_key"
npm run migrate:supabase
Remove-Item Env:SUPABASE_SECRET_KEY
```

The import is idempotent and currently migrates 3 posts and 84 mezmurs. Existing password hashes cannot be migrated; users must register through Supabase Auth.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start or npm start` 

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

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
