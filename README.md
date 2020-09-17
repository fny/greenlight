# Greenlight 🚦

## Requirements

 - Java v10+
 - Kotlin v1.4+
 - Node.js v12+
 - PostgreSQL v12+
 - [Editorconfig Plugin](https://editorconfig.org/#download)

## Notes

### Covid Pathways

 - If nothing in survey is checked, proceed to school
 - If exposure only, stay home for 14 days
 - If diagnosed asymptomatic home for 10 days
 - If one symptom,
  - If positive or not tested:
    - 10 days since first symptoms
    - No fever for 24 hours (without fever reducing techniques)
    - Symptom improviment
  - Negative test
    - No fever for 24 hours
  - Confirmed alternative diagnosis

#### COLORS

LIGHT GREEN #33DA97

GREEN #00A183

DARK GREEN #0A322B

YELLOW #FFD034

PINK #FF3494

LIGHT GOLD #FFFAA1

GOLD #FFCD65

### UI Todo

#### User Settings

Your Information
Your Children
Add a Guardian
Approved Locations
Reminders and Notifications
Terms and Conditions
Software Licenses

TODO: Remove tests from app build
LINGUI FOR I18N


##  Roda

    data_received..............: 6.3 MB 204 kB/s
    data_sent..................: 940 kB 30 kB/s
    http_req_blocked...........: avg=5.18µs   min=1µs     med=2µs     max=1.45ms p(90)=3µs     p(95)=8µs
    http_req_connecting........: avg=1.21µs   min=0s      med=0s      max=669µs  p(90)=0s      p(95)=0s
    http_req_duration..........: avg=77.26ms  min=10.88ms med=19.08ms max=30.22s p(90)=38.7ms  p(95)=89.51ms
    http_req_receiving.........: avg=427.42µs min=19µs    med=116µs   max=4.66ms p(90)=1.18ms  p(95)=1.44ms
    http_req_sending...........: avg=15.48µs  min=6µs     med=14µs    max=272µs  p(90)=23µs    p(95)=25µs
    http_req_tls_handshaking...: avg=0s       min=0s      med=0s      max=0s     p(90)=0s      p(95)=0s
    http_req_waiting...........: avg=76.82ms  min=10.75ms med=18.69ms max=30.22s p(90)=37.92ms p(95)=88.56ms
    http_reqs..................: 7772   249.785062/s
    iteration_duration.........: avg=77.34ms  min=10.99ms med=19.16ms max=30.22s p(90)=38.75ms p(95)=89.6ms
    iterations.................: 7772   249.785062/s
    vus........................: 5      min=5  max=29
    vus_max....................: 30     min=30 max=30

## Sinatra

    data_received..............: 6.0 MB 193 kB/s
    data_sent..................: 854 kB 28 kB/s
    http_req_blocked...........: avg=5.1µs    min=1µs    med=2µs     max=1.42ms p(90)=3µs     p(95)=6µs
    http_req_connecting........: avg=1.17µs   min=0s     med=0s      max=560µs  p(90)=0s      p(95)=0s
    http_req_duration..........: avg=84.88ms  min=9.52ms med=21.05ms max=30.22s p(90)=55.2ms  p(95)=149.78ms
    http_req_receiving.........: avg=500.79µs min=21µs   med=191µs   max=5.18ms p(90)=1.32ms  p(95)=1.6ms
    http_req_sending...........: avg=16.03µs  min=6µs    med=14µs    max=548µs  p(90)=23µs    p(95)=25µs
    http_req_tls_handshaking...: avg=0s       min=0s     med=0s      max=0s     p(90)=0s      p(95)=0s
    http_req_waiting...........: avg=84.36ms  min=9.44ms med=20.57ms max=30.22s p(90)=55ms    p(95)=149.36ms
    http_reqs..................: 7062   227.029681/s
    iteration_duration.........: avg=84.96ms  min=9.58ms med=21.13ms max=30.22s p(90)=55.31ms p(95)=149.84ms
    iterations.................: 7062   227.029681/s
    vus........................: 4      min=4  max=29
    vus_max....................: 30     min=30 max=30

## Syro

    data_received..............: 6.1 MB 196 kB/s
    data_sent..................: 902 kB 29 kB/s
    http_req_blocked...........: avg=9.57µs   min=1µs    med=2µs     max=2.4ms  p(90)=4µs      p(95)=10µs
    http_req_connecting........: avg=1.15µs   min=0s     med=0s      max=835µs  p(90)=0s       p(95)=0s
    http_req_duration..........: avg=122.59ms min=6.03ms med=19.93ms max=31.07s p(90)=101.15ms p(95)=189.44ms
    http_req_receiving.........: avg=400.63µs min=22µs   med=65µs    max=5.41ms p(90)=1.19ms   p(95)=1.45ms
    http_req_sending...........: avg=16.73µs  min=6µs    med=15µs    max=605µs  p(90)=24µs     p(95)=27µs
    http_req_tls_handshaking...: avg=0s       min=0s     med=0s      max=0s     p(90)=0s       p(95)=0s
    http_req_waiting...........: avg=122.17ms min=5.96ms med=19.57ms max=31.07s p(90)=101.07ms p(95)=189.22ms
    http_reqs..................: 7458   239.629586/s
    iteration_duration.........: avg=122.68ms min=6.12ms med=20.01ms max=31.07s p(90)=101.26ms p(95)=189.5ms
    iterations.................: 7458   239.629586/s
    vus........................: 4      min=4  max=30
    vus_max....................: 30     min=30 max=30
