const clienteCtrl = {};
const imagen = require('./uploadFile.controllers');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const clienteModel = require('../models/Cliente');
const adminModel = require('../models/Administrador');
const email = require('../middleware/sendEmail');
const Tienda = require('../models/Tienda');
const recuperacionModel = require('../models/RecuperacionPass');

clienteCtrl.subirImagen = async (req, res, next) => {
	await imagen.upload(req, res, function(err) {
		if (err) {
			res.json({ message: err });
		}
		return next();
	});
};

clienteCtrl.getClienteSinPaginacion = async (req,res) => {
	try {
		const clientes = await clienteModel.find({});
		res.status(200).json(clientes);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error en el servidor', error });
	}
}

clienteCtrl.cambioResetPass = async (req,res) => {
	try {
		const datos = await recuperacionModel.find({codigoVerificacion: req.params.idPassword});
		console.log(datos);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error en el servidor', error });
	}
}

clienteCtrl.restablecerPassword = async (req,res) => {
	try {
		const { emailCliente } = req.body;
		const newRecuperacion = new recuperacionModel({
			correoUsuario: emailCliente,
			codigoVerificacion: makeid(100),
			activo: false
		})

		await newRecuperacion.save();

		const tienda = await Tienda.find();
		const htmlContentUser = `
                <div>                    
                    <h3 style="font-family: sans-serif; margin: 15px 15px;">Escuchamos que perdió su contraseña. ¡Lo siento por eso!</h3>
                    <h4 style="font-family: sans-serif; margin: 15px 15px;">¡Pero no se preocupe! Se puede utilizar el siguiente enlace para restablecer la contraseña:</h4>
					<a href="https://brave-yonath-783630.netlify.app/">https://brave-yonath-783630.netlify.app/</a>
                    <div style="margin:auto; max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">Al utilizar este codigo ya no podra volverse a usar.</p>
                    </div>
				</div>`;

		await email.sendEmail(emailCliente,"Recuperacion",htmlContentUser,tienda[0].nombre);
		res.status(200).json({message: "Correo enviado."});

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error en el servidor', error });
	}
}

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

/* clienteCtrl.getClientes = async (req, res, next) => {
	try {
		const clientes = await clienteModel.find();
		res.status(200).json(clientes);
	} catch (err) {
		res.status(500).json({ message: "Error en el servidor",err })	
		console.log(error);
		next();
	}
}; */
clienteCtrl.getClientes = async (req, res, next) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const options = {
			page,
			limit: parseInt(limit)
		};
		await clienteModel.paginate({}, options, (err, response) => {
			if (err) {
				res.status(500).json({ message: 'Error en el servidor', err });
			} else {
				if (!response) {
					res.status(404).json({ message: 'Error al obtener clientes' });
				} else {
					res.status(200).json({ posts: response });
				}
			}
		});
	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
	}
};

clienteCtrl.getClientesFiltrados = async (req, res, next) => {
	try {
		const { nombre, apellido, direccion } = req.query;
		await clienteModel.aggregate(
			[
				{
					$match: {
						$or: [
							{ nombre: { $regex: '.*' + nombre + '.*', $options: 'i' } },
							{ apellido: { $regex: '.*' + apellido + '.*', $options: 'i' } },
							{ 'direccion.calle_numero': { $regex: '.*' + direccion + '.*', $options: 'i' } }
						]
					}
				}
			],
			(err, response) => {
				if (err) {
					res.status(500).json({ message: 'Error en el servidor', err });
				} else {
					if (!response) {
						res.status(404).json({ message: 'Error al obtener clientes' });
					} else {
						res.status(200).json({ posts: response });
					}
				}
			}
		);
	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
	}
};

clienteCtrl.getCliente = async (req, res, next) => {
	try {
		const cliente = await clienteModel.findById(req.params.id);
		if (!cliente) {
			res.status(404).json({ err: 'Este cliente no existe' });
			next();
		}
		res.json(cliente);
	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
	}
};

