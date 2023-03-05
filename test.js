const fs = require('fs')

function multirequest(number) {
    const ip = 'http://localhost:3000'
    const endpoint = '/file'
    const address = `${ip}${endpoint}`;
    for (let i = 0; i < number; i++) {
        console.log('fetch number', i + 1)
        fetch(address).then((response) => {
            const headers = response.headers.get('content-disposition');
            const filename = headers.split('; ')[1].split('=')[1]
            response.blob().then(blob => {
                const readStream = blob.stream()
                const writeStream = fs.createWriteStream('./tester/' + i.toString() + filename);
                const stream = new WritableStream({
                    write(chunk) {
                        writeStream.write(chunk);
                    },
                });
                readStream.pipeTo(stream).finally(() => {
                    // readStream.cancel();
                    // writeStream.close();
                    // stream.close();

                })

            })

        })
    }
}

async function testMySQL2(number) {
    const start = Date.now();
    for (let i = 0; i < number; i++) {

        const endpoint = 'http://localhost:3000/users';
        const resposne = await fetch(endpoint)
        const data = await resposne.json();
    }
    
    console.log(Date.now() - start, 'ms');
}
function testMySQL23(number) {
    const start = Date.now();
    for (let i = 0; i < number; i++) {

        const endpoint = 'http://localhost:3000/users';
       fetch(endpoint).then(value => {
        value.json().then(data => {
            
        })
       })
       
    }
    
    console.log(Date.now() - start, 'ms');
}


// multirequest(100000)
testMySQL23(6000)