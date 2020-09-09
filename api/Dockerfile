FROM oracle/graalvm-ce:20.1.0-java11 as graalvm
RUN gu install native-image

COPY . /home/app/api
WORKDIR /home/app/api

RUN native-image --no-server -cp build/libs/api-*-all.jar

FROM frolvlad/alpine-glibc
RUN apk update && apk add libstdc++
EXPOSE 8080
COPY --from=graalvm /home/app/api/api /app/api
ENTRYPOINT ["/app/api"]
