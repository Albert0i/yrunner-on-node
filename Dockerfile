FROM mcr.microsoft.com/windows/nanoserver:20H2

ENV NODE_VERSION=18.16.0
 
WORKDIR /app
COPY package.json .
 
ENV PATH="C:\Windows\system32;C:\Windows;C:\app\node-v18.16.0-win-x64;C:\app\client\bin"
 
# because we don't have PowerShell, we will install using CURL and TAR
# running one command reduced the size form 1.08 GB to ~765 MB on NanoServer:1903
# running on Server Core is ~ 5.61 GB
RUN curl.exe -o node-v18.16.0-win-x64.zip -L https://nodejs.org/dist/v18.16.0/node-v18.16.0-win-x64.zip && \
    tar.exe -xf node-v18.16.0-win-x64.zip && \
    DEL node-v18.16.0-win-x64.zip && \  
    npm install --omit=dev

COPY src .
COPY bin ./client/bin
ENV PORT 8989
EXPOSE $PORT
CMD [ "node.exe", "c:\\app\\server"]


# 
# Reference:
# Running a Node / Angular Application in a container based on Windows Nano Server
# https://kevinsaye.wordpress.com/2019/08/06/running-a-node-angular-application-in-a-container-based-on-windows-nano-server/
#
# docker build -t albert0i/yrunner-on-node . --no-cache
# docker run --name yrunner --rm --env-file .env -d -p 8989:8989 -v H:\aNewbie\yrunner-on-node\src\data:c:\app\data albert0i/yrunner-on-node
#
# docker exec -it yrunner cmd
# docker container stop yrunner
#

#
# (2023/05/29)
# 