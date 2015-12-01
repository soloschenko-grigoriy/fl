FaceLess v0.0.1
==============


INSTALL:
--------------
- Install ImageMagick (MacOS: brew install imagemagick)
- npm install
- npm install -g grunt-cli
- npm install -g nodemon
- grunt prepare
- copy and edit config.js

START (on dev):
--------------
- screen mongod
- nodemon start.js

TEST:
--------------
- Server: grunt test:server
- Client: grunt test:client
- Both:   grunt test

GENERATE NEW REST MODULE:
--------------
- node gen %_MODULE_NAME_%

BUILD:
--------------
- grunt build