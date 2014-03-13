function LLamar_WS(url, callback, mensaje_error) {
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			Lungo.Notification.hide();
			if (data.length>0) {
				callback(data);	
			} else {
				Rellenar_next_events(data, mensaje_error);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

/**
 * Llamada al webservice de cargar eventos próximos
 */
function WS_Cargar_next_events() {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Filtrar_eventos&token=" + token;
	$$("#next-events header > h1").text("Upcoming Events");
	LLamar_WS(url, WS_Vista_next_events, 0);
}

function WS_Vista_next_events(data) {
	Rellenar_next_events(data, 0);
}

function WS_Cargar_events_x_filtros(desde, hasta, disciplina, asociacion, region, distancia, otros, venue) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Filtrar_por_filtros_busq&token=" + token
			+ "&desde=" + urlencode(desde) + "&hasta=" + urlencode(hasta) + "&disc="
			+ disciplina.toString() + "&asoc=" + asociacion.toString()
			+ "&region=" + region.toString() + "&distancia=" + distancia.toString() 
			+ "&otros=" + otros.toString() + "&venue=" + venue.toString(); 
	$$("#next-events header > h1").text("Search Events");
	LLamar_WS(url,WS_Vista_events_filtros,2);
}

function WS_Vista_events_filtros(data) {
	Rellenar_next_events(data, 2);
}

function WS_Cargar_events_near() {
	if (app_latitud == 0 && app_longitud == 0) {
		Reset_posicion();
	}
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Filtrar_por_proximidad&token=" + token
			+ "&latitud=" + app_latitud.toString() + "&longitud="
			+ app_longitud.toString();
	$$("#next-events header > h1").text("Events Near Me");
	LLamar_WS(url, WS_Vista_events_near,1);
}

function WS_Vista_events_near(data) {
	Rellenar_next_events(data, 1);
}

function WS_Cargar_events_favs() {
	if (sesion_id_user>0) {
		token = urlencode(Generar_token());
		var url = ws_hm + "WS_Filtrar_por_favs&token=" + token + "&id_user=" + sesion_id_user + "&perfil=" + sesion_perfil;
		$$("#next-events header > h1").text("Favorites Events");
		LLamar_WS(url, WS_Vista_fav_events,3);
	}
}

function WS_Vista_fav_events(data) {
	Rellenar_next_events(data, 3);
}

/**
 * Llamada al webservice de la ficha del evento
 * 
 * @param id
 *            del evento
 */
function WS_Cargar_detail_event(id) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_detalle_evento&id=" + id.toString()
			+ "&token=" + token;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.id>0) {
				Lungo.Notification.hide();
				Rellenar_detail_event(data);
				Lungo.Router.section("detail-event");
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

/**
 * Llamada al webservice para cargar disciplinas
 * 
 * @param select,
 *            elemento del dom que es el select
 * @param bol_anadir_all,
 *            añade texto de All con valor 0
 */
function WS_Cargar_disciplinas(select, bol_anadir_all) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_disciplinas&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation",
				// "hm-sad", 2);
			} else if (data.length>0) {
				if (bol_anadir_all) {
					Rellenar_combo(data, select, "All disciplines");
				} else {
					Rellenar_combo(data, select, "");
				}
			}
		},
		error : function(xhr, type) {
			// Lungo.Notification.error("Error","Unsuccessful operation",
			// "hm-sad", 2);
		}
	});
}

/**
 * Llamada al webservice para cargar asociaciones
 * 
 * @param select,
 *            elemento del dom que es el select
 * @param bol_anadir_all,
 *            añade texto de All con valor 0
 */
function WS_Cargar_asociaciones(select, bol_anadir_all) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_asociaciones&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation",
				// "hm-sad", 2);
			} else if (data.length>0) {
				if (bol_anadir_all) {
					Rellenar_combo(data, select, "All associations");
				} else {
					Rellenar_combo(data, select, "");
				}
			}
		},
		error : function(xhr, type) {
			// Lungo.Notification.error("Error","Unsuccessful operation",
			// "hm-sad", 2);
		}
	});
}

/**
 * Llamada al webservice para cargar asociaciones
 * 
 * @param pais
 * @param select,
 *            elemento del dom que es el select
 * @param bol_anadir_all,
 *            añade texto de All con valor 0
 */
