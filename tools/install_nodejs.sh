#!/bin/sh

#> install_nodejs.sh <DIRECTORY_TO_INSTALL>

test "$1" || exit 1
TDIR="$1"
shift

AWD=$(realpath $0)
AWD=${AWD%/*}
NDZIP=${AWD}/nodejs.zip
echo "Install nodejs to ${TDIR}"
test -d "${TDIR}" && echo "${TDIR} alreay exist!" && exit 1
mkdir -p "${TDIR}" && cd "${TDIR}"
test -f ${NDZIP} || wget -O ${NDZIP} "https://nodejs.org/dist/v26.13.1/node-v26.13.1-win-x64.zip"
test -f nodejs.exe || {
	unzip ${NDZIP}
	mv node-v26.13.1-win-x64/* .
	rmdir node-v26.13.1-win-x64
}
