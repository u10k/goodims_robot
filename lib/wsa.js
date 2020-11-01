const fs = require('fs');
const getWSAddress = () => new Promise(resolve => {
    fs.readFile(__dirname + '/wsa.txt', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
        resolve(data);
    });
});

// module.exports = {
//     getWSAddress: getWSAddress
// }
exports.getWSAddress = getWSAddress;