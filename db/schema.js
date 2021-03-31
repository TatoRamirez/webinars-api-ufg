const { gql, makeExecutableSchema } = require("apollo-server");

//Schema
const typeDefs = gql`
  #typeDef Usuarios
  type User {
    id: ID
    token: String
    tokenparent: String
    name: String
    lastname: String
    birthdate: String
    nationality: String
    institutionorigin: String
    academiclevel: String
    phone: String
    personalemail: String
    universitycareerinterest: String
    password: String
    createdate: String
    modifieddate: String
    active: Int
    terms: Boolean
    interested: Boolean
  }

  input UserInput {
    token: String
    tokenparent: String
    name: String
    lastname: String
    birthdate: String
    nationality: String
    institutionorigin: String
    academiclevel: String
    phone: String
    personalemail: String
    universitycareerinterest: String
    password: String
    createdate: String
    modifieddate: String
    active: Int
    terms: Boolean
    interested: Boolean
  }

  input AuthUserInput {
    personalemail: String!
    password: String!
  }

  input AuthUserTokenInput {
    token: String!
  }

  type Token {
    token: String
  }

  #typeDef Webinars
  type Webinar {
    id: ID
    codeWebinar: String
    image: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
    createdate: String
    modifieddate: String
    active: Int
  }

  input WebinarInput {
    codeWebinar: String
    image: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
    createdate: String
    modifieddate: String
    active: Int
  }

  #typeDef webinar
  type webinar {
    codeWebinar: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
  }

  #typeDef WebinarsRegistry
  type WebinarRegistry {
    id: ID
    token: String
    name: String
    lastname: String
    personalemail: String
    createdate: String
    modifieddate: String
    Webinars: [webinar]
  }

  input WebinarRegistryInput {
    token: String
    codeWebinar: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
    name: String
    lastname: String
    personalemail: String
    createdate: String
    modifieddate: String
  }

  input AsesoriaRegistryInput {
    token: String
    codigo: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
    name: String
    lastname: String
    personalemail: String
    createdate: String
    modifieddate: String
  }

  input OrientacionRegistryInput {
    token: String
    codigo: String
    title: String
    description: String
    information: String
    eventdate: String
    url: String
    name: String
    lastname: String
    personalemail: String
    createdate: String
    modifieddate: String
  }

  #typeDef Carrera
  type Carrera {
    IdCarrera: String
    Nombre: String
    Facultad: String
  }

  #typeDef Modalidad
  type Modalidad {
    Modalidad: String
    Carreras: [Carrera]
  }

  #typeDef TipoIngreso
  type TipoIngreso {
    TipoIngreso: String
    Modalidades: [Modalidad]
  }

  #typeDef Sede
  type Sede {
    IdSede: Int
    NombreSede: String
    TipoIngresos: [TipoIngreso]
  }

  #typeDef CatalogoCarreras
  type CatalogoCarreras {
    Sedes: [Sede]
  }

  type Query {
    getUser(id: ID!): User
    allUsers: [User]

    getWebinar(id: ID!): Webinar
    allWebinars: [Webinar]

    getWebinarRegistry(id: ID!): WebinarRegistry
    allWebinarsRegistry: [WebinarRegistry]
    allUserWebinarsRegistry: [WebinarRegistry]

    allCarreras: [CatalogoCarreras]
  }

  type Mutation {
    authUser(input: AuthUserInput): Token
    authUserToken(input: AuthUserTokenInput): Token
    newUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
    deleteUser(id: ID!): String

    newWebinar(input: WebinarInput): Webinar
    updateWebinar(id: ID!, input: WebinarInput): Webinar
    deleteWebinar(id: ID!): String

    newWebinarRegistry(input: WebinarRegistryInput): String
    newAsesoriaRegistry(input: AsesoriaRegistryInput): String
    newOrientacionRegistry(input: OrientacionRegistryInput): String
    updateWebinarRegistry(id: ID!, input: WebinarRegistryInput): WebinarRegistry
    deleteWebinarRegistry(id: ID!): String
  }
`;

module.exports = typeDefs;
