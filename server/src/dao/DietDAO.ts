import {Plate} from "../components/Meal";
import db from "../db/db";
import {PlateNotFoundError} from "../errors/dietError";

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

                // Mappa i risultati in oggetti Plate
                const plates = result.rows.map(
                    (row: any) => new Plate(row.id_plate, row.name_plate, row.meal_type) // Mappa i dati del DB su Plate
                );

                resolve(plates); // Risolvi con l'array di piatti
            });
        });
    }

}

export {DietDAO}