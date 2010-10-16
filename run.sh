#!/bin/bash

echo \#\#\#\# STARTING $(date);

while true;
 do 

  node express.js

  exit_value="$?" ;
  echo \#\#\#\# FATAL ERROR OCCURED - EXITED WITH $?
  echo \#\#\#\# RESTARTING $(date);
  

done;
