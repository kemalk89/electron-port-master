# electron-port-master
This is a simple application where you can look for applications using port XY. 
It is written with HTML, JavaScript and CSS. 

It simply wraps the Windows command `netstat -anb` and shows the results in
readable manner. 

In addition you can terminate respective applications which are blocking the searched port.
Therefore there is a simple wrapper around the windows `taskkill /f /pid <pid>` command.

# How to run?
1. Clone Repository and navigate to Project Directory
2. Run in Command Line: `npm i`
3. Next run in Command Line `npm run electron`
