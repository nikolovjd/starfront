FROM ubuntu:bionic

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -y upgrade && apt-get -y install wget curl gnupg2

RUN wget -q -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get update

RUN apt-get -y install nodejs build-essential nano supervisor
RUN mkdir /app

# Create dir for supervisor logs
RUN mkdir -p /var/log/supervisor

WORKDIR /app

# Add supervisor conf from app to supervisor conf path
RUN ln -s /app/supervisor.conf /etc/supervisor/conf.d/
ENTRYPOINT ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
