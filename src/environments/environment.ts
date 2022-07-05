// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL:'https://honeyappservice.azurewebsites.net/api',
  firebaseConfig: {
    apiKey: "AIzaSyDmZpkS0TQ7zVYHlkwQRIESFkSBarKbxys",  
    authDomain: "honeyapp-da6ed.firebaseapp.com",  
    projectId: "honeyapp-da6ed",  
    storageBucket: "honeyapp-da6ed.appspot.com",  
    messagingSenderId: "9369192103",  
    appId: "1:9369192103:web:c35d8a248769030d927d82",  
    measurementId: "G-FR8WLVEFT6"  
  } 
};

/*
 * apiURL: 'https://localhost:5001/api'
 * apiURL:'https://honeyappservice.azurewebsites.net/api',
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
