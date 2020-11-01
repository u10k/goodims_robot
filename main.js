const launch = require('./lib/launch');
const action = require('./aciton');
const login = require('./login');

(async () => {
    await launch.launch();
    await login.run();
    // await action.run().catch(err => {
    //     console.log(err);
    //     process.exit();
    // });
})();
