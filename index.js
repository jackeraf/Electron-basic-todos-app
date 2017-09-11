
const electron = require ("electron")

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow;
let addWindow;

app.on("ready", ()=>{
	mainWindow = new BrowserWindow({})
	mainWindow.on("closed",()=> app.quit())
	mainWindow.loadURL(`file://${__dirname}/main.html`)

	const mainMenu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(mainMenu)
	// will replace the default menus dropdowns

})


function createAddWindow(){
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: "Add new Todo"
	})
	addWindow.loadURL(`file://${__dirname}/add.html`)
	addWindow.on("closed", ()=> addWindow = null )
	return addWindow
}

ipcMain.on("todo:add", (event, todo)=>{
	mainWindow.webContents.send("mainTodoUpdate", todo)
	addWindow.close()
	
})


const menuTemplate = [

	{
		label: "File",
		submenu: [
			{
				label: "New Todo",
				accelerator: "Ctrl+Shift+N",
				click(){
					return createAddWindow()
				}
			},
			{
				label : "Clear Todos",
				click(){
					return mainWindow.webContents.send("removeTodos")
				}
			},
			{
				label: "Quit",
				accelerator: (()=>{
					if(process.platform !== "darwin"){
						return "Ctrl+Shift+Q"
					}else{
						return "Command+Q"
					}
				})(),
				click(){
					app.quit()
				}
			}
		]
	}
]

if(process.platform === "darwin"){
	// darwin is the OSX core
	menuTemplate.unshift({})
}

if(process.env.NODE_ENV !== "production"){
	menuTemplate.push({
		label: "View",
		submenu: [
		{
			label: "Toggle developer tools",
			accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I" ,
			click(item, focusedWindow){
				// focusedWindow is the current clicked window
				focusedWindow.toggleDevTools()
			}
		},
		{
			role: "reload"
		}
		]
	})
}	