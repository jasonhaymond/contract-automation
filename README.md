# contract-automation

## Project setup

Install Docker and Docker Compose. Then run:

```sh
git clone git@github.com:jasonhaymond/contract-automation.git
cd contract-automation
cp .env.example .env
```

Add your API keys and other environment variables to `.env`.

## Using

To start the app in production mode, run this command:

```bash
./start-prod.sh
```

When you're finished, tear down the Docker container with:

```bash
docker-compose down
```
