module.exports = {
  apps : [{
    name   : "api-gateway",
    script : "./src/server.js",
    instances: 2, 
    exec_mode: "cluster",
    increment_var: "SERVER_PORT", 
    env: {
            SERVER_PORT: 8989, 
            NODE_ENV: "production"
         }
  }]
}
