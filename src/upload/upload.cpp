/*
 *
 * de.daemon.tiddlywiki upload cgi for webOS Tiddlywiki
 * port by Thomas Linden. Depends on mobi.optware.lighttpd
 *
 * Licensed under the terms of the BSD License.
 *
 * Copyright (c) 2010 Thomas Linden.
 *
 */

// we use the rudeserver cgi framework
// source: http://www.rudeserver.com/cgi
#include <rude/cgi.h>

// system includes
#include <iostream>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>
#include <time.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <dirent.h>

// fs locations, must reflect values configured in actual itw.html
#define WIKI      "itw.html"
#define FORMVAR   "userfile"
#define BACKUPDIR "backup"

using namespace std;

int form(string message) {
  // provide an upload form, for debuggin purposes only.
  cout << "<html><body>"
       << message 
       << "<br>"
       << "<form action='upload.cgi' method='POST' enctype='multipart/form-data'>"
       << "<input type='file' name='" << FORMVAR << "'>"
       << "<input type='submit' value='upload'>"
       << "</form></body></html>" << endl;
  return 0;
}


void register_backups(void) {
  struct dirent *file;
  DIR *dirp;
  string filename;
  vector <string> filelist;

  dirp = opendir(BACKUPDIR);

  while ((file = readdir(dirp)) != NULL) {
    filename = file->d_name;
    if (filename.find(".html") != string::npos) {
      filelist.push_back(filename);
    }
  }

  (void)closedir(dirp);

  if (! filelist.empty() ) {

    sort(filelist.begin(), filelist.end());
    reverse(filelist.begin(), filelist.end());

    ofstream json;
    stringstream jsonfile (stringstream::in | stringstream::out);
    jsonfile << BACKUPDIR << "/register.json";
    json.open(jsonfile.str().c_str());

    json << "{ \"backups\": [" << endl;

    for(vector<string>::iterator vecIt=filelist.begin(); vecIt != filelist.end(); ++vecIt) {
      json << " { \"file\": \"" << *vecIt << "\" }," << endl;
    }

    json << "]}" << endl;

    json.close();
  }
}

int main(void) {
  cout << "Content-Type: text/html\n\n";

  try {
    // create a timestamp for backups
    // format: YYYY-MM-DD-hh-mm-itw.html
    time_t mytime;
    struct tm * timeinfo;
    char timestamp [80];
    time(&mytime);
    timeinfo = localtime ( &mytime );
    strftime (timestamp, 80, "%Y-%m-%d-%H-%M", timeinfo);

    // parse cgi query and postvars
    rude::CGI parser;
    string message="";

    if( parser.exists(FORMVAR) && parser.isFile(FORMVAR) ) {
      // we got valid file upload
      ofstream handle;
      handle.open(parser.filename(FORMVAR));

      if(handle) {
	// save uploaded file to current directory
	handle << parser.value(FORMVAR);
	handle.close();

	// respond to the wiki (0 signales success)
	cout << "0 -  File successfully saved in " << WIKI << endl
		  << "mtime:" << mytime << endl;

	if(eaccess(BACKUPDIR, X_OK) != 0) {
	  // backup directory doesn't exist, try to create it
	  if(mkdir(BACKUPDIR, 0777) != 0) {
	    // for whatever reason it failed, make no backup
	    cout << "Could not create backup copy!";
	    return 0;
	  }
	}
       
	// generate the backup file filename
	stringstream backupfile (stringstream::in | stringstream::out);
	backupfile << BACKUPDIR << "/" << timestamp << "-" << WIKI;
	string copy = backupfile.str();

	// actually copy current wiki file to backup directory
	ifstream orig;
	ofstream bak;

	orig.open(WIKI);
	bak.open(copy.c_str());
	char ch;

	while(orig && orig.get(ch))
	  bak.put(ch);

	bak.close();
	orig.close();

	cout << "Backed up wiki to " << copy << endl;

	register_backups();
      }
      else {
	message = "-1 - Could not write file!\n";
	form(message);
      }
    }
    else {
      message = "-1 - Invalid parameters!\n";
      form(message);
    }

  }
  catch (...) {
    cout << "processing failed!";
  }  
  return 0;
}


