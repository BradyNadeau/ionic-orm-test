import {Photo} from "../database/tables/Photo";
import { createConnection } from 'ionic-orm/dist'

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {


      createConnection({
        driver: {
          type: "websql",
          database: "test"
        },
        entities: [
          Photo
        ],
        logging: {
          logFailedQueryError: true,
          logQueries: true,
          logSchemaCreation: true,
          logOnlyFailedQueries: true
        },
        autoSchemaSync: true,
      }).then(async connection => {
        console.log(connection);
        let photo = new Photo();
        photo.name = "Brady";
        photo.description = "I am near polar bears";
        photo.fileName = "photo-with-bears.jpg";
        photo.views = 1;
        photo.isPublished = true;

        let photoRepository = connection.getRepository(Photo);

        // await photoRepository.persist(photo);
        console.log("Photo has been saved");

        let allPublishedPhotos = await photoRepository.find({ isPublished: true });
        console.log("All published photos: ", allPublishedPhotos);

        let foo = await photoRepository.createQueryBuilder("photo")
        .where("photo.id > :myVar", { myVar: 10 })
        .setLimit(5)
        .getResults();

        console.log("Foo!", foo);
        let allPhotosNamedBrady = await photoRepository.find( { name: "Brady" } );
        console.log("All photos named brady: ", allPhotosNamedBrady);


        // here you can start to work with your entities
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
