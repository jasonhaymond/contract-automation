FROM node:14

# Set up Node environemt, defaulting to production
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Allow Node debugging
EXPOSE 9229

RUN npm i npm@latest -g

# Create and switch to the folder that will contain all app files
RUN mkdir /opt/approot && chown node:node /opt/approot
WORKDIR /opt/approot

# Switch to non-root from here on out
USER node

# Install NPM dependencies
COPY --chown=node:node package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force

# Copy in source files in a subdirectory
# to avoid issues with bind-mounting node_modules
WORKDIR /opt/approot/app
COPY --chown=node:node . .

# Start the app
CMD [ "node", "src/index.js" ]
