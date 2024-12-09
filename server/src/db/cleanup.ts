'use strict';

import db from '../db/db';

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

export async function cleanup() {
    const runAsync = (sql: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
    // Delete all data from the database.
    await runAsync('DELETE FROM users');
    //Add delete statements for other tables here
}
