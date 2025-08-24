# UI Tests Using Playwright

Playwright enables reliable end-to-end testing for modern web apps.

## Getting Started

Clone the code from repository, https://github.com/Ommie1/playwright-ai.git
### Prerequisites

- NodeJS
- Npm

### Installation

In root folder,enter the following command . It will Install all the dependencies present in `package.json`

```
npm install
```

```
npx playwright install
```
### Framework Structure

- **data/**: Contains test data for AI queries in multiple languages.  
- **pages/**: Page Object Models (POMs) for modular UI interactions.  
- **tests/**: Playwright test files for validating AI chatbot responses.  
- **utils/**: Helper functions and scoring logic.  
- **ai-response-log/**: Stores AI responses captured during tests.  
- **ai-response-score/**: Stores scoring results in JSON format.  
- **global-setup.js**: Cleans up logs and reports before test runs. 
- **reports/**: HTML reporting of test execution 

## Running the tests

Run all tests, use following command,

```
npx playwright test
```

Run specific test, use following command,

```
npx playwright test tests/chatbot-ui.spec.js
```

## Disclaimer (Bugs)

- Occasionally, the application may stop providing responses; handle accordingly.
- Incomplete responses.
- Sometimes 500 error appears.

## Author

- **Syed Umair Hassan**
