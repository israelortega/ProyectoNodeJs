/**
*Libreria puesto.js
Libreria que contiene la información necesaria para crear un objeto de tipo mongoose
necesario para poder trabajar con conexiones hacia mongodb
*/
//Llamando a mongoose, que nos ayuda a gestionar el objeto
var mongoose = require('mongoose');
//ip o direción en donde tenemos nuestra base de datos
mongoose.connect('mongodb://localhost/puestos');
//inicializamos nuestro esquema
var Schema = mongoose.Schema;
//variable para decirle a valor sexo cuales son sus dos posibles valores
var posibles_valores=["M","F"];
//recordemos que nuestro esquema es la forma en que le indicamos a mongoose como
//enviar los datos hacia la base de datos.
var puesto_schema = new Schema({
	nombre:String,
	descrip:String,
	salario:Number,
	sexo:{type:String,enum:{values: posibles_valores, message:"Opción no valida"}},
	idioma: String
});
//aquí inicializamos la variable puesto
var Puesto = mongoose.model("Puesto", puesto_schema);
//y aquíya enviamos la variable hacia el export
module.exports.Puesto = Puesto;
