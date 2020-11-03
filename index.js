const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

const writeReadme = util.promisify(fs.writeFile);

let badgeImg;
let badgeUrl;
const licenseArray = ['MIT', 'GPLv2', 'GPLv3', 'Apache', 'Other', 'None'];
const licenseBadges = [
    {
        license: 'MIT',
        img: 'https://img.shields.io/badge/License-MIT-yellow.svg',
        url: 'https://opensource.org/licenses/MIT'
    },
    {
        license: 'GPLv2',
        img: 'https://img.shields.io/badge/License-GPL%20v2-blue.svg',
        url: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html'
    },
    {
        license: 'GPLv3',
        img: 'https://img.shields.io/badge/License-GPLv3-blue.svg',
        url: 'https://www.gnu.org/licenses/gpl-3.0'
    },
    {
        license: 'Apache',
        img: 'https://img.shields.io/badge/License-Apache%202.0-blue.svg',
        url: 'https://opensource.org/licenses/Apache-2.0'
    }
]

const prompts = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the title of your project:',
            name: 'title'
        },
        {
            type: 'input',
            message: "Enter author's name as well as any contributors (separated by commas) if applicable:",
            name: 'authors'
        },
        {
            type: 'input',
            message: 'Give a brief description of the project:',
            name: 'description'
        },
        {
            type: 'input',
            message: 'Provide the command that should be run to install dependencies:',
            name: 'installation'
        },
        {
            type: 'input',
            message: 'Provide the command for running tests on the program:',
            name: 'test'
        },
        {
            type: 'input',
            message: 'Provide usage information for the project if applicable:',
            name: 'usage'
        },
        {
            type: 'list',
            message: 'Select a license for the project:',
            name: 'license',
            choices: licenseArray
        },
        {
            type: 'input',
            message: 'Please provide any contribution guidelines for this project:',
            name: 'contribution'
        },
        {
            type: 'input',
            message: 'Enter your GitHub Username:',
            name: 'github'
        },
        {
            type: 'input',
            message: 'Enter your email address:',
            name: 'email'
        }
    ]);
} //end function prompts()

const generateReadme = (response) => {
    return `
![License](${badgeImg})
# ${response.title.trim()}
## Project Creators: ${response.authors.trim()}

<br />

### Table of Contents
* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Contribution Guidelines](#contribution-guidelines)
* [Testing Instructions](#testing-instructions)
* [License](#license)
* [Questions/Contact](#questions/contact)

<br />

#### Description

*${response.description.trim()}*

<br />

#### Installation

*${response.installation.trim()}*

<br />

#### Usage

*${response.usage.trim()}*

<br />

#### Contribution Guidelines

*${response.contribution.trim()}*

<br />

#### Testing

*${response.test.trim()}*

<br />

#### License

${badgeUrl}

<br />

#### Questions/Contact

*If you have any questions, feel free to reach out to me via GitHub or Email, listed below:*

**Github:** [${response.github.trim()}](https://github.com/${response.github.trim()}) 

**Email: ${response.email.trim()}**
    `;
} //end function generateReadme()



const licenseBadge = (response) => {

    if(response.license === 'Other'){
        badgeImg = 'Other License';
        badgeUrl = 'Other License';
    } else if(response.license === 'None'){
        badgeImg = 'No License';
        badgeUrl = 'No License';
    } else {
        for (let i = 0; i < licenseBadges.length; i++){
            console.log(licenseBadges[i].license);
            if(response.license === licenseBadges[i].license){
                badgeImg = licenseBadges[i].img;
                badgeUrl = licenseBadges[i].url;
                break;
            } //end if
        } //end for
    } //end if/else

} //end function licenseBadge()



async function init() {

    try {
        const response = await prompts();

        const license = licenseBadge(response);

        const readme = generateReadme(response);

        await writeReadme('README.md', readme);

        console.log("Generating README...");

    } catch(err) {
        console.log(err);
    } //end try/catch

} //end async function init()

init();