ALTER SEQUENCE diet_id_diet_seq RESTART WITH 1;
ALTER SEQUENCE ingredient_id_ingredient_seq RESTART WITH 1;
ALTER SEQUENCE nutritional_value_id_nutritional_value_seq RESTART WITH 1;
ALTER SEQUENCE plate_id_plate_seq RESTART WITH 1;
ALTER SEQUENCE plate_ingredient_ref_ingredient_seq RESTART WITH 1;
ALTER SEQUENCE plate_ingredient_ref_plate_seq RESTART WITH 1;

CREATE TABLE users
(
    username   VARCHAR(50) PRIMARY KEY,             -- Nome utente univoco
    name       VARCHAR(100) NOT NULL,               -- Nome
    role       VARCHAR(100) NOT NULL,
    surname    VARCHAR(100) NOT NULL,
    mail       VARCHAR(100) NOT NULL,               -- Cognome
    age        INT CHECK (age >= 0),                -- Età (deve essere positiva)
    weight     DECIMAL(5, 2) CHECK (weight > 0),    -- Peso (numero decimale)
    salt       TEXT         NOT NULL,               -- Hash della password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data di creazione
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Data di aggiornamento
);

CREATE TABLE diet
(
    id_diet  SERIAL PRIMARY KEY,                                         -- Identificatore univoco per la dieta
    current  BOOLEAN     NOT NULL DEFAULT FALSE,                         -- Stato corrente della dieta (attiva o meno)
    ref_user VARCHAR(50) NOT NULL,
    FOREIGN KEY (ref_user) REFERENCES users (username) ON DELETE CASCADE -- Riferimento alla tabella plates
);

CREATE TABLE plate
(
    id_plate    SERIAL PRIMARY KEY,    -- Identificatore univoco per il piatto
    name_plate  VARCHAR(100) NOT NULL,
    meal_type   VARCHAR(50)  NOT NULL, -- Tipo di pasto (es. colazione, pranzo, cena)
    preparation TEXT         NOT NULL  -- Descrizione della preparazione
);

CREATE TABLE nutritional_value
(
    id_nutritional_value SERIAL PRIMARY KEY,                             -- Identificatore univoco per i valori nutrizionali
    id_plate             INT            NOT NULL,                        -- Riferimento al piatto
    nutrient_name        VARCHAR(100)   NOT NULL,                        -- Nome del nutriente (es. proteine, carboidrati)
    amount               DECIMAL(10, 2) NOT NULL,                        -- Quantità del nutriente
    FOREIGN KEY (id_plate) REFERENCES plate (id_plate) ON DELETE CASCADE -- Riferimento alla tabella plates
);

CREATE TABLE plate_category
(
    id_plate INT          NOT NULL,                                      -- Riferimento al piatto
    category VARCHAR(100) NOT NULL,                                      -- Categoria del piatto (es. vegano, gluten-free)
    PRIMARY KEY (id_plate, category),                                    -- Unicità combinata di piatto e categoria
    FOREIGN KEY (id_plate) REFERENCES plate (id_plate) ON DELETE CASCADE -- Relazione con plate
);

CREATE TABLE plate_diet
(
    id_diet  INT NOT NULL, -- Riferimento alla dieta
    id_plate INT NOT NULL, -- Riferimento al piatto
    day      INT NOT NULL CHECK (day BETWEEN 1 AND 7
) ,  -- Giorno (1-7)
    week INT NOT NULL CHECK (week > 0),  -- Settimana
    PRIMARY KEY (id_diet, id_plate, day, week), -- Combinazione unica di dieta, piatto, giorno e settimana
    FOREIGN KEY (id_diet) REFERENCES diet(id_diet) ON DELETE CASCADE,  -- Relazione con diet
    FOREIGN KEY (id_plate) REFERENCES plate(id_plate) ON DELETE CASCADE -- Relazione con plate
);

CREATE TABLE ingredient
(
    id_ingredient         SERIAL PRIMARY KEY,                                                                  -- Identificatore univoco per l'ingrediente
    name                  VARCHAR(100)   NOT NULL,                                                             -- Nome dell'ingrediente
    calories              DECIMAL(10, 2) NOT NULL,                                                             -- Calorie dell'ingrediente
    ref_nutritional_value INT,                                                                                 -- Riferimento ai valori nutrizionali
    FOREIGN KEY (ref_nutritional_value) REFERENCES nutritional_value (id_nutritional_value) ON DELETE SET NULL -- Relazione con nutritional_values
);

CREATE TABLE plate_ingredient
(
    ref_ingredient SERIAL,                                                                 -- Identificatore per l'ingrediente
    ref_plate      SERIAL,                                                                 -- Identificatore per il piatto
    quantity       INTEGER,                                                                -- Quantità dell'ingrediente
    amount         DECIMAL(10, 2) NOT NULL,                                                -- Quantità dell'ingrediente (es. peso o porzione)
    PRIMARY KEY (ref_ingredient, ref_plate),                                               -- Chiave primaria composta
    FOREIGN KEY (ref_ingredient) REFERENCES ingredient (id_ingredient) ON DELETE SET NULL, -- Relazione con la tabella ingredient
    FOREIGN KEY (ref_plate) REFERENCES plate (id_plate) ON DELETE SET NULL                 -- Relazione con la tabella plate
);


-- Inserimento Dati
INSERT INTO users (username, name, role, surname, mail, age, weight, salt)
VALUES ('john_doe', 'John', 'admin', 'Doe', 'john.doe@example.com', 30, 70.50, 'randomsalt1'),
       ('jane_doe', 'Jane', 'user', 'Doe', 'jane.doe@example.com', 25, 60.30, 'randomsalt2');

INSERT INTO diet (current, ref_user)
VALUES (TRUE, 'john_doe'),
       (FALSE, 'jane_doe');

INSERT INTO plate (name_plate,meal_type, preparation)
VALUES ('plate1', 'Breakfast', 'Oatmeal with fruits and nuts'),
       ('plate1','Lunch', 'Grilled chicken with vegetables'),
       ('plate1','Dinner', 'Salmon with rice and broccoli');

INSERT INTO nutritional_value (id_plate, nutrient_name, amount)
VALUES (1, 'Protein', 10.50),
       (1, 'Carbohydrates', 30.00),
       (2, 'Protein', 25.00),
       (3, 'Protein', 22.00),
       (3, 'Fat', 15.00);

INSERT INTO plate_category (id_plate, category)
VALUES (1, 'Vegetarian'),
       (2, 'High Protein'),
       (3, 'Gluten-Free');

INSERT INTO plate_diet (id_diet, id_plate, day, week)
VALUES (1, 1, 1, 1),
       (1, 2, 2, 1),
       (1, 3, 3, 1),
       (2, 1, 1, 2);

INSERT INTO ingredient (name, calories, ref_nutritional_value)
VALUES ('Oats', 389, 1),
       ('Chicken', 165, 2),
       ('Salmon', 208, 3),
       ('Rice', 130, 3);

INSERT INTO plate_ingredient (ref_ingredient, ref_plate, quantity, amount)
VALUES (1, 1, 1, 100.00),
       (2, 2, 1, 150.00),
       (3, 3, 1, 200.00),
       (4, 3, 1, 100.00);