function WS_Cargar_regiones(pais, select, bol_anadir_all) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_regiones&token=" + token + "&pais=" + pais;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation","hm-sad", 2);
			} else if (data.length>0) {
				if (bol_anadir_all) {
					Rellenar_combo(data, select, "All counties");
				} else {
					Rellenar_combo(data, select, "Select county");
				}
			}
		},
		error : function(xhr, type) {
			//Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
		}
	});
}

function WS_Login() {
	Lungo.Notification.show();
	// capturamos los valores de los input
	var usuario = $$('#txtLoginUser').val();
	var password = $$('#txtLoginPass').val();
	if (usuario.length > 0 && password.length > 0) {
		token = urlencode(Generar_token());
		password = md5(password);
		var nav = Obtener_navegador();
		var url = ws_hm + "WS_Login&user=" + urlencode(usuario) + "&pass=" + urlencode(password)
				+ "&token=" + token + "&browser=" + urlencode(nav) + "&os=" + urlencode(navigator.userAgent);
		if (app_status_network) {
			$$.ajax({
				type : 'POST', // defaults to 'GET'
				url : url,
				dataType : 'json', // 'json', 'xml', 'html', or 'text'
				async : true,
				crossDomain : true,
				success : function(data) {
					if (data.error == ws_msg_error) {
						Reset_valores_sesion();
						Lungo.Notification.error("Error",
								"Ups! Your details are wrong.", "hm-sad", 2);
					} else if (data.id > 0) {
						// Limpiamos los input
						Guardar_storage_user(usuario, $$('#txtLoginPass').val());
						sesion_id_user = data.id;
						sesion_nombre = data.nombre;
						sesion_perfil = data.perfil;
						$$("#span-username").text(sesion_nombre);
						Lungo.Notification.hide();
						Lungo.Router.section("index-menu");
					} else {
						Reset_valores_sesion();
						Lungo.Notification.error('Error', 'Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.',
								'hm-sad', 2);
					}
				},
				error : function(xhr, type) {
					Reset_valores_sesion();
					Lungo.Notification.error('Error', 'Ups! Your details are wrong.',
							'hm-sad', 2);
				}
			});	
		} else {
			Reset_valores_sesion();
			Lungo.Notification.error('Error', 'Ups! You are offline. You can&apos;t connect with the Horse Monkey&apos;s Service.',
					'hm-sad', 2);
		}
	} else {
		Reset_valores_sesion();
		Lungo.Notification.error('Error',
				'Ups! User and password are required fields.', 'hm-sad', 2);
	}
}

/**
 * 
 * @param tipo_terms,  hay 3 tipos de terminos: terms_buyers, terms_organisers, terms_privacy
 */
function WS_Leer_terms(tipo_terms) {
	// hay 3 tipos de terminos: terms_buyers, terms_organisers, terms_privacy
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Terms&token=" + token + "&tipo_terms=" + tipo_terms;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error","Unsuccessful operation.","hm-sad", 2);
			} else if (data.texto!=null) {
				Lungo.Notification.hide();
				switch (tipo_terms) {
				case 'terms_buyers':
					Ver_doc("Terms Buyers", data.texto);
					break;
				case 'terms_organisers':
					Ver_doc("Terms Organisers", data.texto);
					break;
				case 'terms_privacy':
					Ver_doc("Terms & Privacy Policy", data.texto);
					break;
				default:
					break;
				}
			} else {
				Lungo.Notification.error('Error', 'Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.',
						'hm-sad', 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.","hm-sad", 2);
		}
	});
}

/**
 * 
 * @param usuario
 * @param password
 * @param nombre
 * @param apellido
 * @param riders, si es 1 es perfil rider, si es mas, yard
 */
function WS_Comprobar_usuario(usuario, password, nombre, apellido, riders) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Comprobar_usuario&token=" + token + "&usuario=" + urlencode(usuario);
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// no existe, con lo cual es correcto 
				Lungo.Notification.hide();
				WS_Crear_usuario(usuario, password, nombre, apellido, riders);
			} else if (data.id>0) {
				Lungo.Notification.error("Error","Ups! This email has already been registered.","hm-sad", 2);
			} else {
				Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.","hm-sad", 2);
		}
	});
}

