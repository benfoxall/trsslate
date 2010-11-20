#!/bin/bash

echo \#\#\#\# STARTING $(date);

while true;
 do 

  /home/ben/opt/bin/node server.js 80

  exit_value="$?" ;
  echo \#\#\#\# FATAL ERROR OCCURED - EXITED WITH $?
  echo \#\#\#\# RESTARTING $(date);
  

done;
