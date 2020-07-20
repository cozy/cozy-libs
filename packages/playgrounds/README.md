## How to use it

```jsx
yarn start
```

If you work on a local cozy and you don't have https enabled you have to define a global `ALLOW_HTTP` var at start to be able to login (see this line in cozy-authentication https://github.com/cozy/cozy-libs/blob/master/packages/cozy-authentication/src/steps/SelectServer.jsx#L111). With `parcel` you can use the `--global` option to do so

```
yarn start --global __ALLOW_HTTP__
```

You need to launch your browser with disabled CORS, for example on macOS (the important bits are the flags):

```
/Applications/Chromium.app/Contents/MacOS/Chromium --disable-web-security --user-data-dir="/tmp"
```

And on the connexion page, you need to indicate the full domain for your cozy when reaching
http://localhost:1234/index.html:

```
http://cozy.tools:8080
```