function WS_Crear_usuario(usuario, password, nombre, apellido, riders) {
	var perfil = 2; // por defecto rider
	if (riders>1) {
		// es yard
		perfil = 3; // yard
	}
	var nav = Obtener_navegador();
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Registro&token=" + token + "&usuario=" + urlencode(usuario) + "&pass=" + urlencode(md5(password)) + 
		"&perfil=" + perfil.toString() + "&nombre=" + urlencode(nombre) + "&apellido1=" + urlencode(apellido) + "&browser=" + urlencode(nav) + 
		"&os=" + urlencode(navigator.userAgent);  
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2); 
			} else if (data.id>0) {
					Lungo.Notification.hide();
					Guardar_storage_user(usuario, password);
					Limpiar_form_registro();
					sesion_id_user = data.id;
					sesion_nombre = nombre + " " + apellido1;
					sesion_perfil = perfil;
					Lungo.Router.section("index-menu");	
			} else {
				Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2);
		}
	});
}

function WS_Reset_password(email) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Reset_pass&token=" + token + "&email=" + urlencode(email);
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error","Oh No! We do not seem to find your email on our database. Please email us at contact@horsemonkey.com.","hm-sad", 3); 
			} else if (data.id>=0) {
				//Lungo.Notification.hide();
				Lungo.Notification.success("Success", "We have forwarded your details by email. Check your mail and follow instructions.", "hm-happy", 3, Abrir_login());
			} else {
				Lungo.Notification.error('Error', 'Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.',
						'hm-sad', 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.","hm-sad", 2);
		}
	});	
}

/**
 * Carga el filtro de distancias
 * @param select,
 *            elemento del dom que es el select
 */
function WS_Cargar_filtro_distancia(select) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_filtro_distancia&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation","hm-sad", 2);
			} else if (data.html!=null) {
				Rellenar_combo_con_html(select, data.html);
			}
		},
		error : function(xhr, type) {
			//Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
		}
	});
}

/**
 * Carga el filtro de varios
 * @param select,
 *            elemento del dom que es el select
 */
function WS_Cargar_filtro_varios(select) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_filtro_varios&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation","hm-sad", 2);
			} else if (data.html!=null) {
				Rellenar_combo_con_html(select, data.html);
			}
		},
		error : function(xhr, type) {
			//Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
		}
	});
}

/**
 * Carga todos los venues para el desplegable
 * @param select, id del select
 * @param bol_anadir_all, true or false
 */
function WS_Cargar_venues(select, bol_anadir_all) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_venues&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				// Lungo.Notification.error("Error","Unsuccessful operation","hm-sad", 2);
			} else if (data.length>0) {
				if (bol_anadir_all) {
					Rellenar_combo(data, select, "All venues");
				} else {
					Rellenar_combo(data, select, "");
				}
			}
		},
		error : function(xhr, type) {
			//Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
		}
	});
}

/**
 * Cargar info del evento para la inscripcion
 * @param id
 */
function WS_Cargar_info_event_para_inscrip(id_evento, id_inscrip, jinete) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_info_evento_para_inscrip&id_evento=" + id_evento.toString()
			+ "&id_inscripcion=" + id_inscrip.toString() + "&jinete=" +  jinete.toString() + "&token=" + token;
	Lungo.Notification.show();
	Rellenar_clases_inscripcion_vacio();
	Rellenar_totales_inscripcion_vacia();
	Rellenar_servicios_inscripcion_vacia(true);
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.id>0) {
				Rellenar_my_inscrip_info_event(data);
				Rellenar_totales_inscripcion(data);
				if (id_inscrip>0) {
					// Cargar ahora las clases inscritas
					WS_Cargar_clases_inscrip(id_inscrip);
				} else {
					Lungo.Notification.hide();
					Lungo.Router.article("my-inscrip","art-my-inscrip-classes");	
				}
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

/**
 * Leer un campo de una tabla por medio del webservice
 * @param campo, string
 * @param tabla, string
 * @param where, string
 * @param order, string
 */
function WS_Leer_datos(campos, tabla, where, order, callback, callback_error) {
	var params = "WS_Leer_datos&campos=" + urlencode(campos)
	+ "&tabla=" + urlencode(tabla) + "&where=" + urlencode(where) + "&order=" + urlencode(order);
	Llamar_HM(params, false, callback, callback_error);
}

/**
 * Carga las clases ya inscritas de la inscripcion
 * @param id_inscrip integer
 */
function WS_Cargar_clases_inscrip(id_inscrip) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_clases_inscrip&id=" + id_inscrip.toString()
			+ "&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.length>0) {
				//Rellenar lista de clases
				Rellenar_clases_inscripcion(data);
				// cargar ahora los servicios
				WS_Cargar_servicios_inscrip(id_inscrip);
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

/**
 * Carga los servicios ya comprados  de la inscripcion
 * @param id_inscrip integer
 */
function WS_Cargar_servicios_inscrip(id_inscrip) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_servicios_inscrip&id=" + id_inscrip.toString()
			+ "&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			Lungo.Notification.hide();
			if (data.length>0) {
				//Rellenar lista de productos
				Rellenar_servicios_inscripcion(data);
			}
			Lungo.Router.article("my-inscrip","art-my-inscrip-classes");
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

/**
 * Comprueba si puede apuntarse a un evento
 * @param id_evento
 * @param callback
 * @param callback_error
 * @param param_error
 */
function WS_Comprobar_puede_apuntarse(id_evento, callback, callback_error, param_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Comprobar_puede_apuntarse&id=" + id_evento.toString() + "&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				callback_error(param_error);
			} else if (data.estado==true) {
				callback(data);		
			} else {
				callback_error(param_error);
			}
		},
		error : function(xhr, type) {
			callback_error(param_error);
		}
	});	
}

