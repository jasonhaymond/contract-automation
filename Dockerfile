FROM node:14

ARG NODE_ENV=production
ARG DB_DIR=/var/local/contract-automation
ARG APP_DIR=/opt/approot

ENV NODE_ENV=$NODE_ENV
ENV DB_PATH=$DB_DIR/app.db

# Allow Node debugging
EXPOSE 9229

RUN npm i npm@latest -g

# Create the folder that will store the DB
RUN mkdir $DB_DIR && chown node:node $DB_DIR

# Create and switch to the folder that will contain all app files
RUN mkdir $APP_DIR && chown node:node $APP_DIR
WORKDIR $APP_DIR

# Switch to non-root from here on out
USER node

# Install NPM dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force

# Copy in source files in a subdirectory
# to avoid issues with bind-mounting node_modules
WORKDIR $APP_DIR/app
COPY --chown=node:node . .

# Start the app
CMD [ "node", "src/app.js" ]
