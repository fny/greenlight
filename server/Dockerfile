FROM openjdk:14-alpine
COPY build/libs/core-*-all.jar core.jar
EXPOSE 8080
CMD ["java", "-Dcom.sun.management.jmxremote", "-Xmx512m", "-jar", "core.jar"]
