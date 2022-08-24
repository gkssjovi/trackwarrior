#!/bin/bash

start_command=${1:-fish}

yes | timew &> /dev/null
yes | task &> /dev/null

cp -n /root/.taskrc /trackwarrior-docker/old-taskrc

mkdir -p /root/.config/fish/conf.d
mkdir -p /root/.task/hooks
mkdir -p /root/.timewarrior/extensions

cmp --silent /trackwarrior-docker/old-taskrc /root/.taskrc && \
  cp /trackwarrior-docker/taskrc /root/.taskrc
cp -n /trackwarrior-docker/base.fish /root/.config/fish/conf.d/base.fish
cp -n -r /trackwarrior/taskwarrior/hooks/* /root/.task/hooks/
cp -n -r /trackwarrior/timewarrior/extensions/* /root/.timewarrior/extensions/

cd /root/.task/hooks && chmod +x on-modify.trackwarrior on-add.trackwarrior
cd /root/.timewarrior/extensions && chmod +x trackwarrior-duration.js trackwarrior-ids.js

# change directory to home
cd

$start_command
