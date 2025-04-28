#Node.js Auth Automation

Yo, tired of writing the same Node.js authentication boilerplate for every project? The Node.js Auth Automation VS Code extension is here to save the day! With a single shortcut key (Ctrl+Alt+A), it sets up a complete, secure auth system using Express, Mongoose, and JWT in seconds. No more manual coding of user models, routes, or middleware—just focus on building your app’s killer features.
Built by a 17-year-old developer (yep, that’s me, with 750+ installs on my aryansh > Auto Formatter), this extension is for developers who want to skip the repetitive stuff and get to the good part of coding.

#Features

One-Click Setup: Trigger auth setup with Ctrl+Alt+A or the Command Palette.

Give Answer of prompt that you want in your package.json

Complete Auth Template: Generates:

User model (api/models/User.js) with username, email, password, and avatar.

Routes (api/routes/auth.js) for /api/auth/signup, /signin, and /signout.

Controllers (api/controllers/auth.js) with bcrypt password hashing and JWT tokens.

Middleware (api/middleware/auth.js) for token verification (cookies or headers).

Database config (api/config/db.js) for MongoDB with dotenv.

Error handler (api/utils/error.js) for consistent responses.

Main app (api/index.js) with Express setup.

Prettier(.prettierrc) for formatting.

Prettierignore(.prettierignore) for ignore the format.

public folder for storing temp email it contain .gitkeep file only for tracking you can delete.

.env with secure, random JWT secret.


Smart Validation: Checks for existing package.json or node_modules to avoid conflicts.

Dependency Automation: Updates package.json and runs npm install for express, mongoose, bcryptjs, and more.

Secure by Default: Uses bcrypt, HTTP-only cookies, and random JWT secrets.

Extensible: Supports MongoDB (Mongoose) now, with PostgreSQL (Sequelize) coming soon.


#Installation

Open VS Code.
Go to the Extensions view (Ctrl+Shift+X).
Search for Node.js Auth Automation.
Click Install.
Reload VS Code if prompted.

Alternatively, install via the VS Code Marketplace (link coming soon after publish).

#Usage

Open a Project:

Open an empty folder in VS Code or a new Node.js project without package.json or node_modules.


Run the Extension:

Press Ctrl+Alt+A (or Cmd+Alt+A on macOS).
Or, open the Command Palette (Ctrl+Shift+P) and select Setup Node.js Authentication.


Select Database:

Choose MongoDB (Mongoose) from the QuickPick menu (PostgreSQL support is in progress).
If no database is selected, the extension will abort with a friendly message.


Check Output:

The extension creates an api/ folder with models, routes, controllers, and more.
A terminal runs and npm install to set up dependencies.
package.json is updated with express, mongoose, and a start script.
A .env file is generated with MONGO_URI and a secure SECRET_CODE.

Run the Project:
Open a terminal and run npm start to launch the Express app on http://localhost:3000.
Test endpoints like POST /api/auth/signup with tools like Postman.

#Example Output

After running the extension, your project will have:
your-project/
├── api/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── utils/
│   │   └── error.js
│   └── index.js
├── .env
└── package.json
└──.gitignore
└── README.md
└──.prettierrc
└── .prettierignore

The auth system is ready to handle user registration, login, and logout with secure JWT tokens.

#Troubleshooting

Error: “No workspace folder open”:
Ensure you’ve opened a folder in VS Code (File > Open Folder).

Error: “You already have a project setup”:
The extension detects an existing package.json or node_modules. Use a new folder or remove these to proceed.

Error: “No write permissions”:
Check that your workspace folder has write permissions (right-click > Properties > Security on Windows).


Error: “Failed to create folder/file”:
Ensure the folder isn’t on a read-only or network drive. Try a local folder like C:/Users/yourname/test-project.


PostgreSQL Option Not Working:
PostgreSQL support is coming soon. Select MongoDB (Mongoose) for now.


Extension Crashes:
Check the Output panel (Ctrl+Shift+U, select Extension Host) for logs.
Update VS Code to the latest version and reinstall the extension.



For other issues, open a ticket on the GitHub repo (link coming soon).
Contributing
Want to make Auth Automation even better? I’m planning to add support for Python/Django, PostgreSQL, and a multi-language extension. Contribute by:

Suggesting new features (e.g., OAuth, test templates).
Submitting auth templates for other languages/frameworks.
Reporting bugs or improving the code.

Check out the GitHub repo (coming soon) for contribution guidelines.

#Future Plans

More Databases: Add PostgreSQL with Sequelize for Node.js.
New Languages: Launch separate extensions for Python/Django, Next.js, and Java/Spring Boot.
Combined Extension: Build a unified auth-automation extension for all stacks.
Advanced Features: Support OAuth, auto-generate tests, and add a VS Code sidebar UI.
Community: Open-source the project and create a template marketplace.

#License
MIT License – feel free to use, modify, and share!

#About the Author
I’m a 17-year-old developer passionate about making coding easier and more accessible. With my aryansh > Auto Formatter extension hitting 650+ installs and projects like EcoScan, I’m all about building tools that empower developers. Follow my journey on LinkedIn and stay tuned for more Auth Automation updates!
