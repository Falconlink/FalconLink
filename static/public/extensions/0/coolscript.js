const channel123 = new ExtensionMessageChannel();
channel123.sendMessage("testing123");

//css="\n@keyframes roll {\n  100%{\n    transform:rotate(360deg)\n  }\n}\nbody {\n  animation-name: roll;\n  animation-duration: 4s;\n  animation-iteration-count: 1;\n}\n";style=document.createElement("style");style.innerHTML=css;document.head.appendChild(style);