clienteCtrl.createCliente = (req, res) => {
	try {
		console.log('Datos del body: ');
		console.log(req.body);
		if(req.body.aceptarPoliticas){
			const repeatContrasena = req.body.repeatContrasena;
			const contrasena = req.body.contrasena;
			const newCliente = new clienteModel(req.body);
			newCliente.active = false;
			newCliente.tipoSesion = "APIRestAB";
	
			if (!contrasena || !repeatContrasena) {
				res.status(404).json({ message: 'Las contrasenas son obligatorias' });
			} else {
				if (contrasena !== repeatContrasena) {
					res.status(404).json({ message: 'Las contrasenas no son iguales' });
				} else {
					bcrypt.hash(contrasena, null, null, function(err, hash) {
						if (err) {
							res.status(500).json({ message: 'Error al encriptar la contrasena', err });
						} else {
							newCliente.contrasena = hash;
							newCliente.save((err, userStored) => {
								if (err) {
									res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
								} else {
									if (!userStored) {
										res.status(404).json({ message: 'Error al crear el usuario' });
									} else {
										const token = jwt.sign(
											{
												email: newCliente.email,
												nombre: newCliente.nombre,
												apellido: newCliente.apellido,
												_id: newCliente._id,
												tipoSesion: "APIRestAB",
												rol: false
											},
											process.env.AUTH_KEY
										);
										console.log('Token: ' + token);
										res.json({ token });
									}
								}
							});
						}
					});
				}
			}
		}else{
			res.status(404).json({ message: 'Aceptar las politicas.' });
		}

	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
		console.log(err);
	}
};

clienteCtrl.updateCliente = async (req, res, next) => {
	try {
		const {nombre,apellido,email,telefono,calle_numero,entre_calles,cp,colonia,ciudad,estado,pais,contrasena,repeatContrasena,contrasenaActual} = req.body;
		const clienteBase = await clienteModel.findById(req.params.id);
		console.log(contrasena);
		console.log(repeatContrasena);
		const nuevoCliente = {
			nombre,
			apellido,
			email,
			telefono,
			direccion: [{
				calle_numero,
				entre_calles,
				cp,
				colonia,
				ciudad,
				estado,
				pais
			}]
		}
		

		if (req.file) {
			nuevoCliente.imagen = req.file.key;
			if(clienteBase.imagen){
				await imagen.eliminarImagen(clienteBase.imagen);
			}
		} else {
			nuevoCliente.imagen = clienteBase.imagen;
		}

		if(contrasenaActual){
			if (!bcrypt.compareSync(contrasenaActual, clienteBase.contrasena)) {
				res.status(404).json({ message: 'Contraseña incorrecta' });
				next();
			}else{
				if (contrasena && repeatContrasena) {
					if (contrasena !== repeatContrasena) {
						res.status(404).json({ message: 'Las contrasenas no son iguales' });
					} else {
						await bcrypt.hash(contrasena, null, null, async function(err, hash) {
							if (err) {
								res.status(404).json({ message: 'Error al encriptar la contrasena', err });
							} else {
								console.log(hash);
								nuevoCliente.contrasena = hash;
								await clienteModel.findByIdAndUpdate(req.params.id, nuevoCliente, async (err, userStored) => {
									if (err) {
										res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
									} else {
										if (!userStored) {
											res.status(404).json({ message: 'Error al crear el usuario' });
										} else {
											const clienteBase = await clienteModel.findById(req.params.id);
											let token = null;
											if(clienteBase.tipoSesion === "FireBase"){
												token = jwt.sign(
													{
														email: clienteBase.email,
														nombre: clienteBase.nombre,
														apellido: clienteBase.apellido,
														_id: clienteBase._id,
														tipoSesion: clienteBase.tipoSesion,
														imagenFireBase: clienteBase.imagen,
														rol: false
													},
													process.env.AUTH_KEY
												);
											}else{
												token = jwt.sign(
													{
														email: clienteBase.email,
														nombre: clienteBase.nombre,
														apellido: clienteBase.apellido,
														_id: clienteBase._id,
														tipoSesion: clienteBase.tipoSesion,
														imagen: clienteBase.imagen,
														rol: false
													},
													process.env.AUTH_KEY
												);
											}
						
											res.json({ token });
										}
									}
								});
							}
						});
					}
				}
			}
		}else{
			await clienteModel.findByIdAndUpdate(req.params.id, nuevoCliente, async (err, userStored) => {
				if (err) {
					res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
				} else {
					if (!userStored) {
						res.status(404).json({ message: 'Error al crear el usuario' });
					} else {
						const clienteBase = await clienteModel.findById(req.params.id);
						let token = null;
						if(clienteBase.tipoSesion === "FireBase"){
							token = jwt.sign(
								{
									email: clienteBase.email,
									nombre: clienteBase.nombre,
									apellido: clienteBase.apellido,
									_id: clienteBase._id,
									tipoSesion: clienteBase.tipoSesion,
									imagenFireBase: clienteBase.imagen,
									rol: false
								},
								process.env.AUTH_KEY
							);
						}else{
							token = jwt.sign(
								{
									email: clienteBase.email,
									nombre: clienteBase.nombre,
									apellido: clienteBase.apellido,
									_id: clienteBase._id,
									tipoSesion: clienteBase.tipoSesion,
									imagen: clienteBase.imagen,
									rol: false
								},
								process.env.AUTH_KEY
							);
						}
	
						res.json({ token });
					}
				}
			});
		}


	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Error en el servidor', err });
		next();
	}
};

