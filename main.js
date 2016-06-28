//Inicializamos express
var express = require("express");
//inicializamos swig
var swig = require("swig");
//Inicializamos body-parser
var bodyParser = require("body-parser");

//Modelos que vamos a utilizar
var User = require("./models/user").User;
var Vacante = require("./models/user").Vacante;

//inicialización de variable app con express
var app = express();

//configuación del motor con que se van a renderizar nuestras vistas
app.use(bodyParser.urlencoded({extended: true}));

//Cambiamos a mantener la sesión en una cookie
var cookieSession = require("cookie-session");
//Inicializamos la variable de cookie

app.use(cookieSession({
    name: "Proyecto Final NodeJs",
    keys: ["llave-1", "llave-2"]
}));

app.engine("html", swig.renderFile);

//configuración de renderización
app.set("view engine", "html");

//configuración de la carpeta de vistas a buscar
app.set("views", __dirname + "/views");
//confguración de cache en swig
app.set("view cache", false);
swig.setDefaults({cache: false});

//Bibliotecas para usar bootstrap
app.use("/", express.static("./public"));


//inicialización de método get
app.get("/", function (req, res) {
    //res.render("inicio", {IDSesion: req.session});


    Vacante.find({}, function (err, puestos) {
        if (req.session.user_id) {
            console.log("con sesion");
            res.render("inicio", {
                puestos: puestos,
                IDSesion: req.session,
                Usuario:req.usuario
            });
        } else {
            console.log("sin sesion");
            res.render("inicio", {puestos: puestos});
        }



        //console.log(puestos);	
    });
});

app.get("/iniciarSesion", function (req, res) {
    console.log("Iniciar sesion...");
    User.count({}, function (err, usuarios) {
        //console.log("Usuarios: " + usuarios);
        if (usuarios != 0) {
            res.render("iniciarSesion");
        } else {
            res.render("nuevoUsuario", {admin: true});
        }
    });

});

app.get("/cerrarSesion", function (req, res) {
    console.log("cerrar sesion");
    req.session=null;
    res.render("cerrar");
});

//Aqui determina si el usuario existe en la base de datos
app.post("/usuarioFirmado", function (req, res) {
    console.log("Usuario Firmado");

    //Busca el primer usuario que cumpla el criterio
    User.findOne({usuario: req.body.usuario,
        password: req.body.password},
            function (err, usua) {
                //console.log(usua);
                if (usua) {
                    console.log("Mi usuario en sesion");
                    req.session.user_id = usua._id;
                    req.session.coreo = usua.email;
                    req.session.admin = usua.admin;
                    req.session.usuario = usua.usuario;
                    console.log(req.session);
                    //res.send("Bienvenido "+req.body.usuario);
                    res.render("nuevoPuesto", {IDSesion: req.session})
                } else {
                    res.render("iniciarSesion", {
                        error: "Usuario o password incorrecto"});
                }

            });
});

app.get("/nuevoUsuario", function (req, res) {
    res.render("nuevoUsuario");
});
app.post("/nuevoUsuario", function (req, res) {
    //console.log("Usuario:" + req.body.usuario);
    //console.log("sexo:" + req.body.sexo);

    if (req.body.admin) {
        admin = true;
    } else {
        admin = false;
    }

    User.count({}, function (err, usuarios) {
        if (usuarios == 0) {
            //El primer usuario es administrador
            admin = true;
        }

        //la función find encuentra un documento dentro de la tabla de mongo
        User.find({usuario: req.body.usuario}, function (err, usua) {
            console.log("Usua:" + usua);
            //validamos que la función de find nos haya traido un documento
            if (usua.length) {
                res.send("el usuario ya existe");
            } else {
                var user = new User({
                    usuario: req.body.usuario,
                    edad: req.body.edad,
                    sexo: req.body.sexo,
                    email: req.body.email,
                    password: req.body.password,
                    admin: admin
                });
                // la función save nos ayuda a salvar o a actalizar un documento
                user.save(function (err) {
                    if (err) {
                        console.log("Error :" + String(err));

                        res.render("nuevoUsuario", {
                            error: String(err),
                            usuario: req.body.usuario
                        });
                    } else {
                        res.render("iniciarSesion");
                    }
                });
            }
        })

    });


});


app.get("/mostrarUsuarios", function (req, res) {
    User.find({}, function (err, usuarios) {
        res.render("mostrarUsuarios", {usuarios: usuarios});
        //console.log(usuarios);	
    });
});

// Puesto
app.get("/nuevoPuesto", function (req, res) {
    res.render("nuevoPuesto", {IDSesion: req.session});
});
app.post("/nuevoPuesto", function (req, res) {
    var id = 0;
    //la función find encuentra un documento dentro de la tabla de mongo
    Vacante.find({vacante: req.body.nombre}, function (err, pues) {
        console.log("entro find ");
        //validamos que la función de find nos haya traido un documento
        if (pues.length) {
            res.send("La vacante ya existe");
        } else {
            Puesto.find({}, function (err, puestos) {
                //console.log(puestos);
                id = puestos.length + 1;
                var vacante = new Vacante({
                    id: id,
                    nombre: req.body.nombre,
                    descrip: req.body.descrip,
                    salario: req.body.salario,
                    sexo: req.body.sexo,
                    idioma: req.body.idioma
                });
                // la función save nos ayuda a salvar o a actalizar un documento
                vacante.save(function (err) {
                    if (err) {
                        console.log(String(err));
                        res.send(String(err));
                    } else {
                        res.render("datosGuardados", {id: id});
                    }
                });
            });
        }
    })
});

app.get("/Postularme", function (req, res) {
    console.log("postulame el id es " + req.query.id);
    console.log("url " + req.query.id);
    res.render("postularme", {id: req.query.id});
});

app.listen(8081);
console.log("ProyFinal en el puerto 8081!!!!");

