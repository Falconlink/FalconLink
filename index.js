import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node"
import proxy from "express-http-proxy";

var antiAdBlock = "";
async function fetchAntiAdBlock(attempts = 0) {
  const response = await fetch('https://adbpage.com/adblock?v=3&format=js');
  if (response.ok) {
    antiAdBlock = await response.text();
    return;
  } else {
    if (attempts < 3) {
      return fetchAntiAdBlock(attempts + 1);
    } else {
      throw new Error("Failed to fetch anti-adblock script after multiple attempts.");
    }
  }
}
setInterval(fetchAntiAdBlock, 1000 * 60 * 5);
await fetchAntiAdBlock();

const app = express();

app.use("/image/", proxy("https://images.crazygames.com", {proxyReqPathResolver: req => {
  return(req.originalUrl.slice(6));
}}));

app.use("/antiadblock.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(antiAdBlock);
});

// Load our publicPath first and prioritize it over UV.
app.use(express.static("static"));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Redirect to Discord
app.use("/discord/", (req, res) => {
  res.redirect("https://discord.gg/TSp7qKf4wY");
});

// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(process.cwd(), "static", "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/"))
    wisp.routeRequest(req, socket, head);
  else
    socket.end();
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  process.exit(0);
}

server.listen(port, "0.0.0.0");