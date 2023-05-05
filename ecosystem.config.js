module.exports = {
  apps : [{
    name   : "api-gateway",
    script : "./src/server.js",
    watch  : true,
    instances: 2, 
    exec_mode: "cluster", 
    increment_var: "SERVER_PORT", 
    env: {
            NODE_ENV: "production"
         }
  }]
}
