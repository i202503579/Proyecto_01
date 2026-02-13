const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Mysql',
    server: 'PLUTO',   // exacto como aparece
    database: 'ProyectoEXP2',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};


async function connectDB() {
    try {
        await sql.connect(config);
        console.log("Conectado a SQL Server 🚀");
    } catch (err) {
        console.error("Error de conexión:", err);
    }
}

module.exports = {
    sql,
    connectDB
};
