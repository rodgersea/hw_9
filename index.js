
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "Username",
            message: "What is your GitHub username?"
        },
        {
            type: "input",
            name: "Title",
            message: "what is the project title?"
        },
        {
            type: "input",
            name: "Description",
            message: "Please write a short description of your project."
        },
        {
            type: "list",
            name: "License",
            message: "What kind of license should your project have?",
            choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"]
        },
        {
            type: "input",
            name: "Dependencies_Command",
            message: "What command should be run to install dependencies?"
        },
        {
            type: "input",
            name: "Test_Command",
            message: "What command should be run to run tests?"
        },
        {
            type: "input",
            name: "Preface",
            message: "What does the user need to know about using the repo?"
        },
        {
            type: "input",
            name: "Contribute",
            message: "What does the user need to know about contributing to the repo?"
        }
    ])
}

function genMD(answers) {
    return `
## Description
${answers.Description}

## Table of Contents
* Installation
* Usage
* License
* Contributing
* Tests
* Questions

## Installation
To intall necessary dependencies, run the following command:
`

```javascript
${answers.Dependencies_Command}
```

`
## Usage
${answers.Preface}

## License
${answers.License}

## Contributing
${answers.Contribute}

## Tests
To run tests, run the following command:
`

```javascript
${answers.Test_Command}
```

`
## Questions
put picture here
If you have any questions about the repo, open an issue or contact 
(link to my github)
directly at
(link to my email address)
`
}

promptUser()
    .then(function(answers) {
        const MD = genMD(answers);

        return writeFileAsync("README.md", MD);
    })
    .then(function() {
        console.log("Successfully created README");
    })
    .catch(function(err) {
        console.log(err);
    })