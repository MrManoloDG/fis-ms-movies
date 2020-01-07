# Microservicio Gestor de Películas.

[![Build Status](https://travis-ci.org/MrManoloDG/fis-ms-movies.svg?branch=master)](https://travis-ci.org/MrManoloDG/fis-ms-movies)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mrmanolo%3Afis-ms-movies&metric=alert_status)](https://sonarcloud.io/dashboard?id=mrmanolo%3Afis-ms-movies)

Este microservicio se ha realizado como parte del proyecto de la asignatura de fundamentos de ingeniería del software del Master en Cloud, Datos y TIC de la Universidad de Sevilla.

## Descripción

El objetivo de este microservicio es gestionar la información referente a la interacción de los usuario con las peliculas extraidas de la API de TMDB. Esta interacción consiste en la selección de un estado de una pelicula para un usuario concreto. Dicho usuario podrá marcar las peliculas como pendientes o vistas.

## Nota a la que se presenta el proyecto.

El proyecto aspira a la nota de 9. Los logros conseguidos en el mismo se exponen a continuación.

### Objetivos básicos del proyecto

Los objetivos basicos que se han conseguido son:

* La Api escrita en *expressjs* soporta las cuatro operaciones del CRUD.
* Se ha creado un Front-End para el consumo de esta API.
* Se ha integrado el microservicio con su propia base de datos *MongoDB*.
* Se han realizado pruebas de integración para la comprobación de las conexiones con *MongoDB* y *TMDB API*.
* En el apartado de *pull requests*, pueden verse las multiples *pull request* realizadas cada vez que se ha querido añadir funcionalidad, siguiendo el proceso *git flow*.
* [Postman]()
* Imagen *docker* en el *Dockerfile* en la carpeta main.
* Las pruebas unitarias han sido aquellas realizadas con mocks, debido a la especificación de la API.
* El despliegue, como se muestra en el fichero *TravisCI*, es automatico gracias al uso de *Heroku*. Como prueba, pueden comprobarse los multiples *builds* a lo largo de los *pull requests* hechos a la rama *master*.

### Pruebas unitarias con *mocks*.

Se han realizado pruebas con mocks para comprobar el correcto funcionamiento de la API. Para ello se han utilizado mocks siguiendo la práctica de *Jest* del curso.

### Implementación de un *Circuit Breaker*, para la comunicación con TMDB Api.

Para la comunicación con la api de TMDB, se ha decidido implementar un circuit breaker utilizando la librería "hystrixjs". Aqui la factoría para los objetos observables.

Esta parte correspondería a la creación de la factoría para crear los hilos que llamarán al servicio de TMDB:

```javascript
var CommandsFactory = require('hystrixjs').commandFactory;
var serviceCommand = CommandsFactory.getOrCreate("TMDB")
    .run(request)
    .build();
```

Y esta sería la llamada a la ejecución:

```javascript
static getRequest(url, options = {}){
        var promise = serviceCommand.execute(url, options);
        return promise;
    }
```

### Implementación de la autenticación en el microservicio.

La autenticación en el microservicio consta de dos capas. La primera capa de autenticación ocurre en la *API Getaway*, donde se revisa el *token* del usuario de la petición. Si este es correcto, se redirige la llamada a el microservicio, el cual vuelve a comprobar la autenticidad del *token*. Esto se hace para todas las llamadas entrantes en la *API* de movies.

En server.js

```javascript
app.use(BASE_API_PATH +'/movies_status',AuthService.isAuth,movieStatus);
```

Este llama al fichero *./routes/auth* que se encarga de volver a comprobar la autenticación.

### *API Getaway*

La *api getaway* para el proyecto.

[*API getaway*](https://github.com/Xiirf/FIS-API-Gateway) - Repositorio de la *API Getaway*.

### *Swagger*

### Front-End común



