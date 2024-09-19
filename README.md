# asteroids-js

Pure TypeScript Asteroids game written originally in Java.

## Run the game

Clone the project.

```bash
  git clone https://github.com/agerber/asteroids_js
```

Navigate to the project directory and install all the required dependencies using Yarn.

```bash
  cd asteroids_js
  yarn install
```

Start the game

```bash
  yarn start
```

By default, the game runs in a browser environment. Running the game would automatically open the browser on the correct
path, starting the game.

For toggling the environment between browser or Electron (desktop) experience, modify config.json.

```json
  "mode": "browser|electron"
```

You can also toggle the environment without modifying the config.json file.

```bash
  yarn start:browser
  yarn start:electron
```

The best practice using Webstorm is to copy the dir ./runConfigurations/ to 
./.idea/ and then restart WebStorm. 
