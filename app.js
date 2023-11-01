const express = require("express");
const app = express();
module.exports = app;
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initilizeDBAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3001, () => {
    console.log("Server is running at http://localhost/:3001/");
  });
};

initilizeDBAndServer();

// API 1

app.get("/movies/", async (request, response) => {
  const getMovieNameQuary = `
    SELECT 
        movie_name
    FROM 
        movie;
    `;
  const movieNames = await db.all(getMovieNameQuary);
  response.send(movieNames);
});

// API 2

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuary = `
    INSERT INTO 
    movie(director_id, movie_name, lead_actor)
    VALUES (
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );
    `;
  const dbResponse = await db.run(postMovieQuary);
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetailsQuary = `
    SELECT 
        *
    FROM
        movie
    Where 
        movie_id = ${movieId}  ;  

    `;
  const movieDetails = await db.get(movieDetailsQuary);
  response.send(movieDetails);
});

// API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuary = `
    UPDATE 
        movie
    SET
       director_id = ${directorId},
       movie_name =  '${movieName}',
       lead_actor =  '${leadActor}'
    WHERE 
        movie_id = ${movieId}
    `;
  const updatedMovieTable = await db.run(updateMovieQuary);
  response.send("Movie Details Updated");
});

// API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuary = `
    DELETE FROM 
        movie
    where 
         movie_id = ${movieId} ;
    `;
  const movieDeletedTable = await db.run(deleteMovieQuary);
  response.send("Movie Removed");
});

// API 6

app.get("/directors/", async (request, response) => {
  const getDirectorsQuary = `
    SELECT 
        *
    FROM 
        director;
    `;
  const directorDetails = await db.all(getDirectorsQuary);
  response.send(directorDetails);
});

// API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirMovQuary = `
    SELECT 
        movie_name
    FROM 
        movie
    WHERE
        director_id = ${directorId};

        `;
  const directorMovies = await db.all(getDirMovQuary);
  response.send(directorMovies);
});
