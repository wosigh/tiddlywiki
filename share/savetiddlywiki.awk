#!/usr/bin/awk -f

BEGIN {
  boundary = "\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-AaB03x";
  inbound  = 0;
  valid    = 0;
  wiki     = "itw.html";

  bytes = ENVIRON["CONTENT_LENGTH"];
  print "bytes: " bytes > "/tmp/bytes"
  cmd = "dd ibs=1 count=" bytes " 2>/dev/null";

  _RS = RS;
  RS="\f";

  cmd | getline rawdata;
  close (cmd);

  RS = _RS;

  print rawdata > "/tmp/rawdata";

  while(( getline line < "/tmp/rawdata") > 0) {
    if(! inbound)
       if(match(line, "DOCTYPE html PUBLIC"))
	 inbound = 1;
    
    if(inbound) {
      if(line == "</html>" )
	inbound = 0;
      content = content line "\n";
  }

  print "Content-Type: text/html\n";
  if(match(content, "DOCTYPE html")) {
    print content > wiki;
    print "0 - File successfully loaded in itw.html";
    "stat -f '%m' upload.txt" | getline mtime;
    print "mtime:" mtime;
  }
  else {
    print "-1 Error: you didn't upload a valid TiddlyWiki!";
  }

  exit(0)
}
