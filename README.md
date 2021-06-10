# contract-automation

## Project setup

Install Docker and Docker Compose (the following instructions
should work for Debian and Ubuntu):

```sh
sudo apt install docker.io
sudo usermod -aG docker $USER
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Reboot your machine, and then run:

```sh
git clone git@github.com:jasonhaymond/contract-automation.git
cd contract-automation
cp .env.example .env
```

Add your API keys and other environment variables to `.env`
using your favorite text editor.

## Usage

To run the app in production mode, use this command:

```sh
docker-compose -f docker-compose.yml run --service-ports --rm node [COMMAND]
```

To debug:

```sh
docker-compose run --service-ports --rm node [COMMAND]
```

`[COMMAND]` can be one of the following:

-   `sync` will synchronize the latest data from vendors (default)
-   `report` sends an email report using current database data
