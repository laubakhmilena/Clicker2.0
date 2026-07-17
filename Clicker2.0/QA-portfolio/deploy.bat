@echo off
setlocal
set PROJECT=%1
if "%PROJECT%"=="" (
	echo Usage: deploy.bat PROJECT_NAME
	exit /b 1
)
set HOST=deploy@147.78.67.7
scp index.html style.css script.js click.wav menu.wav start.wav %HOST%:/var/www/web/projects/%PROJECT%/
