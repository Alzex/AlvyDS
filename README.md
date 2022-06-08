# Alvy Discord Bot
Random Role Discord Bot

А bot created for entartaiment :)  

## Starting and configuration 
You will need Node.js v16+ with npm installed to run this bot  
Firstly, clone repository and install dependencies with folowing commands:  
```
git clone https://github.com/Alzex/AlvyDS.git  

npm i
```  

Then create `.env` cofiguration file with folowwing variables:  
`TOKEN` - Discord BOT's API token  
`DB_URL` - MongoDB access URL  
`CLIENT_ID` - Discord BOT's Client ID (for command deployment)  
`DEV_ID` - your Discord UID to gain access to DEV commands  
`GUILD_ID` - Discord gulds' ID to deploy commands locally for test  

After that you can run bot in 2 modes (production or test)  
If you choose test mode it will run with `nodemon index` process  
```
npm start
```
To run in production mode  
```
npm test
```
To run in test mode
