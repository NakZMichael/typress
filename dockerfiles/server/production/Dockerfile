# ここからコピペ https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/docker/multi_stage_builds.md
# Start with fully-featured Node.js base image
FROM node:14.17 AS build
USER node
WORKDIR /home/node/app

# Copy dependency information and install all dependencies
COPY --chown=node:node package.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile

# Copy source code (and all other relevant files)
COPY --chown=node:node src ./src

# Build code
RUN yarn build


# Run-time stage
FROM node:14.17-alpine
# FROM node:14.4.0-alpine

# Set non-root user and expose port 8080
USER node
EXPOSE 8080

WORKDIR /home/node/app

# Copy dependency information and install production-only dependencies
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy results from previous stage
COPY --chown=node:node --from=build /home/node/app/dist ./dist

ENV NODE_ENV = production

CMD [ "node", "dist/index.js" ]