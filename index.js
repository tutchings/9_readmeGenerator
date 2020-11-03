//node requires
const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');

//promisify write file
const writeReadme = util.promisify(fs.writeFile);

//global variable declarations
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

//prompts function that uses inquirer to ask the user a series of questions
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
            message: 'Please provide any contribution guidelines for this project if applicable:',
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



//returns a formatted readme based on user responses to the prompts() function
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



//determines the badgeImg and badgeUrl based on the user response to the license question in the prompts() function
const licenseBadge = (response) => {

    if(response.license === 'Other'){
        badgeImg = 'Other License';
        badgeUrl = 'Other License';
    } else if(response.license === 'None'){
        badgeImg = 'No License';
        badgeUrl = 'No License';
    } else {
        for (let i = 0; i < licenseBadges.length; i++){
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

        //sets response equal to an object formed by the user answers returned from the prompts() function
        const response = await prompts();

        //sets the badgeImg and badgeUrl variables based on user answer to license question returned from the prompts() function
        licenseBadge(response);

        //passes the response returned from the prompts() function and generates a formatted readme with the data
        const readme = generateReadme(response);

        //creates a readme file with the user's input data
        await writeReadme('README.md', readme);

        console.log("Generating README...");

    } catch(err) {
        console.log(err);
    } //end try/catch

} //end async function init()

init();