# Microservicio Gestor de Películas.

[![Build Status](https://travis-ci.org/MrManoloDG/fis-ms-movies.svg?branch=master)](https://travis-ci.org/MrManoloDG/fis-ms-movies)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrmanolo%3Afis-ms-movies&metric=alert_status)](https://sonarcloud.io/dashboard?id=mrmanolo%3Afis-ms-movies)

Este microservicio se ha realizado como parte del proyecto de la asignatura de fundamentos de ingeniería del software del Master en Cloud, Datos y TIC de la Universidad de Sevilla.

## Descripción

El objetivo de este microservicio es gestionar la información referente a la interacción de los usuario con las peliculas extraidas de la API de TMDB. Esta interacción consiste en la selección de un estado de una pelicula para un usuario concreto. Dicho usuario podrá marcar las peliculas como pendientes o vistas.

## Nota a la que se presenta el proyecto.

El proyecto pretende presentarse para la nota de 9. Los logros conseguidos en el mismo se exponen a continuación.

### Implementación de un Circuit Breaker, para la comunicación con TMDB Api.

Para la comunicación con la api de TMDB, se ha decidido implementar un circuit breaker utilizando la librería "hystrixjs". Aqui la factoría para los objetos observables.

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

