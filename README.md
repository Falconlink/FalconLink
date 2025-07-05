<h2>FalconLink - A modern web proxy</h2>

<h3>Features:</h3>
 
-4,000 games
 
-Uses ultraviolet, a fast and secure proxy

-Clean UI

-Developer console (We used eruda https://github.com/liriliri/eruda)

-Browser with multiple tabs, back/forwards arrows, reload button, search/url bar, cloak in about:blank page in new tab, and fullscreen

[![Deploy to Koyeb](https://camo.githubusercontent.com/86721113f7f1649ceda6caf7ee264dbe44ce51f3f963c97c0d023de58f30d0f8/68747470733a2f2f62696e6261736862616e616e612e6769746875622e696f2f6465706c6f792d627574746f6e732f627574746f6e732f72656d6164652f6b6f7965622e737667)](https://app.koyeb.com/deploy?name=falconlink&instance_type=free&regions=was&instances_min=0&autoscaling_sleep_idle_delay=300&ports=8080%3Bhttp%3B%2F&hc_protocol%5B8080%5D=tcp&hc_grace_period%5B8080%5D=5&hc_interval%5B8080%5D=30&hc_restart_limit%5B8080%5D=3&hc_timeout%5B8080%5D=5&hc_path%5B8080%5D=%2F&hc_method%5B8080%5D=get)
<h3>NOTE: Default port is 8080, you may have to change it with an environment variable depending on how you are hosting FalconLink.</h3>

<h3>How to deploy to a server:</h3>
<h4>Without a reverse proxy</h4>

1. Clone the repository on your server (run "git clone https://github.com/Falconlink/FalconLink")

2. Go to the directory Falconlink is stored in (run "cd FalconLink")

3. Install the nodejs packages (run "npm i")

4. Start the server (run "PORT=8080 npm start" or "$env:PORT=8080; npm start" depending on your server - Note: Edit the number to change the port it is hosted on)

5. You have successfully deployed FalconLink! 

<h4>Using Caddy (Best for a VPS, will automatically create an SSL certificate for any domain with an A record pointing to it)</h4>

1. Make sure you have Docker and Docker-compose installed.

2. Clone the repository on your server (run "git clone https://github.com/Falconlink/FalconLink")

3. Go to the directory Falconlink is stored in (run "cd FalconLink")

4. Make the installation script executable (run "chmod +x caddy.sh")

5. Run the installation script (run "sudo ./caddy.sh")

6. You have successfully deployed FalconLink!
