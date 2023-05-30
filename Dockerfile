FROM mcr.microsoft.com/windows/servercore:20H2

WORKDIR /app
COPY package.json .

# Add NodeJS and Oracle library to search path 
ENV PATH="C:\Windows\system32;C:\Windows;C:\app\node-v18.16.0-win-x64;C:\app\instantclient_19_19;"
 
# because we don't have PowerShell, we will install using CURL and TAR
# 1. NodeJS, Version 18.16.0
# 2. Install NPM packages 
# 3. Microsoft Visual Studio 2017 Redistributable
# 4. Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit, Version 19.19.0.0.0
# can't load Oracle library on servercore:20H2.
# running on servercore:20H is ~ 6 GB !!!
RUN curl.exe -o node-v18.16.0-win-x64.zip -L https://nodejs.org/dist/v18.16.0/node-v18.16.0-win-x64.zip && \
    tar.exe -xf node-v18.16.0-win-x64.zip && \
    del node-v18.16.0-win-x64.zip && \
    npm install --omit=dev && \
    curl -fSLo vc_redist.x64.exe https://aka.ms/vs/17/release/vc_redist.x64.exe && \
    start /w vc_redist.x64.exe /install /quiet /norestart && \
    del vc_redist.x64.exe && \
    curl.exe -o instantclient-basic-windows.x64-19.19.0.0.0dbru.zip https://download.oracle.com/otn_software/nt/instantclient/1919000/instantclient-basic-windows.x64-19.19.0.0.0dbru.zip &&\
    tar.exe -xf instantclient-basic-windows.x64-19.19.0.0.0dbru.zip && \
    del instantclient-basic-windows.x64-19.19.0.0.0dbru.zip 

COPY src .

EXPOSE 8989
CMD [ "node.exe", "c:\\app\\server"]

# 
# Reference:
# 1. Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit
#    https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html
# 2. Microsoft Visual C++ Redistributable latest supported downloads
#    https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170
# 3. Running a Node / Angular Application in a container based on Windows Nano Server
#    https://kevinsaye.wordpress.com/2019/08/06/running-a-node-angular-application-in-a-container-based-on-windows-nano-server/
#
# docker build -t albert0i/yrunner-on-node:1.0 . --no-cache
# docker run --name yrunner --rm --env-file .env -d -p 8989:8989 -v H:\aNewbie\yrunner-on-node\src\data:c:\app\data -v H:\aNewbie\yrunner-on-node\src\logs:c:\app\logs albert0i/yrunner-on-node:1.0
#
# docker exec -it yrunner cmd
# docker container stop yrunner
# docker image history albert0i/yrunner-on-node  
# 

#
# (2023/05/30)
# 