clienteCtrl.deleteCliente = async (req, res, next) => {
	try {
		const clienteDeBase = await clienteModel.findById(req.params.id);
		if (clienteDeBase.imagen) {
			await imagen.eliminarImagen(clienteDeBase.imagen);
		}
		await clienteModel.findByIdAndDelete(req.params.id);
		res.json({ message: 'Cliente Deleted' });
	} catch (err) {
		res.status(500).json({ message: 'Error en el servidor', err });
	}
};

clienteCtrl.authCliente = async (req, res, next) => {
	const { email } = req.body;
	const contrasena = req.body.contrasena;
	const admin = await adminModel.findOne({ email });
	if (admin) {
		try {
			if (!bcrypt.compareSync(contrasena, admin.contrasena)) {
				res.status(404).json({ message: 'Contraseña incorrecta' });
				next();
			} else {
				const token = jwt.sign(
					{
						email: admin.email,
						nombre: admin.nombre,
						_id: admin._id,
						rol: true
					},
					process.env.AUTH_KEY
				);
				//token
				res.json({ token });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: 'Error en el servidor', err });
		}
	} else {
		try {
			const cliente = await clienteModel.findOne({ email });
			console.log(cliente, contrasena);
			if (!cliente) {
				res.status(404).json({ message: 'Este usuario no existe' });
			} else {
				if (!bcrypt.compareSync(contrasena, cliente.contrasena)) {
					console.log('entro');
					res.status(500).json({ message: 'Contraseña incorrecta' });
					next();
				} else {
					const token = jwt.sign(
						{
							email: cliente.email,
							nombre: cliente.nombre,
							apellido: cliente.apellido,
							_id: cliente._id,
							tipoSesion: "APIRestAB",
							imagen: cliente.imagen,
							rol: false
						},
						process.env.AUTH_KEY
					);
					//token
					res.json({ token });
				}
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: 'Error en el servidor', err });
		}
	}
};

clienteCtrl.authFirebase = async (req, res) => {
	const { email, nombre, apellido, imagen, uid } = req.body;
	console.log(req.body);
	const cliente = await clienteModel.findOne({ email });
	if (cliente) {
		if (!bcrypt.compareSync(email, cliente.contrasena)) {
			res.status(500).json({ message: 'Contraseña incorrecta' });
		} else {
			const token = jwt.sign(
				{
					email: cliente.email,
					nombre: cliente.nombre,
					apellido: cliente.apellido,
					_id: cliente._id,
					tipoSesion: "FireBase",
					imagenFireBase: cliente.imagen,
					rol: false
				},
				process.env.AUTH_KEY
			);
			//token
			res.json({ token });
		}
	} else {
		try {
			const newcliente = new clienteModel();
			newcliente.nombre = nombre;
			newcliente.apellido = apellido;
			newcliente.email = email;
			newcliente.imagen = imagen;
			newcliente.tipoSesion = "FireBase";
			newcliente.aceptarPoliticas = true;

			bcrypt.hash(email, null, null, function(err, hash) {
				if (err) {
					res.status(500).json({ message: 'Error al encriptar la contrasena', err });
				} else {
					newcliente.contrasena = hash;
					newcliente.save((err, userStored) => {
						if (err) {
							res.status(500).json({ message: 'Ups, algo paso al registrar el usuario', err });
						} else {
							if (!userStored) {
								res.status(500).json({ message: 'Error al crear el usuario' });
							} else {
								const token = jwt.sign(
									{
										email: newcliente.email,
										nombre: newcliente.nombre,
										apellido: newcliente.apellido,
										_id: newcliente._id,
										imagenFireBase: newcliente.imagen,
										tipoSesion: "FireBase",
										rol: false
									},
									process.env.AUTH_KEY
								);
								//token
								res.json({ token });
							}
						}
					});
				}
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: 'Error en el servidor', err });
		}
	}
};

module.exports = clienteCtrl;
