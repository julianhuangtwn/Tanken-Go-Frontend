# Tanken-Go Frontend

Tanken-Go is an AI-powered trip planning application that also fosters community engagement. This repository contains the **frontend** code of the application.

To use all features, please also set up the [Tanken-Go Backend](https://github.com/julianhuangtwn/Tanken-Go-Backend).

---

## Installation Instructions

### Prerequisites

- **Backend**  
  Clone and run the backend from [here](https://github.com/julianhuangtwn/Tanken-Go-Backend).

- **API Keys**  
  You’ll need to acquire API keys google maps API:
  - [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key)

---

### Starting Locally

1. Ensure that the backend is running (backend link)
2. Open VSCode
3. Use the bash or command line and run the command<br>
      ```git clone https://github.com/julianhuangtwn/Tanken-Go-Frontend.git```
5. Run the command <br>
`npm i`
6. Create a `.env` file at the root of the project
7. Copy and paste: <br>
<pre><code>NEXT_PUBLIC_API_URL=localhost:8080 
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY= /*Google Maps API Key*/</code></pre>
8. Run the command <br>
`npm run dev`
9. Visit localhost:3030
### Deploying Online
**Prerequisite** <br>
Deploy backend on public before proceeding <br>
**Instructions**
1. Fork this repository
2. Go to Render
3. Sign in using github (SSO)
4. Go to +Add new > Web Service
5. Select the forked repository
6. In the Environment Variables, include:
<pre><code>NEXT_PUBLIC_API_URL = /*Deployed Backend Link*/
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = /*Google Maps API Key*/</code></pre>

## Technical Document 
**Tech Stack** <br>
Our application uses nextjs for front-end, express js for backend and oracledb for database. Some of the other services we used are: <br>
![Project Tech Stack Image](/Project_Artifact_Screenshots/tech_stack.png)<br>
**AI Pipeline**<br>
Our main feature is to utilize AI to plan the trip for the user. The following diagram shows the flow of the requests. <br>
![AI Pipeline Image](/Project_Artifact_Screenshots/ai_pipeline.png) <br>
**Database Tables**<br>
![Database Entity Relation Diagram](/Project_Artifact_Screenshots/database_diagram.png)<br><br>
## List of Deviation
**Manual Trip Search**<br>
In the proposed SRS, we included that the users could search specific trips and add them into the trip list. Instead, we have implemented AI to do the search and add the trip to the list for the user.<br><br>
**AI Python**<br>
Initially, use of Python was proposed in SRS, however, after reading the OpenAI API documentation, it was no longer a necessary tech stack.<br><br>
**Website Design**<br>
Due to change in plans for the manual search, we had to improvise the design as well. See Images below: <br><br>
![Prototype before](/Project_Artifact_Screenshots/prototype.png)<br>
fig 1. Manual search prototype for editing trip<br><br>
![Prototype after](/Project_Artifact_Screenshots/after.JPG)<br>
fig 2. edit trip page design<br><br>
**Database Model** <br><br>
According to the SRS document, AI Chat logs were kept in the database. Instead, we saved the final trip destination to save space on the database. The reason behind the change is because there is little to no impact on the user experience with the change, making our application simpler to use and implement.

## Other information
Our platform does not have a level of access (i.e. admin account), so feel free to create your own credential and test out our application.<br>
If you wish to use a general account, please use the credentials below:<br>
email: demotankengo@gmail.com<br>
password: @Demo1234<br>
