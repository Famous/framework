FROM node

# Create app user
RUN useradd -ms /bin/bash app

ENV HOME /root/
ENV APP_HOME /opt/ecosystem

ADD . $APP_HOME
WORKDIR $APP_HOME
RUN mv $APP_HOME/.ssh /root/ && chmod 600 /root/.ssh/id_rsa

#rewrite /etc/hosts to include ip of the host machine to facilitate communication with the router
#router can now be accessed with http://router:8000
RUN cp /etc/hosts /tmp/hosts
RUN echo "`/sbin/ip route|awk '/default/ { print $3 }'`    router" >> /tmp/hosts
RUN mkdir -p -- /lib-override && cp /lib/x86_64-linux-gnu/libnss_files.so.2 /lib-override
RUN perl -pi -e 's:/etc/hosts:/tmp/hosts:g' /lib-override/libnss_files.so.2

RUN eval `ssh-agent -s` && \
    ssh-add /root/.ssh/id_rsa && cd $APP_HOME && \
    npm install . && rm -f /root/.ssh/id_rsa

ENV LD_LIBRARY_PATH /lib-override

EXPOSE 3000

# Define user Docker will use on entry
USER app

CMD ["node", "/opt/ecosystem/server.js"]
