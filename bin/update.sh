#!/usr/bin/env bash

kill `cat tmp/pids/thin.pid`
RAILS_ENV=prod thin start -d --socket /tmp/lclzr.sock