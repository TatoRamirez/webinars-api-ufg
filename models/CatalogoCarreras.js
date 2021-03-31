const mongoose = require("mongoose");

const Carrera = mongoose.Schema(
  {
    IdCarrera: {
      type: Number,
      trim: true,
    },
    Nombre: {
      type: String,
      trim: true,
    },
    Facultad: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const Modalidad = mongoose.Schema(
  {
    Modalidad: {
      type: String,
      trim: true,
    },
    Carreras: [Carrera],
  },
  { _id: false }
);

const TipoIngreso = mongoose.Schema(
  {
    TipoIngreso: {
      type: String,
      trim: true,
    },
    Modalidades: [Modalidad],
  },
  { _id: false }
);

const Sede = mongoose.Schema(
  {
    IdSede: {
      type: Number,
      trim: true,
    },
    NombreSede: {
      type: String,
      trim: true,
    },
    TipoIngresos: [TipoIngreso],
  },
  { _id: false }
);

const CatalogoCarrerasSchema = mongoose.Schema({
  Sedes: [Sede],
});

module.exports = mongoose.model("catalogocarreras", CatalogoCarrerasSchema);
