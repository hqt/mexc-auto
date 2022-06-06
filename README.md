Install libraries
```
npm install
```

Update the following setting to avoid Chrome headless browser focuses on top
Step 1: open the following file
```
vi node_modules/puppeteer/.local-chromium/mac-1002410/chrome-mac/Chromium.app/Contents/Info.plist 
```

Step 2: Add the following code right after the first `dict` block
```
<key>LSBackgroundOnly</key>
<string>True</string>
```

Manually run app
```
npm run app
```

Run the cron job
```
node cron.js
```
