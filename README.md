# kolabjar
 cek absen peserta kolabjar

 docker build -t bpn/backendkolabjar .

docker run -d -it -p 2929:80 --rm --cap-add=SYS_ADMIN --name backendkolabjar bpn/backendkolabjar