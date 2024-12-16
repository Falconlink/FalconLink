<h2>FalconLink - A modern web proxy</h2>

<h3>Features:</h3>
 
-4,000 games
 
-Uses ultraviolet, a fast and secure proxy

-Clean UI

-Developer console (We used eruda https://github.com/liriliri/eruda)

-Browser with multiple tabs, back/forwards arrows, reload button, search/url bar, cloak in about:blank page in new tab, and fullscreen

[![Deploy to Koyeb](https://camo.githubusercontent.com/86721113f7f1649ceda6caf7ee264dbe44ce51f3f963c97c0d023de58f30d0f8/68747470733a2f2f62696e6261736862616e616e612e6769746875622e696f2f6465706c6f792d627574746f6e732f627574746f6e732f72656d6164652f6b6f7965622e737667)](https://app.koyeb.com/deploy?name=FalconLink&type=git&repository=Falconlink%2FFalconLink&branch=main&builder=buildpack&regions=was&env%5B%5D=&ports=8080%3Bhttp%3B%2F)
[![Deploy with Vercel](https://camo.githubusercontent.com/cb957848ec6958049e48303f34a7f46a2f00e1f0f4a108b4d32acfb4b402e109/68747470733a2f2f62696e6261736862616e616e612e6769746875622e696f2f6465706c6f792d627574746f6e732f627574746f6e732f72656d6164652f76657263656c2e737667)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFalconlink%2FFalconLink%2Ftree%2Fmain)
<h3>NOTE: Default port is 8080, you may have to change it with an environment variable depending on how you are hosting FalconLink.</h3>

<h3>How to deploy to a server:</h3>
<h4>Without Docker or Nginx Proxy Manager (Not as secure and usually harder to add domains)</h4>

1. Clone the repository on your server (run "git clone https://github.com/VIPdestroy/FalconLink")

2. Go to the directory Falconlink is stored in (run "cd FalconLink")

3. Install the nodejs packages (run "npm i")

4. Start the server (run "PORT=8080 npm start" or "$env:PORT=8080; npm start" depending on your server - Note: Edit the number to change the port it is hosted on)

5. You have successfully deployed FalconLink! 

<h4>Using Docker and Nginx Proxy Manager (Recommended)</h4>

1. Make sure you have Docker and Docker-compose installed.

2. Clone the repository on your server (run "git clone https://github.com/VIPdestroy/FalconLink")

3. Go to the directory Falconlink is stored in (run "cd FalconLink")

4. Start the docker containers (run "docker-compose up -d --build")

5. You have successfully deployed FalconLink!
