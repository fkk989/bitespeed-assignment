
# Identity Reconciliation 

* swagger ui link to test api https://faisalkhan989.xyz/api-docs/

* link  if you want to use postman to test https://faisalkhan989.xyz/api/identify

web service with an endpoint /identify that will receive HTTP POST requests with JSON body of the following format:
```js
{
	"email"?: string,
	"phoneNumber"?: number
}
```
and return a response of JOSN body as the following format:

```js
{
		"contact":{
			"primaryContatctId": number,
			"emails": string[], // first element being email of primary contact 
			"phoneNumbers": string[], // first element being phoneNumber of primary contact
			"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
		}
	}
```

### setup

#### with docker
* pre requisite 
1. you will need docker install in you machine

* start the docker demon and run the command to run the docker compose file

```
npm run docker:compose
```

* after running docker command you can go to http://localhost:3000/api-docs to  test the backend via swagger ui
* or if you want to use post man you can hit http://localhost:300/api/identify

#### without docker 
* pre requisite
1. start a postgress db localy or get a postgress db from supabase or any alternative you know change the DATABASE_URL with your DATABASE_URL

* Install dependencies. 
```
npm install
```
* start the server 
```
npm run dev
```
* this will start the server for you now you can go to http://localhost:3000/api-docs to test the rest api endpoint
* or if you want to use post man you can hit http://localhost:300/api/identify




