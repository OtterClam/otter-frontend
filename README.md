# [OtterClam Frontend](https://app.otterclam.finance/)
This is the front-end repo for OtterClam Finance.

##  🔧 Setting up Local Development

Required: 
- [Node v14](https://nodejs.org/download/release/latest-v14.x/)  
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) 
- [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/OtterClam/otter-frontend.git
cd otter-frontend
yarn install
npm run start
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch. 

## 👏🏽 Contributing Guidelines 

We keep an updated list of bugs/feature requests in [Github Issues](https://github.com/OtterClam/otter-frontend/issues). 


![GitHub issues](https://github.com/OtterClam/otter-frontend/issues?style=flat-square)

Filter by ["good first issue"](https://github.com/OtterClam/otter-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) to get your feet wet!
Once you submit a PR, our CI will generate a temporary testing URL where you can validate your changes. Tag any of the gatekeepers on the review to merge them into master. 

*__NOTE__*: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`

## 🌏 Adding Translations

Thank you for helping to bring the OtterClam project to a wider community! 🦦

To add a new language to the supported list, the following steps are required:

- Add a translation file to the [locales](https://github.com/OtterClam/otter-frontend/tree/main/src/locales)
- Import the new locale file in [i18n.tsx](https://github.com/OtterClam/otter-frontend/tree/main/src/i18n.tsx) and add it to the `resources`
- Include the new language in the [LanguagePicker](https://github.com/OtterClam/otter-frontend/tree/main/src/components/LanguagePicker/index.tsx) dropdown menu.