A little script I threw together to automate logging into mobile games with multiple VM instances. Uses AutoHotKey macros and NoxPlayer.

AHK scripts that will be executed need to be named the same way as the package you want it to be run in. i.e. if you want to run "MoneyGrabGame" the ahk script to be executed after the package is launched will be called something like com.MoneyCorp.MoneyGrabGame.ahk

If you would ever want to use this script, you will need to edit config.json according to where your apps are, after you will need to run the convertAHK script (to convert all the ahk scripts in this project to executables).

Accepts "install" as an argument, will install all the .apk files in the "APKs" folder of the project.
