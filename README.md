# contract-automation

## Project setup

Install Docker and Docker Compose (the following commands
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
git clone https://github.com/jasonhaymond/contract-automation.git
cd contract-automation
cp .env.example .env
$EDITOR .env
```

Add your API keys and other environment variables to `.env`
and save the changes.

## Usage

Before running the app, and after updating the code with
`git pull`, you need to build the Docker container:

```sh
docker-compose build
```

To run the app in production mode, use this command
(see below for possible values of `[COMMAND]`):

```sh
docker-compose -f docker-compose.yml run --service-ports --rm node [COMMAND]
```

To debug:

```sh
docker-compose run --service-ports --rm node [COMMAND]
```

`[COMMAND]` can be one of the following:

-   `sync` will synchronize the latest data from vendors (default)
-   `report` sends an email report.  
     By default, the report is for the previous month. Add `--current` to use the current month.

`sync` should be run every few hours. `report` can be run at any time with no side effects.

## Scheduling with `cron`

This example demonstrates how to use `cron` to schedule the tool to synchronize
every four hours and send a monthly report. Open your crontab with `crontab -e`
and add the following lines, replacing the path as needed:

```sh
0 */4 * * * cd /home/USERNAME/contract-automation && /usr/local/bin/docker-compose -f docker-compose.yml run --service-ports --rm node sync
0 0 1 * * * cd /home/USERNAME/contract-automation && /usr/local/bin/docker-compose -f docker-compose.yml run --service-ports --rm node report
```
