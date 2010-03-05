# g++ -I ./include upload.cpp lib/librudecgi.a -o ../public_html/upload.cgi

CFLAGS = -I ../bin/include -O2 -Wall -g
LDFLAGS= ../bin/lib/librudecgi.a
CC     = g++
BIN    = upload.cgi

all: link

build:
	$(CC) $(CFLAGS) -c upload.cpp

link: build
	$(CC) $(LDLAGS) upload.o $(LDFLAGS) -o $(BIN)

