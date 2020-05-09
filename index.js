
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your GitHub username?"
        },
        {
            type: "input",
            name: "title",
            message: "what is the project title?"
        },
        {
            type: "input",
            name: "description",
            message: "Please write a short description of your project."
        },
        {
            type: "list",
            name: "license",
            message: "What kind of license should your project have?",
            choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"]
        },
        {
            type: "input",
            name: "dependencies_Command",
            message: "What command should be run to install dependencies?"
        },
        {
            type: "input",
            name: "test_Command",
            message: "What command should be run to run tests?"
        },
        {
            type: "input",
            name: "preface",
            message: "What does the user need to know about using the repo?"
        },
        {
            type: "input",
            name: "contribute",
            message: "What does the user need to know about contributing to the repo?"
        }
    ])
}

function genMD(answers) {
    return `
[![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg)](https://bitbucket.org/lbesson/ansi-colors)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/rodgersea)

## Description
${answers.description}

## Table of Contents
* Installation
* Usage
* License
* Contributing
* Tests
* Questions

## Installation
To intall necessary dependencies, run the following command:

\`\`\`javascript
${answers.dependencies_Command}
\`\`\`

## Usage
${answers.preface}

## License
${answers.license}

## Contributing
${answers.contribute}

## Tests
To run tests, run the following command:

\`\`\`javascript
${answers.test_Command}
\`\`\`

## Questions
<img src="${answers.profile}" width="60" />  

If you have any questions about the repo, open an issue or contact Elliott Rodgers
directly at
[${answers.email}](${answers.email})
`
}

promptUser()
    .then(function (answers) {
        const { username } = answers;
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl).then(function (res) {
            answers.profile = res.data.avatar_url;
            answers.email = res.data.email;
            const MD = genMD(answers);

            writeFileAsync("README.md", MD)
                .then(function () {
                    console.log("Successfully created README");
                })
                .catch(function (err) {
                    console.log(err);
                });
        }).catch(function (err) {
            console.log(err)
        })

    })

