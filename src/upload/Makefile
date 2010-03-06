# g++ -I ./include upload.cpp lib/librudecgi.a -o ../public_html/upload.cgi

CFLAGS = -I ../bin/include -O2 -Wall -g
LDFLAGS= ../bin/lib/librudecgi.a

CFLAGSi686 = -I ../i686/include -O2 -Wall -g
LDFLAGSi686= ../i686/lib/librudecgi.a

CC     = g++
BIN    = upload.cgi

all: link

build:
	$(CC) $(CFLAGS) -c upload.cpp

link: build
	$(CC)  upload.o $(LDFLAGS) -o $(BIN)

clean:
	rm -f *.o $(BIN)


buildi686:
	$(CC) $(CFLAGSi686) -c upload.cpp

linki686: buildi686
	$(CC)  upload.o $(LDFLAGSi686) -o $(BIN)

