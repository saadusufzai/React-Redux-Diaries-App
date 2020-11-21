import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";

export const handelError = (error: any, massage = "An error has occoured") => {
  return new Response(400, undefined, {
    data: {
      massage,
      isError: true,
    },
  });
};

export const setupServer = (env?: string): Server => {
  return new Server({
    environment: env ?? "development",
    models: {
      entry: Model.extend({
        diary: belongsTo(),
      }),
      diary: Model.extend({
        entry: hasMany(),
        user: belongsTo(),
      }),
      user: Model.extend({
        diary: hasMany(),
      }),
    },

    factories: {
      user: Factory.extend({
        username: "test",
        password: "password",
        email: "test@example.com",
      }),
    },
    seeds: (server): any=>{
        server.create('user');
    },
    routes():void{
        this.urlPrefix = 'https://mydiaries.app'
    }
  });
};
