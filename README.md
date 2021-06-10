# contract-automation

## Project setup

Install Docker and Docker Compose (the following instructions should work
for Debian and Ubuntu):

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

## Using

To start the app in production mode, run this command:

```bash
./start-prod.sh
```

When you're finished, tear down the Docker container with:

```bash
docker-compose down
```
