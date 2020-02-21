'use strict'

const User = require('../models/user')
const service = require('../services')

function signUp (req, res) {
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    password: req.body.password
  })

  user.save((err) => {
    if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

    return res.status(201).send({ token: service.createToken(user) })
  })
}

function signIn (req, res) {
  User.find({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send({ message: err })
    if (!user) return res.status(404).send({ message: 'No existe el usuario' })

    req.user = user
    res.status(200).send({
      message: 'Te has logueado correctamente',
      token: service.createToken(user)
    })
  })
}
function emails (req, res) {
  Transport.sendMail({
    from: "ESI A.C",
    to: req.body.email,
    subject: "Hola activa tu cuenta",
    html: `
        <h1>Hola ${req.body.nombre} Bienvenido!</h1>
        <a href="https://croma.esimx.org/activate/${req.body.token}">Porfavor active su cuenta desde aqui!</a>
    `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    });
}

function ePass (req, res) {
  Transport.sendMail({
    from: "ESI A.C",
    to: req.body.email,
    subject: "Solicitud de cambio de contraseña",
    html: `
        <h1>Hola si usted no hizo la solicitud porfavor ingnore este correo</h1>
        <a href="https://croma.esimx.org/fpassword/${req.body.token}">Cambio de contraseña aqui!</a>
    `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    }
    );
  
}

module.exports = {
  signUp,
  signIn,
  emails,
  ePass
}
