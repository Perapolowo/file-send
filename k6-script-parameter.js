/* Specifying Test Pattern Parameters in Code. */

import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 10,
    iterations: 100,
};

export default function() {
    http.get('http://localhost:3000/');
    sleep(1);
}