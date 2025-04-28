import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { version } from 'os';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Automation" is now active!');

  // register command
  const disposable = vscode.commands.registerCommand(
    'Nodejs.auth',
    async () => {
      vscode.window.showInformationMessage('Node Js Extension Activated');

      // databse selection prompt
      try {
        const database = await vscode.window.showQuickPick(
          [{ label: 'MongoDB (Mongoose)' }],
          {
            placeHolder:
              'Select the database for Node.js/Express authentication',
          }
        );

        if (!database) {
          vscode.window.showInformationMessage(
            'No database selected. Aborting.'
          );
          return;
        }

        // checking the file already exsiste
        const workspacefolder = vscode.workspace.workspaceFolders;
        if (!workspacefolder) {
          vscode.window.showErrorMessage(
            'No workspace folder open. Please open a Node.js project.'
          );
          return;
        }

        const rootpath = workspacefolder[0].uri.fsPath;

        const packagejsonpath = path.join(rootpath, 'package.json');
        const nodemodulespath = path.join(rootpath, 'node_modules');

        const packageJsonExists = await fs
          .access(packagejsonpath)
          .then(() => true)
          .catch(() => false);

        const nodeModulesExists = await fs
          .access(nodemodulespath)
          .then(() => true)
          .catch(() => false);

        if (packageJsonExists || nodeModulesExists) {
          vscode.window.showErrorMessage(
            'You already have a project setup. Please clear the workspace to use this template.'
          );
          return;
        }

        const defaultprojectname = path
          .basename(rootpath)
          .toLowerCase()
          .replace(/\s+/g, '-');
        const projectname = await vscode.window.showInputBox({
          prompt: 'Enter project name for package.json',
          value: defaultprojectname,
          validateInput: (value) => {
            if (!value.match(/^[a-z0-9-~][a-z0-9-._~]*$/)) {
              return 'Project name must be lowercase, with letters, numbers, hyphens, or underscores.';
            }
            return null;
          },
        });

        if (!projectname) {
          vscode.window.showInformationMessage(
            'Project name input cancelled. Aborting.'
          );
          return;
        }

        const description = await vscode.window.showInputBox({
          prompt: 'Enter description for your project',
          value: 'A Node.js/Express project with automated authentication',
        });

        if (!description) {
          vscode.window.showInformationMessage(
            'Description input cancelled. Aborting.'
          );
          return;
        }

        const version = await vscode.window.showInputBox({
          prompt: 'Enter project version',
          value: '1.0.0',
          validateInput: (value) => {
            if (!value.match(/^\d+\.\d+\.\d+$/)) {
              return 'Version must be in format x.y.z (e.g., 1.0.0)';
            }
            return null;
          },
        });

        if (!version) {
          vscode.window.showInformationMessage(
            'Version input cancelled. Aborting.'
          );
          return;
        }

        const author = await vscode.window.showInputBox({
          prompt: 'Enter author name',
          value: '',
        });

        if (author === undefined) {
          vscode.window.showInformationMessage(
            'Author input cancelled, aborting...'
          );
          return;
        }

        const license = await vscode.window.showInputBox({
          prompt: 'Enter license',
          value: 'MIT',
        });
        if (license === undefined) {
          vscode.window.showInformationMessage(
            'License input cancelled. Aborting.'
          );
          return;
        }

        // #creating terminal
        const terminal = await vscode.window.createTerminal('Node js setup');
        terminal.sendText('npm install -D nodemon prettier');
        terminal.sendText(
          'npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser dotenv'
        );

        // databse written
        if (database.label === 'MongoDB (Mongoose)') {
          await generateNodeExpressMongooseJwt(rootpath, {
            name: projectname,
            description: description || '',
            version,
            author: author || '',
            license: license || 'MIT',
          });
          vscode.window.showInformationMessage(
            'Authentication setup complete for Node.js/Express with Mongoose and JWT!'
          );
        } else {
          vscode.window.showErrorMessage(
            `Support for ${database.label} is not yet implemented.`
          );
        }
      } catch {
        vscode.window.showErrorMessage(
          `Error setting up authentication: ${Error}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// #function generate for setup
async function generateNodeExpressMongooseJwt(
  rootpath: string,
  packageJsonInfo: {
    name: string;
    description: string;
    version: string;
    author: string;
    license: string;
  }
) {
  const folders = [
    path.join(rootpath, 'api/models'),
    path.join(rootpath, 'api/routes'),
    path.join(rootpath, 'api/middleware'),
    path.join(rootpath, 'api/controller'),
    path.join(rootpath, 'api/utils'),
    path.join(rootpath, 'api/config'),
    path.join(rootpath, 'public/temp'),
  ];

  for (const folder of folders) {
    await fs.mkdir(folder, { recursive: true });
  }

  const UserModelContent = `

import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

   avatar: {
     type: String,
     default: "https://lh3.googleusercontent.com/a/ACg8ocL84YopSLCrbWZQXbuEx-o5zIdLo3QEszYm3yfjrQddfK1-iQ=s96-c",
   }    
} , {timestamps: true})

const User = mongoose.model("User", UserSchema);

export default User;`;

  const userRouterContent = `
import express from "express";
import {Signin, Signout, Signup } from "../controller/Auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", Signup);

AuthRouter.post("/signin", Signin);

AuthRouter.get("/signout", Signout);

export default AuthRouter;`;

  const userControllerContent = `
import User from '../models/User.model.js';
import bcryptjs from 'bcryptjs';
import { ErrorHandler } from '../utils/Error.js';
import jwt from 'jsonwebtoken';

export const Signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error('Please fill all details');
    }

    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      throw new Error('This Email is in our databse');
    }

    const hashedpassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });

    await newUser.save();
    res.status(201).json('User Created Successfully');
  } catch (error) {
    next(error);
  }
};

