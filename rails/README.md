# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


## Model Creation Commands

((50000 + 20000 * 12 + 60000 + 10000 * 2 * 12 + 40000) / 12) / 300000

## Syro

    data_received..............: 11 MB  342 kB/s
    data_sent..................: 1.6 MB 51 kB/s
    http_req_blocked...........: avg=11.23µs  min=1µs     med=2µs     max=5.23ms p(90)=3µs      p(95)=4µs
    http_req_connecting........: avg=3.4µs    min=0s      med=0s      max=2.96ms p(90)=0s       p(95)=0s
    http_req_duration..........: avg=105.34ms min=10.96ms med=22.76ms max=30.84s p(90)=312.55ms p(95)=454.25ms
    http_req_receiving.........: avg=517.77µs min=17µs    med=73µs    max=39.9ms p(90)=1.49ms   p(95)=1.81ms
    http_req_sending...........: avg=13.59µs  min=6µs     med=13µs    max=2.41ms p(90)=16µs     p(95)=20µs
    http_req_tls_handshaking...: avg=0s       min=0s      med=0s      max=0s     p(90)=0s       p(95)=0s
    http_req_waiting...........: avg=104.81ms min=10.91ms med=22.25ms max=30.84s p(90)=312.37ms p(95)=453.74ms
    http_reqs..................: 12962  419.72556/s
    iteration_duration.........: avg=105.42ms min=11.01ms med=22.83ms max=30.85s p(90)=312.64ms p(95)=454.34ms
    iterations.................: 12962  419.72556/s
    vus........................: 45     min=45 max=45
    vus_max....................: 45     min=45 max=45

## Roda

    data_received..............: 10 MB  342 kB/s
    data_sent..................: 1.5 MB 51 kB/s
    http_req_blocked...........: avg=3.2µs    min=1µs    med=2µs     max=2ms     p(90)=3µs     p(95)=4µs
    http_req_connecting........: avg=311ns    min=0s     med=0s      max=1.16ms  p(90)=0s      p(95)=0s
    http_req_duration..........: avg=23.78ms  min=8.9ms  med=23.2ms  max=62.03ms p(90)=29.01ms p(95)=31.45ms
    http_req_receiving.........: avg=484.53µs min=17µs   med=52µs    max=16.13ms p(90)=1.51ms  p(95)=1.85ms
    http_req_sending...........: avg=13.38µs  min=6µs    med=13µs    max=454µs   p(90)=17µs    p(95)=20µs
    http_req_tls_handshaking...: avg=0s       min=0s     med=0s      max=0s      p(90)=0s      p(95)=0s
    http_req_waiting...........: avg=23.28ms  min=8.86ms med=22.74ms max=61.87ms p(90)=28.4ms  p(95)=30.83ms
    http_reqs..................: 12582  418.620222/s
    iteration_duration.........: avg=23.84ms  min=8.98ms med=23.27ms max=62.1ms  p(90)=29.08ms p(95)=31.53ms
    iterations.................: 12582  418.620222/s
    vus........................: 10     min=10 max=10
    vus_max....................: 10     min=10 max=10
