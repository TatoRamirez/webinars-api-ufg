const Users = require("../models/Usuario");
const Webinar = require("../models/Webinar");
const WebinarRegistry = require("../models/RegistroWebinar");
const asesoriasacademicas = require("../models/RegistroAsesoria");
const registrosorientaciones = require("../models/RegostroOrientacion");
const CatalogoCarreras = require("../models/CatalogoCarreras");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config({ path: ".env" });

const crearToken = (usuario, secreto, expiresIn) => {
  const { id, personalemail, name, lastname, token, interested } = usuario;

  return jwt.sign(
    { id, personalemail, name, lastname, token, interested },
    secreto,
    {
      expiresIn,
    }
  );
};

//Resolver
const resolvers = {
  Query: {
    /*------------------Query de Usuarios------------------*/

    getUser: async (_, { id }, ctx) => {
      if (ctx.usuario) {
        try {
          const users = await Users.findById(id);
          return users;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return "404";
      }
    },

    /**
     * get all Usuarios
     * @param {*} _
     * @param {*} empty
     * @param {*} context
     */

    /*------------------Query de Webinars------------------*/

    getWebinar: async (_, { id }, ctx) => {
      if (ctx.usuario) {
        try {
          const webinar = await Webinar.findById(id);
          return webinar;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return "404";
      }
    },

    /**
     * get all Webinars
     * @param {*} _
     * @param {*} empty
     * @param {*} context
     */

    allWebinars: async (_, {}, ctx) => {
      if (ctx.usuario) {
        try {
          const webinar = await Webinar.find({
            eventdate: { $gt: Date.now(), $lt: 4078151001000 },
          });
          return webinar;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return [];
      }
    },

    /*------------------Query de RegistrosWebinars------------------*/

    /* getWebinarRegistry: async (_, { id }, ctx) => {
      if (ctx.usuario) {
        try {
          const webinarRegistry = await WebinarRegistry.findById(id);
          return webinarRegistry;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return "404";
      }
    }, */

    /**
     * get all WebinarRegistry
     * @param {*} _
     * @param {*} empty
     * @param {*} context
     */

    /* allWebinarsRegistry: async (_, { }, ctx) => {
      if (ctx.usuario) {
        try {
          const webinarRegistry = await WebinarRegistry.find({});
          return webinarRegistry;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return [];
      }
    }, */

    allUserWebinarsRegistry: async (_, {}, ctx) => {
      if (ctx.usuario) {
        try {
          const webinarRegistry = await WebinarRegistry.find({
            personalemail: ctx.usuario.personalemail,
          });
          return webinarRegistry;
        } catch (error) {
          console.log("Error: ", error);
        }
      } else {
        return [];
      }
    },

    /**
     * get allCarreras
     * @param {*} _
     * @param {*} empty
     * @param {*} context
     */

    allCarreras: async (_, {}, ctx) => {
      try {
        const carreras = await CatalogoCarreras.find({});
        return carreras;
      } catch (error) {
        console.log("Error: ", error);
      }
    },
  },

  Mutation: {
    /*------------------Mutation de Usuarios------------------*/

    newUser: async (_, { input }, ctx) => {
      const { personalemail } = input;
      let BuscarUsuario = await Users.findOne({ personalemail: personalemail });
      if (BuscarUsuario) {
        throw new Error("El correo ya existe");
      }
      try {
        //Crea el token de usuario y se lo inserta al usuario
        let first = Math.random().toString(36).substr(2);
        let token = first.substr(0, 8).toUpperCase();
        input.token = token;

        //Crea contraseña para usuario registrado interno
        let second = Math.random().toString(36).substr(2);
        let pass = second.substr(0, 7);

        //valida si el usuario es registrado internamente
        if (input.tokenparent) {
          input.password = pass;
        }

        //Valida si el usuario se registra él mismo y encripta la contraseña
        if (input.password !== "") {
          //Encriptar contraseña
          const salt = await bcryptjs.genSalt(10);
          input.password = await bcryptjs.hash(input.password, salt);
        }

        //Guardar en la base de datos
        const { personalemail } = input;
        const { name } = input;
        const { lastname } = input;
        const users = new Users(input);
        users.save();

        //Valida diferentes tipos de registro
        if (input.tokenparent !== undefined) {
          const emailr = await correo({
            infot: "registrourlinterno",
            emailt: personalemail,
            subject: "UFG Bienvenido",
            token: token,
            carrera: pass,
            nombre: `${name} ${lastname}`,
            url: process.env.URL_REDIRECT,
          });
        } else {
          if (input.password === "") {
            const emailr = await correo({
              infot: "registrourltoken",
              emailt: personalemail,
              subject: "UFG Bienvenido",
              token: token,
              carrera: "",
              nombre: `${name} ${lastname}`,
              url: process.env.URL_REDIRECT_TOKEN,
            });
          } else {
            const emailr = await correo({
              infot: "registrourl",
              emailt: personalemail,
              subject: "UFG Bienvenido",
              token: token,
              carrera: "",
              nombre: `${name} ${lastname}`,
              url: process.env.URL_REDIRECT,
            });
          }
        }
        return users;
      } catch (error) {
        console.log("Error: ", error);
      }
    },

    updateUser: async (_, { id, input }, ctx) => {
      if (ctx.usuario) {
        //Revsar si existe
        let users = await Users.findById(id);

        if (!users) {
          throw new Error("Usuario no existe");
        }

        //Encriptar contraseña
        const { password } = input;
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        input.modifieddate = Date.now();

        //Guardarlo en la base de datos
        users = await Users.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return users;
      }
    },

    /**
     * Auth Usuario
     * @param {*} _
     * @param {*} input
     */

    authUser: async (_, { input }) => {
      const { personalemail, password } = input;

      //Si usuario existe
      const existeUsuario = await Users.findOne({ personalemail });

      if (!existeUsuario) {
        throw new Error("El correo NO existe");
      }

      //Revisar si existe el password
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );

      if (!passwordCorrecto) {
        throw new Error("La contraseña es incorrecta");
      }

      //Crear Token
      return {
        token: crearToken(existeUsuario, process.env.SECRET, "24h"),
      };
    },

    authUserToken: async (_, { input }) => {
      const { token } = input;

      //Si usuario existe
      const existeToken = await Users.findOne({
        token: token,
        interested: "false",
      });

      if (!existeToken) {
        throw new Error("El usuario NO existe");
      }

      //Crear Token
      return {
        token: crearToken(existeToken, process.env.SECRET, "24h"),
      };
    },

    /*------------------Mutation de Webinars------------------*/

    newWebinar: async (_, { input }, ctx) => {
      if (ctx.usuario) {
        //Guardar en la base de datos
        try {
          const webinar = new Webinar(input);
          webinar.save();

          return webinar;
        } catch (error) {
          console.log("Error: ", error);
        }
      }
    },

    updateWebinar: async (_, { id, input }, ctx) => {
      if (ctx.usuario) {
        //Revsar si existe
        let webinar = await Webinar.findById(id);

        if (!webinar) {
          throw new Error("Webinar no existe");
        }

        //Guardarlo en la base de datos
        webinar = await Webinar.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return webinar;
      }
    },

    deleteWebinar: async (_, { id }, ctx) => {
      if (ctx.usuario) {
        //Revsar si existe
        let webinar = await Webinar.findById(id);

        if (!webinar) {
          throw new Error("Webinar no existe");
        }

        await Webinar.findOneAndDelete({ _id: id });

        return "Webinar Elimiando";
      }
    },

    /*------------------Mutation de RegistrosWebinar------------------*/

    newWebinarRegistry: async (_, { input }, ctx) => {
      if (ctx.usuario) {
        //Verificar si se a registrado a un webinar
        const buscar = await WebinarRegistry.find({
          personalemail: ctx.usuario.personalemail,
        });
        if (buscar.length === 0) {
          try {
            const {
              token,
              codeWebinar,
              name,
              lastname,
              personalemail,
              title,
              description,
              information,
              eventdate,
              url,
            } = input;
            const insertwebinar = {
              token: token,
              name: name,
              lastname: lastname,
              personalemail: personalemail,
              Webinars: {
                codeWebinar: codeWebinar,
                title: title,
                description: description,
                information: information,
                eventdate: eventdate,
                url: url,
              },
            };
            const webinarRegistry = new WebinarRegistry(insertwebinar);
            webinarRegistry.save();
          } catch (error) {
            console.log("error:", error);
          }
          return "Webinar registrado con exito";
        } else {
          const {
            token,
            codeWebinar,
            title,
            description,
            information,
            eventdate,
            url,
          } = input;

          insertWebinar = {
            codeWebinar: codeWebinar,
            title: title,
            description: description,
            information: information,
            eventdate: eventdate,
            url: url,
          };

          const buscarWebinar = await WebinarRegistry.find({
            personalemail: ctx.usuario.personalemail,
            "Webinars.codeWebinar": codeWebinar,
          });
          if (buscarWebinar.length === 0) {
            webinarRegistry = await WebinarRegistry.updateOne(
              { token: token },
              { $push: { Webinars: insertWebinar } }
            );
            return "Webinar registrado con exito";
          } else {
            throw new Error("Ya estás registrado a este webinar");
          }
        }
      }
    },

    newAsesoriaRegistry: async (_, { input }, ctx) => {
      if (ctx.usuario) {
        //Verificar si se a registrado a un webinar
        const buscar = await asesoriasacademicas.find({
          personalemail: ctx.usuario.personalemail,
        });
        if (buscar.length === 0) {
          const {
            codigo,
            token,
            title,
            name,
            lastname,
            description,
            information,
            eventdate,
            url,
          } = input;

          insertAsesoria = {
            token: token,
            name: name,
            lastname: lastname,
            personalemail: ctx.usuario.personalemail,
            Asesorias: {
              codigo: codigo,
              title: title,
              description: description,
              information: information,
              eventdate: eventdate,
              url: url,
            },
          };

          try {
            const asesoriaRegistry = new asesoriasacademicas(insertAsesoria);
            asesoriaRegistry.save();

            return "Asesoria Academica registrada con exito";
          } catch (error) {
            return "Hubo un problema";
          }
        } else {
          throw new Error("Ya estás registrado para asesoria academica");
        }
      }
    },

    newOrientacionRegistry: async (_, { id, input }, ctx) => {
      if (ctx.usuario) {
        //Verificar si se a registrado a un webinar
        const buscar = await registrosorientaciones.find({
          personalemail: ctx.usuario.personalemail,
        });
        if (buscar.length === 0) {
          const {
            codigo,
            token,
            title,
            name,
            lastname,
            description,
            information,
            eventdate,
            url,
          } = input;

          insertOrientacion = {
            token: token,
            name: name,
            lastname: lastname,
            personalemail: ctx.usuario.personalemail,
            Orientaciones: {
              codigo: codigo,
              title: title,
              description: description,
              information: information,
              eventdate: eventdate,
              url: url,
            },
          };

          try {
            const orientacionRegistry = new registrosorientaciones(
              insertOrientacion
            );
            orientacionRegistry.save();

            return "Orientacion Academica registrada con exito";
          } catch (error) {
            return "Hubo un problema";
          }
        } else {
          throw new Error("Ya estas registrado");
        }
      }
    },

    updateWebinarRegistry: async (_, { id, input }, ctx) => {
      if (ctx.usuario) {
        //Revsar si existe
        let webinarRegistry = await WebinarRegistry.findById(id);

        if (!webinarRegistry) {
          throw new Error("Registro de Webinar no existe");
        }

        //Guardarlo en la base de datos
        webinarRegistry = await WebinarRegistry.findOneAndUpdate(
          { _id: id },
          input,
          {
            new: true,
          }
        );

        return webinarRegistry;
      }
    },

    deleteWebinarRegistry: async (_, { id }, ctx) => {
      if (ctx.usuario) {
        //Revsar si existe
        let webinarRegistry = await WebinarRegistry.findById(id);

        if (!webinarRegistry) {
          throw new Error("Registro de Webinar no existe");
        }

        await WebinarRegistry.findOneAndDelete({ _id: id });

        return "Registro de Webinar Elimiando";
      }
    },
  },
};
async function correo(requestEmail) {
  let envio = await axios({
    url: process.env.URL_CORREO + "/enviarcorreo",
    method: "post",
    data: JSON.stringify(requestEmail),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.data.accepted !== undefined) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return envio;
}
module.exports = resolvers;