/**
 * No muestra el loading, porque lo hace al principio de la aplicacion antes de loguearse incluso
 * @param callback
 */
function WS_Obtener_globales(callback, callback_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Obtener_globales&token=" + token;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				callback_error();
			} else if (data.app_pais!=null) {
				callback(data);		
			} else {
				callback_error();
			}
		},
		error : function(xhr, type) {
			callback_error();
		}
	});	
}

/**
 * Comprobacion por ws del pago confirmado en paypal
 * @param pay_id
 * @param callback
 * @param callback_error
 */
function WS_Comprobar_pago_paypal(pay_id, total_hm, paypal_fee, callback, callback_error) {
	Lungo.Notification.show();
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Comprobar_pago_paypal&token=" + token + "&pay_id=" +urlencode(pay_id) + 
		"&total_hm=" + urlencode(total_hm.toString()) + "&paypal_fee=" + urlencode(paypal_fee.toString());
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			Lungo.Notification.hide();
			if (data.error == ws_msg_error) {
				callback_error();
			} else if (data.id_inscrip>0) {
				callback(data);		
			} else {
				callback_error();
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.hide();
			callback_error();
		}
	});	
}

/**
 * Validar la inscripcion antes de pasar a pagar con paypal
 * @param id_inscrip
 * @param jinete
 * @param evento
 * @param perfil
 * @param callback, devuelve estado = true
 * @param callback_error, devuelve array con estado = false, error_tipo y error_msg
 */
function WS_Validar_inscripcion(importe, id_inscrip, jinete, evento, perfil, callback, callback_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Validar_inscripcion&token=" + token + "&id_inscrip=" +id_inscrip.toString() + 
		"&jinete=" + jinete.toString() + "&evento=" + evento.toString() + "&perfil=" + perfil.toString();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				callback_error(false, "default", "Unsuccessful operation.");
			} else if (data.estado) {
				callback(importe, id_inscrip);		
			} else {
				callback_error(data.estado, data.error_tipo, data.error_msg);
			}
		},
		error : function(xhr, type) {
			callback_error(false, "default", "Unsuccessful operation.");
		}
	}); 
} 

function WS_Actualizar_direccion(usuario, direccion, direccion2, ciudad, cp, movil, region) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Actualizar_direccion&token=" + token + "&usuario=" + usuario.toString() +  
		"&direccion=" + urlencode(direccion) + "&direccion2=" + urlencode(direccion2) + "&cp=" + cp + 
		"&ciudad=" + urlencode(ciudad) + "&movil=" + urlencode(movil) + "&region=" + region.toString() + 
		"&pais=" + app_pais.toString();
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error","Ups! We have not been able to update your address! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2); 
			} else if (data.estado==true) {
					Lungo.Notification.hide();
					Lungo.Router.back();	
			} else {
				Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error","Ups! We have not been able to update your address! Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", 2);
		}
	});
}

function WS_Cargar_direccion_usuario(callback) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_direccion_usuario&usuario=" + sesion_id_user.toString() 
			+ "&token=" + token;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.id>0) {
				Lungo.Notification.hide();
				callback(data);
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});
}

