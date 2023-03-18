/* Stage Load Testing by setting the number of vus to go up and down for a specified period of time. */

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m30s', target: 10 },
        { duration: '20s', target: 0 },
    ],
};

export default function() {
  http.get('http://localhost:3000/');
  sleep(1);
}