var harp = require('harp'),
    port = process.env.PORT || 5000,
    dir = '_source';

harp.server(dir, { port: port });

console.log('Harp server running on port ' + port);
console.log('Ctrl+C to exit.');