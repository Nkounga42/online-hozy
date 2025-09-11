import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
     width: 1100,
    height: 700,
    minWidth: 500,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Charger ton fichier HTML ou le build de Vite
  //mainWindow.loadFile(path.join(__dirname, "../../dist-react/index.html"));
  mainWindow.loadURL("http://localhost:5173");

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