// Login Authentication

export const Signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validationUser = await User.findOne({ email });
    if (!validationUser) {
       return next(ErrorHandler(404, 'Invalid Email Address'));
    }

    const validationPassword = bcryptjs.compareSync(
      password,
      validationUser.password
    );
    if (!validationPassword) return next(ErrorHandler(401, 'Wrong Credential'));

    const token = jwt.sign({ id: validationUser._id }, process.env.SECRET_CODE);
    const { password: pass, ...rest } = validationUser._doc;
    
    res
      .cookie('access_Token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const Signout = async (req, res, next) => {
  try {
    res.clearCookie('access_Token');
    res.status(201).json('User Sign Out Successfully');
  } catch (error) {
    next(error);
  }
};
`;

  const authMiddlewareContent = `
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};`;

  const dbConfigContent = `
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};`;

  const utilscontent = `
export const ErrorHandler  = (statusCode, message) => {
     const error = new Error();
     error.statusCode = statusCode;
     error.message = message;
     return error;
}`;

  const mainPageContent = `
"use strict";
import express from "express";
import AuthRouter from "../api/Routes/Auth.routes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConfig.js";

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

connectDB()

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", AuthRouter);

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statuscode).json({
    success: false,
    message,
    statuscode,
  });
});`;

  const envContent = `
MONGO_URI=YOURMONGODBLINK
SECRET_CODE=YOURSECRETCODEFORTOKEN`;

  const readmepagecontent = `
This is the node js project`;
  
  const gitignorecontent = `
  # Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# vuepress v2.x temp and cache directory
.temp
.cache

# vitepress build output
**/.vitepress/dist

# vitepress cache directory
**/.vitepress/cache

# Docusaurus cache and generated files
.docusaurus

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*`;

  const gitkeepcontent = `This file for only track`;
  
  const prettierrccontent = `{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}`;
  
  const prettierignorecontent = `
  /.vscode
  /node_modules
  ./dist
  *.env
  .env
  .env*`;

  await fs.writeFile(
    path.join(rootpath, 'api/models', 'User.model.js'),
    UserModelContent
  );

  await fs.writeFile(
    path.join(rootpath, 'api/controller', 'Auth.controller.js'),
    userControllerContent
  );

  await fs.writeFile(
    path.join(rootpath, 'api/routes', 'Auth.routes.js'),
    userRouterContent
  );

  await fs.writeFile(path.join(rootpath, '.env'), envContent);
  await fs.writeFile(path.join(rootpath, 'api', 'index.js'), mainPageContent);
  await fs.writeFile(path.join(rootpath, 'README.md'), readmepagecontent);
  await fs.writeFile(path.join(rootpath, '.gitignore'), gitignorecontent);
  await fs.writeFile(path.join(rootpath, '.gitkeep'), gitkeepcontent);
  await fs.writeFile(path.join(rootpath, '.prettierrc'), prettierrccontent);
  await fs.writeFile(path.join(rootpath, '.prettierignore'), prettierignorecontent);
  await fs.writeFile(path.join(rootpath, '.gitkeep'), gitkeepcontent);

  await fs.writeFile(
    path.join(rootpath, 'api/config', 'dbConfig.js'),
    dbConfigContent
  );

  await fs.writeFile(
    path.join(rootpath, 'api/utils', 'Error.js'),
    utilscontent
  );

  await fs.writeFile(
    path.join(rootpath, 'api/middleware', 'middleware.js'),
    authMiddlewareContent
  );

  const packagejsonpath = path.join(rootpath, 'package.json');
  const packageJson = {
    name: packageJsonInfo.name,
    description: packageJsonInfo.description,
    version: packageJsonInfo.version,
    author: packageJsonInfo.author,
    license: packageJsonInfo.license,
    scripts: { start: 'nodemon api/index.js' },
  };

  try {
    console.log(`Writing package.json: ${packagejsonpath}`);
    await fs.writeFile(packagejsonpath, JSON.stringify(packageJson, null, 2));
    vscode.window.showInformationMessage(
      'Created package.json with dependencies. Installing dependencies...'
    );
  } catch (error: any) {
    vscode.window.showWarningMessage(
      `Failed to update package.json: ${error.message}`
    );
  }
}

export function deactivate() {}
