const sequelize = require('./db');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    } finally {
        await sequelize.close();
    }
}

testConnection();