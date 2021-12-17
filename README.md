# [OtterClam Frontend](https://app.otterclam.finance/)

This is the front-end repo for OtterClam Finance.

## 🔧 Setting up Local Development

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

### Run the app

Add this line to `/etc/hosts`

```
127.0.0.1 app.otterclam.local
```

Go to http://app.otterclam.local:3000
You can see the app now!

### Start a local node forked from Polygon

To test web3 integration, you can setup a local node forked from Polygon. Interact with local fork can test the contract interaction behavior without actually spend token on the Mainnet.

```bash
git clone git@github.com:OtterClam/otter-contracts.git
cd otter-contracts
yarn install
yarn hardhat node
```

### Config local network to metamask

You need to config your metamask to connect to the local node. Use "Add Network" function with the following information:

- Network Name: Hardhat Localhost
- New RPC URL: http://localhost:8545
- Chain ID: 31337
- Currency Symbol: MATIC

Now you can perform transaction against local node!

## 👏🏽 Contributing Guidelines

We keep an updated list of bugs/feature requests in [Github Issues](https://github.com/OtterClam/otter-frontend/issues).

![GitHub issues](https://github.com/OtterClam/otter-frontend/issues?style=flat-square)

Filter by ["good first issue"](https://github.com/OtterClam/otter-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) to get your feet wet!
Once you submit a PR, our CI will generate a temporary testing URL where you can validate your changes. Tag any of the gatekeepers on the review to merge them into master.

**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch.

_**NOTE**_: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`

## 🌏 Adding Translations

Thank you for helping to bring the OtterClam project to a wider community! 🦦

To add a new language to the supported list, the following steps are required:

- Add a translation file to the [locales](https://github.com/OtterClam/otter-frontend/tree/main/src/locales)
- Import the new locale file in [i18n.tsx](https://github.com/OtterClam/otter-frontend/tree/main/src/i18n.tsx) and add it to the `resources`
- Include the new language in the [LanguagePicker](https://github.com/OtterClam/otter-frontend/tree/main/src/components/LanguagePicker/index.tsx) dropdown menu.
- Add the corect Date formatting [Locale String](https://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes) in the `renderDate()` function in the file [locale-string.ts](https://github.com/OtterClam/otter-frontend/tree/main/src/helpers/locale-string.ts)
