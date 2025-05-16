# **Learning Managment System**
## **Information**
 
 The learning management system (LMS) was developed to support the need for online learning. It includes the functions for creating, updating, deleting and viewing courses. Login is done with secure authentication ensuring that only valid and authenticated users can access the system.

 The LMS has three main users

 * Admin: The main user of the system who can add users such as Faculty (teachers) and Students. 
 They are also in charge of creating courses and course packages. 

 * Faculty: The Faculty (teacher/instructor) can see the courses that were assigned to them as well as the students who are enrolled. They can also update the course information. Once a course is assigned to the faculty, they will receive a notification in the dashboard.

 * Student: Upon confirmation of  enrolment, an account is created for them by the admin. They can use the system to see the course information.

**This apps **contain** the following features:**

* Login
* Logout
* Update profile
* Add Courses
* View Courses
* Update Courses
* Delete Courses
* Course Assignment Notification
* User Listing with Filter
* Course Package

**Device and Browser Compatibility**

Users need to have stable internet connection to access the system. It can be accessed using a laptop, tablet or mobile however for optimal experience laptop is preferred. The operating system of the device can be Windows, macOS, Linux 

The browser used should have JavaScript enabled and supports HTML5. 
The list below are the browsers that supports modern JavaScript and HTML5: 
* Google Chrome (latest versions) 
* Mozilla Firefox 
* Microsoft Edge (Chromium-based) 
* Safari (macOS and iOS) 


## **Setup Instructions**

### **Cloning the Repository**
Run the following code
```
git clone https://github.com/Altterisk/A1---Learning-Management-System.git
cd A1---Learning-Management-System
```
### **Backend Setup**
Setup MongooseDB and create a .env file inside the backend folder (for local testing)
```
MONGO_URI=<YOUR_MONGOOSE_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
PORT=5001
```
Start the Backend
```
cd backend
npm install
npm run start
```
### **Frontend Setup**
Start the Frontend
```
cd frontend
npm install
npm run start
```
## **CI/CD Pipeline**
This project uses GitHub Actions for CI/CD automation, deploying with AWS LC2.
### **Trigger Condition**
The CI/CD pipeline runs automatically when code is pushed to the main branch. It can also be manually triggered with Github Action Page.
### **Workflow File**
Workflow File: [Link](.github/workflows/ci.yml)
### **Workflow Steps**
* Clones the repository into the runner
```
- name: Checkout Code
  uses: actions/checkout@v3
```

* Installs Node.js
```
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: ${{ matrix.node-version }}
```

* Print Environment Secrets
```
- name: Print Env Secret
  env:
    MONGO_URI: ${{ secrets.MONGO_URI }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    PORT: ${{ secrets.PORT }}
  run: |
    echo "Secret 1 is: $MONGO_URI"
    echo "Secret 2 is: $JWT_SECRET"
    echo "Secret 3 is: $PORT"
```

* Stop all running PM2 Processes
```
- run: pm2 stop all
```

* Install Backend Dependencies
```
- name: Install Backend Dependencies
  working-directory: ./backend
  run: |
    npm install --global yarn
    yarn --version
    yarn install
```

* Install Frontend Dependencies & Build
```
- name: Install Frontend Dependencies
  working-directory: ./frontend
  run: |
    df -h
    sudo rm -rf ./build
    yarn install
    yarn run build
```

* Run Backend Tests
```
- name: Run Backend Tests
  env:
    MONGO_URI: ${{ secrets.MONGO_URI }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    PORT: ${{ secrets.PORT }}
  working-directory: ./backend
  run: npm test
```

* Writes the .env file using GitHub Secrets
```
- run: |
    cd ./backend
    touch .env
    echo "${{ secrets.PROD }}" > .env
```

* Restart PM2 Processes for deployment
```
- run: pm2 start all
- run: pm2 restart all
```