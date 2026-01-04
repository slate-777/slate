const db = require('./config/db');

// Check for duplicate session IDs
const query = `
    SELECT id, session_title, session_host, session_date, 
           COUNT(*) as count 
    FROM sessions 
    GROUP BY id 
    HAVING count > 1
    ORDER BY id;
`;

db.query(query, (err, results) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }

    console.log('=== DUPLICATE SESSION IDs ===');
    if (results.length === 0) {
        console.log('No duplicate IDs found!');
    } else {
        console.log('Found duplicate IDs:');
        console.table(results);
    }

    // Check all sessions
    db.query('SELECT id, session_title, session_host FROM sessions ORDER BY id', (err2, all) => {
        if (err2) {
            console.error('Error:', err2);
            process.exit(1);
        }
        console.log('\n=== ALL SESSIONS ===');
        console.table(all);

        // Check table structure
        db.query('SHOW CREATE TABLE sessions', (err3, structure) => {
            if (err3) {
                console.error('Error:', err3);
                process.exit(1);
            }
            console.log('\n=== TABLE STRUCTURE ===');
            console.log(structure[0]['Create Table']);
            process.exit(0);
        });
    });
});
