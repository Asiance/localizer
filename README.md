#  Hello

## Docs for the localizer facebook app

Stop server:
```kill `cat tmp/pids/thin.pid```

Restart server:
```RAILS_ENV=prod thin start -d --socket /tmp/lclzr.sock```

OR execute
```./bin/update.sh```

Deploy in prod:
```./bin/bootstrap.sh```

Add or edit messages:
- Edit config/messsages.sql
- sqlite3 -init config/messages.sql localizer.db

You may remove existing captions!
```rm public/captions/*```
