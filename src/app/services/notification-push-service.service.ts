import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationPushServiceService {

  constructor(public platform:Platform, private router:Router) {

  }

  inicializar(id_user){
    
    console.log('Initializing HomePage');

    if (this.platform.is('capacitor')){
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
          if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
          } else {
            // Show some error
          }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        async (token: Token) => {
          //alert('Push registration success, token: ' + token.value);
          let formData = new FormData;
          formData.append('url','contenido');
          formData.append('params','REGISTER-TOKEN');
          formData.append('data',JSON.stringify({id_users:id_user, id_firebase:token.value}));
          try {
            const response = await fetch("https://rafaelbastidas.com/apis/api-historieta/app.php", {
              headers: {'KEY_HIST': 'Z9AQBQXUWDHRN5GYE3DUG52BTSFT1NMA', 'Access-Control-Allow-Origin' : '*'},
              method: 'POST',
              body: formData
            });
            const res_data = await response.json();
            console.log("Response of backend", res_data);
            return res_data;
          } catch (error) {
            console.log("Error de conexion", error);
            return {response: null};
          }
        }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          //alert('Error on registration: ' + JSON.stringify(error));
        }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          //alert('Push received: ' + JSON.stringify(notification));
          this.router.navigate(['/pre-view-comics'], {queryParams: {id_serie: notification.data.id_serie}})
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          //alert('Push action performed: ' + JSON.stringify(notification));
        }
      );
    } else { console.log("no es un movil") }

  }
}
