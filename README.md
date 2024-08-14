# Weather-App
 Aplicación Angular para consultar el tiempo

 # Instalación
 Para usar la app, hay que seguir varios pasos:

 1. Clonar el repositorio y ejecutar el comando `npm install` dentro del directorio.
 2. Crearse una cuenta en la web de [weatherbit](https://www.weatherbit.io/), y conseguir la API key de tu cuenta.
 3. Copiar la API key dentro del archivo `src/app/environments/environment.dev.ts` en el campo `apiKeyWeather`.
 4. Registrarse en la página [rapidapi](https://rapidapi.com/), buscar por la api `GeoDb Cities` y conseguir la API key de la API.
 5. Pegar la API key en `src/app/environments/environment.dev.ts` en el campo `apiKeyCities`.
 6. Ejecutar `ng serve`.
