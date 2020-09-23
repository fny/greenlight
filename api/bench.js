import http from "k6/http";

export let options = {
    vus: 10,
    stages: [
        { duration: "30s", target: 10 },
    ]
};

export default function() {
  let response = http.get("http://localhost:3000/user/66dce15f-b33d-4acb-9c03-62f30e95f52e");
};
