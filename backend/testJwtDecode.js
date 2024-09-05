const jwtDecode = require('jwt-decode').default;

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJHdXJ1IiwiaWF0IjoxNzI1NTE4NTM4LCJleHAiOjE3MjU1MjIxMzh9.3HFuWA1oBDicJzXZlF2qcx1OgSsY_UKQDvk3yiR_wxU'; // Replace with an actual token
try {
    const decoded = jwtDecode(token);
    console.log('Decoded Token:', decoded);
} catch (error) {
    console.error('Decoding failed:', error);
}
