#!/bin/sh

#> install_python.sh <DIRECTORY_TO_INSTALL> ...<MODULES>

test "$1" || exit 1
TDIR="$1"
shift

AWD=$(realpath $0)
AWD=${AWD%/*}
PYZIP=${AWD}/python.zip
PIPPY=${AWD}/get-pip.py
echo "Install python to ${TDIR}"
test -d "${TDIR}" && echo "${TDIR} alreay exist!" && exit 1
mkdir -p "${TDIR}" && cd "${TDIR}"
test -f ${PYZIP} || wget -O ${PYZIP} "https://www.python.org/ftp/python/3.14.10/python-3.14.10-embed-amd64.zip"
test -f ${PIPPY} || curl -sSL "https://bootstrap.pypa.io/get-pip.py" -o ${PIPPY}
test -f python.exe || {
	unzip ${PYZIP}
	cp ${PIPPY} getpip.py
	./python.exe getpip.py
	rm getpip.py

	PTH=$(ls *._pth)
	cat ${PTH} | sed 's/#import site/import site/g' > tmp._pth
	mv tmp._pth ${PTH}
	./python.exe -m pip install --upgrade pip
	test "$1" && {
		echo "Install modules $@"
		./python.exe -m pip install $@
	}
}
