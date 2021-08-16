FROM node:12

ARG NODE_ENV

RUN apt-get update

RUN mkdir -p /bbe-group-service

COPY . /bbe-group-service/
WORKDIR /bbe-group-service/

# Install app dependencies
RUN cd /bbe-group-service

RUN npm install

EXPOSE 8080

CMD if [ "$NODE_ENV" = "DEVELOPMENT" ] ; then npm run sonar-prod ; else npm run prod ; fi
