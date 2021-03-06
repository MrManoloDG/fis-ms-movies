# Microservicio Gestor de Películas.

[![Build Status](https://travis-ci.org/MrManoloDG/fis-ms-movies.svg?branch=master)](https://travis-ci.org/MrManoloDG/fis-ms-movies)

Este microservicio se ha realizado como parte del proyecto de la asignatura de fundamentos de ingeniería del software del Master en Cloud, Datos y TIC de la Universidad de Sevilla.

## Descripción

El objetivo de este microservicio es gestionar la información referente a la interacción de los usuario con las peliculas extraidas de la API de TMDB. Esta interacción consiste en la selección de un estado de una pelicula para un usuario concreto. Dicho usuario podrá marcar las peliculas como pendientes o vistas.

## Aplicación desplegada

[https://fis-ms-movies.herokuapp.com/](https://fis-ms-movies.herokuapp.com/)

## Nota a la que se presenta el proyecto.

El proyecto aspira a la nota de 9. Los logros conseguidos en el mismo se exponen a continuación.

### Objetivos básicos del proyecto

Los objetivos basicos que se han conseguido son:

* La Api escrita en *ExpressJS* soporta las cuatro operaciones del CRUD.
* Se ha creado un Front-End para el consumo de esta API.
* Se ha integrado el microservicio con su propia base de datos *MongoDB*. Para almacenar los datos se ha utilizado el modelo movie, expuesto en la carpeta models.
* Se han realizado pruebas de integración para la comprobación de las conexiones con *MongoDB* y *TMDB API*.
* En el apartado de *pull requests*, pueden verse las multiples *pull request* realizadas cada vez que se ha querido añadir funcionalidad, siguiendo el proceso *git flow*.
* Colecciones de llamadas *HTTP* para probar las *API*. Estas han sido añadidas a la carpeta Postman.
* Imagen *docker* en el *Dockerfile* en la carpeta main.
* Las pruebas unitarias han sido aquellas realizadas con mocks, debido a la especificación de la API.
* El despliegue, como se muestra en el fichero *TravisCI*, es automatico gracias al uso de *Heroku*. Como prueba, pueden comprobarse los multiples *builds* a lo largo de los *pull requests* hechos a la rama *master*.

### Pruebas unitarias con *mocks*.

Se han realizado pruebas con mocks para comprobar el correcto funcionamiento de la API. Para ello se han utilizado mocks siguiendo la práctica de *Jest* del curso. Archivo: [Tests de mocks](tests/server.test.js)

Estas pruebas se han hecho frente a la parte movie, dejando de lado la api usada para conectar con la api de TMDB.

Ejemplo de mock:

```javascript
{"_id": "1", "id_user": "Juanito", "id_movie": "abc2", "status": "Completed", "status_date": new Date()}
```

Uso de sypOn y mockImplementation:

```javascript
dbFind = jest.spyOn(movie, "find");
dbFind.mockImplementation((query, callback) => {
   callback(null, mockMovies.filter((movie) => compare(query, movie)));
});

dbPost = jest.spyOn(movie, "create");
dbPost.mockImplementationOnce((query, callback) => {
   callback(false);
}).mockImplementation((query, callback) => {
   callback(true);
});
```

Ejemplo de test (Post):

```javascript
test("POST / correctly defined", () => {
   return supertest(api).post(movie_api_path + "/")
      .set('authorization', token)
      .send(
          {id_user: 'Send', id_movie: "Send2", status: "Stopped"}
      ).then((response) => {
          expect(response.statusCode).toBe(201);
   });
});
```

Siguiendo con estas herramientas, hemos realizado tests unitarios para todas las operaciones recogidas en la API.

### Implementación de un *Circuit Breaker*, para la comunicación con TMDB Api.

Para la comunicación con la api de TMDB, se ha decidido implementar un circuit breaker utilizando la librería "hystrixjs". Aqui la factoría para los objetos observables. Archivo: [Clase TMDB](models/TMDB_Class.js)

Esta parte correspondería a la creación de la factoría para crear los hilos que llamarán al servicio de TMDB:

```javascript
var CommandsFactory = require('hystrixjs').commandFactory;
var serviceCommand = CommandsFactory.getOrCreate("TMDB")
    .run(request)
    .build();
```

Y esta sería la llamada a la ejecución:

```javascript
function hystrix(url, options){
    var promise = serviceCommand.execute(url, options);
    return promise; 
}
```

### Implementación de la cache para la api de TMDB

Hemos usado la librería node *node-cache* para la implementación de un sistema de cache para las consultas de TMDB. Esta ademas se ha combinado con la implementación del *circuit breaker*.

Aquí las funciones que se encargan de consultar y actualizar la cache. Archivo: [Clase TMDB](models/TMDB_Class.js)

```javascript
function cacheUpdate(url, options) {
    return hystrix(url, options).then((body) => {
        console.log("Actualizando cache");
        tmdb_cache.set(url, body);
        return body;
    });
}

function requestTMDB(url, options){
    return new Promise(function (resolve){
        var cached_response = tmdb_cache.get(url);
        console.log("Entrando a cache");
        resolve (cached_response != undefined ? cached_response : cacheUpdate(url, options))
    });
}
```

### Implementación de la autenticación en el microservicio.

La autenticación en el microservicio consta de dos capas. La primera capa de autenticación ocurre en la *API Getaway*, donde se revisa el *token* del usuario de la petición. Si este es correcto, se redirige la llamada a el microservicio, el cual vuelve a comprobar la autenticidad del *token*. Esto se hace para todas las llamadas entrantes en la *API* de movies.

En server.js

```javascript
app.use(BASE_API_PATH +'/movies_status',AuthService.isAuth,movieStatus);
```

Este llama al fichero [*./routes/auth*](routes/auth.js) que se encarga de volver a comprobar la autenticación.

### *API Getaway*

La *api getaway* para el proyecto.

[*API getaway*](https://github.com/Xiirf/FIS-API-Gateway) - Repositorio de la *API Getaway*.

### *Swagger*

[Swagger API](https://app.swaggerhub.com/apis-docs/MrManoloDG/fis-movieStatus/1.0.0) - Api de movies escrita en *Swagger*.

### Front-End común

En el Front-End común se ha desarrollado los componentes respectivos al buscador, lista de películas, componente de paginación para esta lista, y vista en detalle de cada película. Cada componente tiene su fichero de tests, con el que se prueba que el componente se renderiza con sus características. 

En la vista detallada de la película se hace uso de un selector para cambiar el estado y enviarlo a la API, cuando se selecciona “No visto” se borra ese estado de la base de datos para ahorrar memoria. Ya que por defecto cuando no se encuentra el estado en la base de datos, este es “No visto”.

Estos componentes se alimentan de la ruta puesta en el navegador para sacar de ahí los parámetros para el buscador, y el id de la película a mostrar en su vista de detalle. 

[Front-End](https://github.com/Xiirf/FIS-Frontend) - Front-End común de todo el grupo.

