/* It's easy to start Load Testing with k6. */

import http from 'k6/http';
import { sleep } from 'k6';

export default function() {
    http.get('http://localhost:3000/');
    sleep(1);
}