const config = {
    "user" : process.env.SQL_USER,
    "password": process.env.SQL_PASSWORD,
    "server": process.env.SQL_SERVER,
    "database": process.env.SQL_DATABASE,
    options:{
        trustedConnection: true,
        enableAritPort: true,
        instancename: 'Luckhost'
    }

}

module.exports = config;