# Backend Setup

## Install Dependencies
Navigate to the backend folder and install the necessary dependencies:

```
cd backend
npm install
```
## Environment Configuration

Create a .env file inside the backend folder for local development and testing. Set up the following environment variables:

```
MONGO_URI=<YOUR_MONGOOSE_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
PORT=5001
```
## Start the Backend Server

After configuring the environment variables, start the backend server:

```
npm run start
```
This will start the backend application on port 5001 by default. You can change the port by modifying the PORT value in the .env file.
## Testing 
To run the backend tests, you can use Mocha as the test runner. The test files are located in the test folder of the backend.

To run the tests, use the following command:

```
npm run test
```