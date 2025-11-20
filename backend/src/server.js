const app = require('./app');
const { sequelize } = require('../models');

const PORT = process.env.PORT || 5000;

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Unable to connect to database:', err);
        process.exit(1);
    });