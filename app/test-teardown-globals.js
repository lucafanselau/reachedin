/*
In order for jest to work with Mongo Db without detecting any open handles, there is a need
to use a test-teardown-global file with the following definitions
*/

module.exports = () => {
    process.exit(0);
};
