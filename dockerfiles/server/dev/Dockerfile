FROM node:14.17
USER node
WORKDIR /home/node/app

# Copy dependency information and install all dependencies
COPY --chown=node:node package.json yarn.lock  tsconfig.json ./

RUN yarn install --frozen-lockfile

# Copy source code (and all other relevant files)
COPY --chown=node:node src ./src

# Build code
RUN yarn build

EXPOSE 8080