contract-automation
===================

Project setup
-------------

Make sure [Node.js](https://nodejs.org/en/download/) is installed. Then run:

```sh
git clone git@github.com:jasonhaymond/contract-automation.git
cd contract-automation
npm install
cp .env.example .env
```

Add your API keys and other environment variables to `.env`.

Using
-----

Execute the tool with:

```bash
npm start
```

The tool currently generates an HTML report of device counts in Datto RMM. To view the report:

```bash
node src/index.js > report.html
```

After executing the above command, open the generated `report.html` in your web browser.
