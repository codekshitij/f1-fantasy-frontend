# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

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

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

🧩 Core Use Cases:

1. User Authentication & Profile Management:
   Sign Up:
   Email and Password
   Google OAuth
   Login:
   Email/Password
   Google OAuth
   Profile Management:
   Update profile information (name, avatar, team name)
   View fantasy points and ranking
   Logout: Securely log out and clear session data

2. Team Creation & Management:
   Create a Fantasy Team:
   Select drivers and constructors within a budget
   Display player stats, prices, and team budget
   Save and confirm team selections
   Edit Team:
   Make transfers (with limitations per race)
   Use "Wildcards" for unlimited transfers
   View Team:
   See current team lineup and points earned
   Display past performance and upcoming race predictions

3. Race Prediction & Live Scoring:
   Race Predictions:
   Predict race winner, fastest lap, and podium finishes
   Lock predictions before the race starts
   Live Race Scoring:
   Real-time points update during races
   Points for race results, overtakes, and other strategic moves
   Post-Race Summary:
   Display race highlights and points earned
   Compare predictions with actual race results

4. Trade & Transfers:
   Driver Transfers:
   Limited transfers per race
   Price adjustments based on driver performance
   Wildcard System:
   Use of "Wildcards" for unlimited transfers during a race week
   Strategic usage to maximize points

5. Leaderboards & Social Features:
   Global Leaderboard:
   View top players worldwide
   Filter by race, season, or total points
   Private Leagues:
   Create or join private leagues with friends
   Invite users via a unique code or link
   League-specific leaderboards
   Friends System:
   Add and remove friends
   Compare fantasy teams with friends

6. Notifications & Alerts:
   Race Notifications:
   Alerts for race start times, driver transfers, and predictions lock
   Point Updates:
   Notification for live point updates during races
   Summary of points after the race
   Strategic Tips:
   Suggestions for drivers to watch, upcoming track statistics, and more

7. Admin Dashboard (Optional):
   Manage user accounts and reports
   Update driver and race data
   Monitor system performance and manage notifications
   🔥 Critical Success Factors:
   Real-Time Updates:

Using Ergast API for live race data
WebSockets for live leaderboard updates
User Engagement:

Daily/Weekly challenges for bonus points
Strategic gameplay with budget constraints and wildcards
Scalable & Secure Backend:

FastAPI with JWT/Firebase authentication
PostgreSQL for scalable data management
Sleek UI/UX:

Engaging animations and transitions using Framer Motion
Intuitive navigation and responsive design
🔮 Future Enhancements:
In-App Chat for private leagues
Fantasy Points Analysis with historical data trends
Race Highlights and Video Recaps
Community Polls and User Discussions
