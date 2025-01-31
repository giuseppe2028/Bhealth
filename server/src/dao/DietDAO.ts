import {Plate} from "../components/Meal";
import db from "../db/db";
import {PlateNotFoundError} from "../errors/dietError";
import {getCalories} from "../microservices/calorie_client";
import {rejects} from "node:assert";

class DietDAO {

    /*
    *
    * Dao for retrive all the diets. It depends from the week and the day
    *
    * */

    async getDietOfADay(week: number, day: number, user: string): Promise<Plate[] | Error> {
        return new Promise<Plate[]>((resolve, reject) => {
            const sql = `
            SELECT *
            FROM plate P
                     LEFT JOIN plate_diet PD ON P.id_plate = PD.id_plate
                     LEFT JOIN diet D ON PD.id_diet = D.id_diet
            WHERE week = $1 AND day = $2 AND ref_user = $3;
        `;

            db.query(sql, [week, day, user], (err: Error | null, result: any) => {
                if (err) {
                    reject(err); // Errore durante l'esecuzione della query
                    return;
                }

                if (!result.rows || result.rows.length === 0) {
                    reject(new PlateNotFoundError()); // Nessun piatto trovato
                    return;
                }
                getCalories({name:1})
                // Mappa i risultati in oggetti Plate
                const plates = result.rows.map(
                    (row: any) => new Plate(row.id_plate, row.name_plate, row.meal_type) // Mappa i dati del DB su Plate
                );

                resolve(plates); // Risolvi con l'array di piatti
            });
        });
    }

    async insertPlate(plates: { name: string; type: string; preparation: string,category:string }[]): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const sql = `INSERT INTO plate (name_plate, meal_type, preparation,category) VALUES ($1, $2, $3,$4);`;
            for (const plate of plates) {
                db.query(sql, [plate.name, plate.type, plate.preparation,plate.category],(err: Error | null) => {
                    if (err) {
                        console.error(err);
                        reject(false)
                    }
                    resolve(true);
                });

            }
        })
    }

    async insertDiet(current: boolean, plates: { idPlate: number, week: number, day: number }[]): Promise<number> {

        try {
            await db.query('BEGIN');

            const resDiet = await db.query(
                'INSERT INTO diet (current) VALUES ($1) RETURNING id_diet',
                [current]
            );
            const dietId = resDiet.rows[0].id_diet; // Ottieni l'ID della dieta appena inserita

            for (const plate of plates) {
                await db.query(
                    'INSERT INTO plate_diet (id_diet, id_plate, week, day) VALUES ($1, $2, $3, $4)',
                    [dietId, plate.idPlate, plate.week, plate.day]
                );
            }

            await db.query('COMMIT');

            return dietId;

        } catch (error) {
            await db.query('ROLLBACK');
            console.error('Errore durante l\'inserimento nella dieta:', error);
            throw new Error('Errore durante l\'inserimento nella dieta');
        }
    }



}

export {DietDAO}