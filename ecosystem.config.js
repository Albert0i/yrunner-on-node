module.exports = {
  apps : [{
    name   : "api-gateway",
    script : "./src/server.js",
    watch  : true,
    instances: 1, 
    exec_mode: "cluster", 
    increment_var: "SERVER_PORT"
  }]
}
