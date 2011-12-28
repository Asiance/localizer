#!/usr/bin/env bash

mkdir public/uploads
mkdir public/captions
mkdir logs

sqlite3 -init config/messages.sql localizer.db
