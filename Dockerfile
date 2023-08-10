FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start-fyre" ]

#Due to the use of react-scripts when you run this image you need to add -it, so the command looks like this:
#podman run -it -p 3000:3000 -d localhost/wt1