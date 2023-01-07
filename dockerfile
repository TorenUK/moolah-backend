FROM node:16-alpine

WORKDIR /src

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json /src/

# Install dependencies
RUN npm install

# Copy the rest of the source code to the working directory
COPY . /src/

# Compile the TypeScript code to JavaScript
RUN npm run build

CMD ["node", "./dist/index.js"]
