CREATE TABLE users (
                       username VARCHAR(50) PRIMARY KEY,        -- Nome utente univoco
                       name VARCHAR(100) NOT NULL,              -- Nome
                       surname VARCHAR(100) NOT NULL,           -- Cognome
                       age INT CHECK (age >= 0),                -- Età (deve essere positiva)
                       weight DECIMAL(5, 2) CHECK (weight > 0), -- Peso (numero decimale)
                       hash TEXT NOT NULL,                      -- Hash della password
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data di creazione
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data di aggiornamento
);

CREATE TABLE diet (
                      id_diet SERIAL PRIMARY KEY,         -- Identificatore univoco per la dieta
                      current BOOLEAN NOT NULL DEFAULT FALSE, -- Stato corrente della dieta (attiva o meno)
                      ref_user VARCHAR(50) NOT NULL,
                      FOREIGN KEY (ref_user) REFERENCES users(username) ON DELETE CASCADE -- Riferimento alla tabella plates
);

CREATE TABLE plate (
                       id_plate SERIAL PRIMARY KEY,        -- Identificatore univoco per il piatto
                       meal_type VARCHAR(50) NOT NULL,     -- Tipo di pasto (es. colazione, pranzo, cena)
                       preparation TEXT NOT NULL           -- Descrizione della preparazione
);

CREATE TABLE nutritional_value (
                                   id_nutritional_value SERIAL PRIMARY KEY,  -- Identificatore univoco per i valori nutrizionali
                                   id_plate INT NOT NULL,                    -- Riferimento al piatto
                                   nutrient_name VARCHAR(100) NOT NULL,      -- Nome del nutriente (es. proteine, carboidrati)
                                   amount DECIMAL(10, 2) NOT NULL,           -- Quantità del nutriente
                                   FOREIGN KEY (id_plate) REFERENCES plate(id_plate) ON DELETE CASCADE -- Riferimento alla tabella plates
);

CREATE TABLE plate_category (
                                id_plate INT NOT NULL,               -- Riferimento al piatto
                                category VARCHAR(100) NOT NULL,      -- Categoria del piatto (es. vegano, gluten-free)
                                PRIMARY KEY (id_plate, category),    -- Unicità combinata di piatto e categoria
                                FOREIGN KEY (id_plate) REFERENCES plate(id_plate) ON DELETE CASCADE -- Relazione con plate
);

CREATE TABLE plate_diet (
                            id_diet INT NOT NULL,               -- Riferimento alla dieta
                            id_plate INT NOT NULL,              -- Riferimento al piatto
                            day INT NOT NULL CHECK (day BETWEEN 1 AND 7),  -- Giorno (1-7)
    week INT NOT NULL CHECK (week > 0),  -- Settimana
    PRIMARY KEY (id_diet, id_plate, day, week), -- Combinazione unica di dieta, piatto, giorno e settimana
    FOREIGN KEY (id_diet) REFERENCES diet(id_diet) ON DELETE CASCADE,  -- Relazione con diet
    FOREIGN KEY (id_plate) REFERENCES plate(id_plate) ON DELETE CASCADE -- Relazione con plate
);

CREATE TABLE ingredient (
                            id_ingredient SERIAL PRIMARY KEY,      -- Identificatore univoco per l'ingrediente
                            name VARCHAR(100) NOT NULL,            -- Nome dell'ingrediente
                            calories DECIMAL(10, 2) NOT NULL,      -- Calorie dell'ingrediente
                            ref_nutritional_value INT,             -- Riferimento ai valori nutrizionali
                            FOREIGN KEY (ref_nutritional_value) REFERENCES nutritional_value(id_nutritional_value) ON DELETE SET NULL -- Relazione con nutritional_values
);


