const path = require('path');
const http = require('http');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const handler = require('serve-handler');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.removeMenu()
  if(isDev){
    try{
      win.loadURL('http://localhost:5000');
    }catch(err){
      console.log(err)
    }
  }else{
    win.loadURL('http://localhost:3000')
  }
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
  win.maximize()
}

const server = http.createServer((request, response) => {
  return handler(request, response,
      {
        public: path.join(__dirname, 'build'),
        cleanUrls: true
      }
    )
})

function startServer(){
  server.listen(5000, ()=>{
    console.log('Running at port 5000');
  })
}

function stopServer(){
  server.removeAllListeners();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(
  () => {
    startServer();
    createWindow();
  }
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});