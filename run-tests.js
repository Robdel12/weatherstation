const spawn = require("child_process").spawn;
const platform = require("os").platform();

let tests;
let server = spawn("yarn", ["start:test"], {
  stdio: "inherit"
});

// Terrible, but give the server time to start
setTimeout(() => {
  tests = spawn("node", ["./tests.js"], {
    stdio: "inherit"
  });

  tests.on("close", () => {
    server.kill();
  });
}, 3000);

server.on("error", () => {
  // error
});