function WS_Eliminar_clase(id_detalle, evento, id_inscripcion, callback) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Eliminar_clase&id_detalle=" + id_detalle.toString() 
		+ "&jinete=" + sesion_id_user.toString() + "&id_evento=" + evento.toString() 
		+ "&id_inscripcion=" + id_inscripcion.toString() + "&token=" + token;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.estado==true) {
				Lungo.Notification.hide();
				callback(data);
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});	
}

function WS_Eliminar_servicio(id_detalle, evento, id_inscripcion, callback) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Eliminar_servicio&id_detalle=" + id_detalle.toString() 
		+ "&jinete=" + sesion_id_user.toString() + "&id_evento=" + evento.toString() 
		+ "&id_inscripcion=" + id_inscripcion.toString() + "&token=" + token;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			} else if (data.estado==true) {
				Lungo.Notification.hide();
				callback(data);
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2);
		}
	});	
}

function WS_Cargar_servicios_evento(id_evento, callback, callback_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_servicios_evento&id_evento=" + id_evento.toString() + "&token=" + token;
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2, callback_error);
			} else if (data.length>0) {
				Lungo.Notification.hide();
				callback(data);
			} else {
				Lungo.Notification.error("Error", "Unsuccessful operation.",
						"hm-sad", 2, callback_error);
			}
		},
		error : function(xhr, type) {
			Lungo.Notification.error("Error", "Unsuccessful operation.",
					"hm-sad", 2, callback_error);
		}
	});	
}

function WS_Anadir_producto_inscrip(id_evento, jinete, producto, cantidad, callback, callback_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Anadir_producto_inscrip&id_evento=" + id_evento.toString() + "&token=" + token 
		+ "&jinete=" + jinete.toString() + "&producto=" + producto.toString() + "&cantidad=" + cantidad.toString();
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				callback_error(data);
			} else if (data.id>0) {
				Lungo.Notification.hide();
				callback(data);
			} else {
				callback_error(data);
			}
		},
		error : function(xhr, type) {
			callback_error(null);
		}
	});	
}

function WS_Cargar_info_evento_proceso_anadir_clase(id_evento, callback, callback_error) {
	token = urlencode(Generar_token());
	var url = ws_hm + "WS_Cargar_info_evento_proceso_anadir_clase&id_evento=" + id_evento.toString() 
		+ "&token=" + token + "&perfil=" + sesion_perfil.toString() + "&jinete=" + sesion_id_user.toString();
	Lungo.Notification.show();
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.error == ws_msg_error) {
				callback_error(data);
			} else if (data.id>0) {
				//Lungo.Notification.hide();
				callback(data);
			} else {
				callback_error(data);
			}
		},
		error : function(xhr, type) {
			callback_error(null);
		}
	});
}

function WS_Cargar_clases_evento_disponibles(id_evento) {
	var params = "WS_Cargar_clases_evento_disponibles&id_evento=" + id_evento.toString();
	Llamar_HM(params, true, Rellenar_clases_disponibles_evento, null);	
}

function WS_Cargar_caballos_usuario() {
	var params = "WS_Cargar_caballos_usuario&jinete=" + sesion_id_user.toString();
	Llamar_HM(params, true, Rellenar_lista_caballos, Rellenar_lista_caballos_vacia);
}

function WS_Cargar_sexo_caballo() {
	var params = "WS_Cargar_sexo_caballo";
	Llamar_HM(params, false, Rellenar_cmb_sexo_caballo, null);
}

function WS_Guardar_caballo(nombre, dob, owner, sexo, id_caballo, edit) {
	var str_edit = "false";
	if (edit) {
		str_edit = "true";
	}
	var params = "WS_Guardar_caballo&jinete=" + sesion_id_user.toString() +  "&nombre=" + urlencode(nombre) + 
		"&dob=" + urlencode(dob) + "&owner=" + urlencode(owner) + "&sexo=" + sexo.toString() + 
		"&id_caballo=" + id_caballo.toString() + "&edit=" + str_edit;
	Llamar_HM(params, true, Actualizar_lista_caballos, null);
}

function WS_Cargar_caballo_id(id_caballo) {
	var params = "WS_Cargar_caballo_id&id_caballo=" + id_caballo.toString();
	Llamar_HM(params, true, Rellenar_ficha_caballo, function() {
		Comprobar_si_notification_is_show();
		Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
	});
}
