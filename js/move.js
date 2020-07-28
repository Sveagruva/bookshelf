const fs = require('fs');

module.exports = move = async (from, to) => {
    fs.rename(from, to, async err => {
        if(!err){
            return;
        }

        var readStream = fs.createReadStream(from);
        var writeStream = fs.createWriteStream(to);

        readStream.on('close', () => {
            fs.unlink(from, resolve);
        });

        readStream.pipe(writeStream);
    });
}