#
# debian package 'ctags' is required to build
#

NAME    = de.daemon.tiddlywiki.upload
VERSION = 1.0.0
DEPENDS = 
SRC_TGZ = http://www.rudeserver.com/cgiparser/download/rudecgi-5.0.0.tar.gz

include ../../support/download.mk

.PHONY: unpack
unpack: build/.unpacked

${DL_DIR}/rudecgi-5.0.0-src.tar.gz:
	curl -f -R -L -o ${DL_DIR}/rudecgi-5.0.0-src.tar.gz ${SRC_TGZ}

build/.unpacked: ${DL_DIR}/rudecgi-5.0.0-src.tar.gz
	rm -rf build
	mkdir -p build
	tar -C build -z -x -f $<
	mv build/rudecgi-5.0.0 build/src
	touch $@

include ../../support/staging.mk

include ../../support/cross-compile.mk

stage:: build/armv7.built

build/.configured:
	rm -f $@
	( cd build/src ; ${SB2} LDFLAGS="\"-L/usr/local/lib -Wl,-rpath-link,/usr/local/lib -Wl,-rpath,/usr/local/lib\"" \
	 ./configure --prefix=`pwd`/../bin )
	touch $@

build/rude.build: build/.unpacked build/.configured
	( cd build/src ; ${SB2} cp `which libtool` . )
	( cd build/src ; ${SB2} make && ${SB2} make install )
	touch $@


build/%.built: build/rude.build
	mkdir -p build/upload
	cp -r upload/* build/upload/
	( cd build/upload ; ${SB2} make )
	( cp build/upload/upload.cgi savetiddlywiki.cgi )
	touch $@

clean:
	( cd build/src ; ${SB2} make clean )


clobber::
	rm -rf build






i686: build/i686.built

build/.configured.i686:
	rm -f $@
	( cd build/src ; ./configure --prefix=`pwd`/../i686 )
	touch $@

build/rude.build.i686: build/.unpacked build/.configured.i686
	( cd build/src ; make && make install )
	touch $@


build/i686.built: build/rude.build.i686
	mkdir -p build/upload
	cp -r upload/* build/upload/
	( cd build/upload ; make clean )
	( cd build/upload ; make linki686)
	( cp build/upload/upload.cgi i686savetiddlywiki.cgi )
	touch $@
