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
			Mostrar_error_defecto();
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
	var params = "WS_Cargar_detalle_evento&id=" + id.toString();
	Llamar_HM(params, true, false, function(data) {
		Rellenar_detail_event(data);
		Lungo.Router.section("detail-event");
	}, null);
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
	var params = "WS_Cargar_disciplinas";
	Llamar_HM(params, false, false, function(data) {
		if (bol_anadir_all) {
			Rellenar_combo(data, select, "All disciplines");
		} else {
			Rellenar_combo(data, select, "");
		}
	}, function() {
		// no hace nada porque se carga de forma invisible
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
	var params = "WS_Cargar_asociaciones";
	Llamar_HM(params, false, false, function(data) {
		if (bol_anadir_all) {
			Rellenar_combo(data, select, "All associations");
		} else {
			Rellenar_combo(data, select, "");
		}
	}, function() {
		// no hace nada porque se carga de forma invisible
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
	var params = "WS_Cargar_regiones&pais=" + pais;
	Llamar_HM(params, false, false, function(data) {
		if (bol_anadir_all) {
			Rellenar_combo(data, select, "All counties");
		} else {
			Rellenar_combo(data, select, "Select county");
		}
	}), function() {
		// no hace nada porque se carga de forma invisible
	};
}

/**
 * Loguea al usuario y guarda en storage el usuario y pass para que la proxima vez haga el login automatico
 * 
 */
function WS_Login() {
	// capturamos los valores de los input
	var usuario = $$('#txtLoginUser').val();
	var password = $$('#txtLoginPass').val();
	if (usuario===null) {
		Reset_valores_sesion();
		Mostrar_error_defecto('Ups! User and password are required fields.');
	} else {
		if (usuario.length > 0 && password.length > 0) {
			password = md5(password);
			var nav = Obtener_navegador();
			var params = "WS_Login&user=" + urlencode(usuario) + "&pass=" + urlencode(password)
					+ "&browser=" + urlencode(nav) + "&os=" + urlencode(navigator.userAgent);
			if (app_status_network) {
				Llamar_HM(params, true, true, function(data) {
					if (data.id > 0) {
						// Limpiamos los input
						Guardar_storage_user(usuario, $$('#txtLoginPass').val());
						sesion_id_user = data.id;
						sesion_nombre = data.nombre;
						sesion_perfil = data.perfil;
						$$("#span-username").text(sesion_nombre);
						Ocultar_notification();
						Cambiar_vista_segun_perfil();
						Lungo.Router.section("index-menu");	
					} else {
						Reset_valores_sesion();
						Mostrar_error_defecto("Ups! Your details are wrong.");
					}
				}, function() {
					Reset_valores_sesion();
					Mostrar_error_defecto('Ups! Your details are wrong or you can&apos;t connect with the Horse Monkey&apos;s Service.');
				});
			} else {
				Reset_valores_sesion();
				Mostrar_error_defecto('Ups! You are offline. You can&apos;t connect with the Horse Monkey&apos;s Service.');
			}
		} else {
			Reset_valores_sesion();
			Mostrar_error_defecto('Ups! User and password are required fields.');
		}	
	}
}

/**
 * 
 * @param tipo_terms,  hay 3 tipos de terminos: terms_buyers, terms_organisers, terms_privacy
 */
function WS_Leer_terms(tipo_terms) {
	var params = "WS_Terms&tipo_terms=" + tipo_terms;
	Llamar_HM(params, true, false, function(data) {
		if (data.texto!=null) {
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
		}
	}, null);
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
	var params = "WS_Comprobar_usuario&usuario=" + urlencode(usuario);
	Llamar_HM(params, true, true, function(data) {
		// existe, con lo cual está mal
		if (data.id>0) {
			Lungo.Notification.error("Error","Ups! This email has already been registered.","hm-sad", app_time_msg_error);
		} else if (data.id==0) {
			// en este caso el error es correcto porque significa que no existe
			Ocultar_notification();
			WS_Crear_usuario(usuario, password, nombre, apellido, riders);
		} else  {
			Lungo.Notification.error("Error","Ups! We have not been able to create your profile! " + 
					"Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
		}
	}, function() {
		Lungo.Notification.error("Error","Ups! We have not been able to create your profile! " + 
				"Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
	});
}

/**
 * Si se crea con exito se loguea automaticamente
 * @param usuario
 * @param password
 * @param nombre
 * @param apellido
 * @param riders, si es > 1 es que es yard
 * @returns
 */
function WS_Crear_usuario(usuario, password, nombre, apellido, riders) {
	var perfil = 2; // por defecto rider
	if (riders>1) {
		// es yard
		perfil = 3; // yard
	}
	var nav = Obtener_navegador();
	var params = "WS_Registro&usuario=" + urlencode(usuario) + "&pass=" + urlencode(md5(password)) + 
		"&perfil=" + perfil.toString() + "&nombre=" + urlencode(nombre) + "&apellido1=" + urlencode(apellido) + "&browser=" + urlencode(nav) + 
		"&os=" + urlencode(navigator.userAgent);  
	Llamar_HM(params, true, true, function(data) {
		if (data.id>0) {
			Ocultar_notification();
			Guardar_storage_user(usuario, password);
			Limpiar_form_registro();
			sesion_id_user = data.id;
			sesion_nombre = nombre + " " + apellido;
			sesion_perfil = perfil;
			Lungo.Router.section("index-menu");	
		} else {
			Lungo.Notification.error("Error","Ups! We have not been able to create your profile! " + 
				"Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
		}
	}, function() {
		Lungo.Notification.error("Error","Ups! We have not been able to create your profile! " + 
			"Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
	});
}

function WS_Reset_password(email) {
	var params = "WS_Reset_pass&email=" + urlencode(email);
	Llamar_HM(params, true, true, function(data) {
		if (data.id>0) {
			Lungo.Notification.success("Success", "We have forwarded your details by email. Check your mail and follow instructions.", "hm-happy", 
				app_time_msg_error, Abrir_login());
		} else {
			Lungo.Notification.error("Error","Oh No! We do not seem to find your email on our database. " + 
				"Please email us at contact@horsemonkey.com.","hm-sad", app_time_msg_error);
		}
	}, function() {
		Lungo.Notification.error('Error', 'Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.',
			'hm-sad', app_time_msg_error);
	});
}

/**
 * Carga el filtro de distancias
 * @param select,
 *            elemento del dom que es el select
 */
function WS_Cargar_filtro_distancia(select) {
	var params =  "WS_Cargar_filtro_distancia";
	Llamar_HM(params, false, false, function(data) {
		if (data.html!=null) Rellenar_combo_con_html(select, data.html);
	}, function() {
		// no hace nada, es invisible
	});
}

/**
 * Carga el filtro de varios
 * @param select,
 *            elemento del dom que es el select
 */
function WS_Cargar_filtro_varios(select) {
	var params = "WS_Cargar_filtro_varios";
	Llamar_HM(params, false, false, function(data) {
		if (data.html!=null) Rellenar_combo_con_html(select, data.html);
	}, function() {
		// no hace nada, invisible
	});
}

/**
 * Carga todos los venues para el desplegable
 * @param select, id del select
 * @param bol_anadir_all, true or false
 */
function WS_Cargar_venues(select, bol_anadir_all) {
	var params = "WS_Cargar_venues";
	Llamar_HM(params, false, false, function(data) {
		if (bol_anadir_all) {
			Rellenar_combo(data, select, "All venues");
		} else {
			Rellenar_combo(data, select, "");
		}
	}, function() {
		// no hace nada, invisible
	});
}

/**
 * Cargar info del evento para la inscripcion
 * @param id
 */
function WS_Cargar_info_event_para_inscrip(id_evento, id_inscrip, jinete) {
	var params = "WS_Cargar_info_evento_para_inscrip&id_evento=" + id_evento.toString()
	+ "&id_inscripcion=" + id_inscrip.toString() + "&jinete=" +  jinete.toString();
	Rellenar_clases_inscripcion_vacio();
	Rellenar_totales_inscripcion_vacia();
	Rellenar_servicios_inscripcion_vacia(true);
	Llamar_HM(params, true, false, function(data) {
		if (id_inscrip==0) {
			Comenzar_proceso_anadir_clase(id_evento);
		} else if (data.id>0) {
			Rellenar_my_inscrip_info_event(data);
			Rellenar_totales_inscripcion(data);
			if (id_inscrip>0) {
				// Cargar ahora las clases inscritas
				WS_Cargar_clases_inscrip(id_inscrip, false);
			} else {
				Lungo.Router.article("my-inscrip","art-my-inscrip-classes");	
			}
		}
	}, null);
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
	Llamar_HM(params, false, false, callback, callback_error);
}

/**
 * Carga las clases ya inscritas de la inscripcion
 * @param id_inscrip integer
 */
function WS_Cargar_clases_inscrip(id_inscrip, confirmado) {
	var params = "WS_Cargar_clases_inscrip&id=" + id_inscrip.toString()
	+ "&confirmado=" + ((confirmado) ? "1" : "0");	
	Llamar_HM(params, false, false, function(data) {
		//Rellenar lista de clases
		Rellenar_clases_inscripcion(data);
		// cargar ahora los servicios
		WS_Cargar_servicios_inscrip(id_inscrip, "art-my-inscrip-classes");
	}, function() {
		if (id_inscrip>0) {
			Mostrar_error_defecto();
		} else {
			WS_Cargar_servicios_inscrip(id_inscrip, "art-my-inscrip-classes");
		}
	});
}

/**
 * Carga los servicios ya comprados  de la inscripcion
 * @param id_inscrip integer
 */
function WS_Cargar_servicios_inscrip(id_inscrip, elemento_foco) {
	var params = "WS_Cargar_servicios_inscrip&id=" + id_inscrip.toString();
	Llamar_HM(params, false, false, function(data) {
		if (data.length>0) {
			Rellenar_servicios_inscripcion(data);
		}
		Lungo.Router.article("my-inscrip",elemento_foco);		
	}, function() {
		Lungo.Router.article("my-inscrip",elemento_foco);
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
	var params = "WS_Comprobar_puede_apuntarse&id=" + id_evento.toString();
	Llamar_HM(params, true, true, function(data) {
		if (data.estado==true || data.estado == "true") {
			Ocultar_notification();
			callback(data);
		} else {
			callback_error(param_error);
		}
	}, function() { 
		callback_error(param_error);
	});
}

/**
 * No muestra el loading, porque lo hace al principio de la aplicacion antes de loguearse incluso
 * @param callback
 */
function WS_Obtener_globales(callback, callback_error) {
	var params = "WS_Obtener_globales";
	Llamar_HM(params, false, false, function(data) {
		if (data.app_pais!=null) {
			callback(data);
		} else {
			callback_error();
		}
	}, function() {
		callback_error();	});
}

/**
 * Comprobacion por ws del pago confirmado en paypal
 * @param pay_id
 * @param callback
 * @param callback_error
 */
function WS_Comprobar_pago_paypal(pay_id, total_hm, paypal_fee, callback, callback_error) {
	var params = "WS_Comprobar_pago_paypal&pay_id=" +urlencode(pay_id) + 
		"&total_hm=" + urlencode(total_hm.toString()) + "&paypal_fee=" + urlencode(paypal_fee.toString());
	Llamar_HM(params, true, true, function(data) {
		if (data.id_inscrip>0) {
			Ocultar_notification();
			callback(data);		
		} else {
			callback_error();
		}
	}, function() {
		callback_error();
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
function WS_Validar_inscripcion_paypal(importe, id_inscrip, jinete, evento, perfil, callback, callback_error) {
	var params =  "WS_Validar_inscripcion&id_inscrip=" +id_inscrip.toString() + 
		"&jinete=" + jinete.toString() + "&evento=" + evento.toString() + "&perfil=" + perfil.toString();
	Llamar_HM(params, true, true, function(data) {
		if (data.estado == true || data.estado == "true") {
			Ocultar_notification();
			callback(importe, id_inscrip);
		} else {
			callback_error(data.estado, data.error_tipo, data.error_msg, data.clases);
		}
	}, function() {
		callback_error(false, "default", "Unsuccessful operation.");
	});
} 

function WS_Actualizar_direccion(usuario, direccion, direccion2, ciudad, cp, movil, region) {
	var params = "WS_Actualizar_direccion&usuario=" + usuario.toString() +  
		"&direccion=" + urlencode(direccion) + "&direccion2=" + urlencode(direccion2) + "&cp=" + cp + 
		"&ciudad=" + urlencode(ciudad) + "&movil=" + urlencode(movil) + "&region=" + region.toString() + 
		"&pais=" + app_pais.toString();
	Llamar_HM(params, true, true, function(data) {
		if (data.estado==true || data.estado == "true") {
			Ocultar_notification();
			Lungo.Router.back();	
		} else {
			Lungo.Notification.error("Error","Ups! We have not been able to create your profile! Please try again! " + 
				"Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
		}
	}, function() {
		Lungo.Notification.error("Error","Ups! We have not been able to update your address! " + 
			"Please try again! Don&apos;t forget to check your connection you must be online!!! ","hm-sad", app_time_msg_error);
	});
}

function WS_Cargar_direccion_usuario(callback, callback_error) {
	var params = "WS_Cargar_direccion_usuario&usuario=" + sesion_id_user.toString();
	Llamar_HM(params, true, true, function(data) {
		Ocultar_notification();
		if (data.id>0) {
			callback(data);
		} else {
			callback_error();
		}
	}, function() {
		Ocultar_notification();
		callback_error();
	});
}

function WS_Eliminar_clase(id_detalle, evento, id_inscripcion, callback) {
	var params = "WS_Eliminar_clase&id_detalle=" + id_detalle.toString() 
		+ "&jinete=" + sesion_id_user.toString() + "&id_evento=" + evento.toString() 
		+ "&id_inscripcion=" + id_inscripcion.toString();
	Llamar_HM(params, true, false, function(data) {
		if (data.estado==true || data.estado == "true") {
			callback(data);
		} else {
			Mostrar_error_defecto();
		}
	}, null);
}

function WS_Eliminar_servicio(id_detalle, evento, id_inscripcion, callback) {
	var params = "WS_Eliminar_servicio&id_detalle=" + id_detalle.toString() 
		+ "&jinete=" + sesion_id_user.toString() + "&id_evento=" + evento.toString() 
		+ "&id_inscripcion=" + id_inscripcion.toString();
	Llamar_HM(params, true, false, function(data) {
		if (data.estado==true || data.estado == "true") {
			callback(data);
		} else {
			Mostrar_error_defecto();
		}
	}, null);
}

function WS_Cargar_servicios_evento(id_evento, callback, callback_error) {
	var params = "WS_Cargar_servicios_evento&jinete=" + sesion_id_user.toString() + "&id_evento=" + 
		id_evento.toString();
	Llamar_HM(params, true, false, function(data) {
		if (data.length>0) {
			callback(data);
		} else {
			Mostrar_error_defecto();
		}
	}, null);
}

function WS_Anadir_productos_inscrip(id_evento, jinete, productos, cantidades, callback, callback_error) {
	var str_productos = "", str_cantidades = "";
	for (n=0;n<productos.length;n++) {
		str_productos += "&productos[]=" + productos[n];
		str_cantidades += "&cantidades[]=" + cantidades[n];
	}
	var params = "WS_Anadir_productos_inscrip&id_evento=" + id_evento.toString() +
		"&jinete=" + jinete.toString() + str_productos + str_cantidades;
	Llamar_HM(params, true, true, callback, callback_error);	
}

function WS_Cargar_info_evento_proceso_anadir_clase(id_evento) {
	var params = "WS_Cargar_info_evento_proceso_anadir_clase&id_evento=" + id_evento.toString() 
		+ "&perfil=" + sesion_perfil.toString() + "&jinete=" + sesion_id_user.toString();
	Llamar_HM(params, true, true, function (data) {
			if (data!=null) {
				Ocultar_notification();
				new_entry = JSON.parse( JSON.stringify(data));
				if ((new_entry['federacion']>0 && ((new_entry['req_hor_num'] && new_entry['hay_caballo']) || (new_entry['req_own_num'] && new_entry['hay_caballo']) 
						|| new_entry['req_rid_num'] || (new_entry['req_qualifier_num'] && new_entry['tipo_qualifier']==1))) 
						|| (new_entry['tipo_qualifier']==3 && new_entry['req_qualifier_num']) 
						|| ((new_entry['tipo_qualifier']==2 && new_entry['req_qualifier_num']) || new_entry['accept_dto'] || new_entry['req_ven_num'])) {
					new_entry['abrir_memberships'] = true;
				} else {
					new_entry['abrir_memberships'] = false;
				}
				if (new_entry['abrir_memberships']) {
					// el boton de Next Step en clases
					$$("#next-select-class").html("Next step <span class='icon arrow-right'></span>");
				} else {
					// en clases, el boton tiene que llamarse Confirm to continue
					$$("#next-select-class").html("Confirm to continue  <span class='icon arrow-right'></span>");
				}
				new_entry['paso_actual'] = 1;
				new_entry['clases'] = new Array();
				Comprobar_paso_a_ir();	
			} else {
				Mostrar_error_defecto();
			}
		}, 
		function (data) {
			Mostrar_error_defecto();
		}
	);
}

function WS_Cargar_clases_evento_disponibles(id_evento, id_caballo) {
	var params = "WS_Cargar_clases_evento_disponibles&id_evento=" + id_evento.toString() +
		"&id_caballo=" + id_caballo.toString() + "&jinete=" + sesion_id_user.toString();
	Llamar_HM(params, true, true, function(data) {
		Ocultar_notification();
		Rellenar_clases_disponibles_evento(data);
	}, function() {
		Mostrar_error_defecto("Ups! No classes available for this event now. Please try again later.");
		Abrir_inscripcion(id_evento);
	});	
}

function WS_Cargar_caballos_usuario() {
	var params = "WS_Cargar_caballos_usuario&jinete=" + sesion_id_user.toString();
	Llamar_HM(params, true, false, Rellenar_lista_caballos, Rellenar_lista_caballos_vacia);
}

function WS_Cargar_sexo_caballo() {
	var params = "WS_Cargar_sexo_caballo";
	Llamar_HM(params, false, false, Rellenar_cmb_sexo_caballo, null);
}

function WS_Cargar_sexo_jinetes() {
	var params = "WS_Cargar_sexo_jinetes";
	Llamar_HM(params, false, false, Rellenar_cmb_sexo, null);
}

/**
 * 
 * @param nombre
 * @param dob
 * @param owner
 * @param sexo
 * @param id_caballo
 * @param edit, si está editando o creando un caballo nuevo
 * @param viene_requisitos, significa que si tiene exito debe llamar al paso siguiente de la inscripcion
 * @param altura
 */
function WS_Guardar_caballo(nombre, dob, owner, sexo, id_caballo, edit, viene_requisitos, altura) {
	var str_edit = "false";
	if (edit) {
		str_edit = "true";
	}
	var params = "WS_Guardar_caballo&jinete=" + sesion_id_user.toString() +  "&nombre=" + urlencode(nombre) + 
		"&dob=" + urlencode(dob) + "&owner=" + urlencode(owner) + "&sexo=" + sexo.toString() + 
		"&id_caballo=" + id_caballo.toString() + "&edit=" + str_edit + "&altura=" + urlencode(altura);
	if (viene_requisitos) {
		Llamar_HM(params, true, false, function() {
			new_entry['paso_actual'] = 3;
			new_entry['owner'] = owner;
			Comprobar_paso_a_ir();
		}, null);	
	} else {
		Llamar_HM(params, true, false, Actualizar_lista_caballos, null);	
	}
}

function WS_Cargar_caballo_id(id_caballo) {
	var params = "WS_Cargar_caballo_id&id_caballo=" + id_caballo.toString();
	Llamar_HM(params, true, false, Rellenar_ficha_caballo, null);
}

function WS_Cargar_jinetes_usuario() {
	var params = "WS_Cargar_jinetes_usuario&yard=" + sesion_id_user.toString();
	Llamar_HM(params, true, false, Rellenar_lista_jinetes, Rellenar_lista_jinetes_vacia);
}

function WS_Cargar_subjinete_id(id_subjinete) {
	var params = "WS_Cargar_subjinete_id&subjinete=" + id_subjinete.toString();
	Llamar_HM(params, true, false, Rellenar_ficha_subjinete, null);
}

/**
 * 
 * @param nombre
 * @param dob
 * @param apellido1
 * @param sexo
 * @param id_subjinete
 * @param edit, si está editando o creando un rider  nuevo
 * @param viene_requisitos, significa que si tiene exito debe llamar al paso siguiente de la inscripcion
 */
function WS_Guardar_subjinete(nombre, apellido1, dob, sexo, id_subjinete, edit, viene_requisitos) {
	var str_edit = "false";
	if (edit) {
		str_edit = "true";
	}
	var params = "WS_Guardar_subjinete&jinete=" + sesion_id_user.toString() +  "&nombre=" + urlencode(nombre) + 
		"&dob=" + urlencode(dob) + "&apellido1=" + urlencode(apellido1) + "&sexo=" + sexo.toString() + 
		"&id_subjinete=" + id_subjinete.toString() + "&edit=" + str_edit;
	if (viene_requisitos) {
		Llamar_HM(params, true, false, function() {
			new_entry['paso_actual'] = 6; //ir a seleccionar clase
			Comprobar_paso_a_ir();
		}, null);	
	} else {
		Llamar_HM(params, true, false, Actualizar_lista_subjinetes, null);	
	}
}

function WS_Cargar_my_profile() {
	var params = "WS_Cargar_my_profile&id=" + sesion_id_user.toString();
	Llamar_HM(params, true, false, Rellenar_ficha_profile, null);
}

function WS_Guardar_my_profile(nombre, apellido1, dob, sexo, viene_requisitos) {
	var params = "WS_Guardar_my_profile&id=" + sesion_id_user.toString() +  "&nombre=" + urlencode(nombre) + 
	"&dob=" + urlencode(dob) + "&apellido1=" + urlencode(apellido1) + "&sexo=" + sexo.toString();
	if (viene_requisitos) {
		Llamar_HM(params, true, false, function() {
			new_entry['paso_actual'] = 6; //ir a seleccionar clase
			Comprobar_paso_a_ir();
		}, null);	
	} else {
		Llamar_HM(params, true, false, function () {
			Lungo.Router.back();	
		}, null);
	}
}

function WS_Cargar_niveles_disc(federacion) {
	var params = "WS_Cargar_niveles_disc&federacion=" + federacion.toString();
	app_niveles_disc = [];
	Llamar_HM(params, false, false, function(data) {
		if (data.length>0) {
			for (var i = 0; i < data.length; i++) {
				// cambiamos N por LVL
				if (data[i].inicial=="N") {
					data[i].inicial = "LvL";
				}
				app_niveles_disc.push	(new Array(data[i].id, data[i].nombre, data[i].inicial));
			}
		}
	}, null);
}

function WS_Cargar_memberships(id_evento, subjinete, caballo) {
	var params = "WS_Cargar_memberships&evento=" + id_evento.toString() + "&jinete=" + sesion_id_user.toString() + 
		"&subjinete=" + subjinete.toString() + "&caballo=" + caballo.toString() + "&perfil=" + sesion_perfil.toString();
	Llamar_HM(params, true, false, Rellenar_select_memberships, null);
}

function WS_Actualizar_memberships_y_validar(subjinete, caballo, federacion, horse_num, owner_num, rider_num, 
		venue_num, qualy_num, id_evento, tipo_qualy) {
	new_entry['horse_num'] = "";
	new_entry['owner_num'] = "";
	new_entry['venue_num'] = "";
	new_entry['qualy_num'] = "";
	var params = "WS_Actualizar_memberships_y_validar&jinete=" + sesion_id_user.toString() + "&subjinete=" + subjinete.toString() + 
		"&caballo=" + caballo.toString() + "&federacion=" + federacion.toString() + "&horse_num=" + urlencode(horse_num) + 
		"&owner_num=" + urlencode(owner_num) + "&rider_num=" + urlencode(rider_num) + 
		"&venue_num=" + urlencode(venue_num) + "&qualy_num=" + urlencode(qualy_num) + 
		"&id_evento=" + id_evento.toString() + "&tipo_qualifier=" + tipo_qualy.toString();
	Llamar_HM(params, true, true, function(data) {
		if (data.estado==ws_msg_error) {
			Mostrar_error_html(data.msg, "hm-sad", "Close");	
		} else {
			Ocultar_notification();
			new_entry['paso_actual'] = 8;
			new_entry['horse_num'] = horse_num;
			new_entry['owner_num'] = owner_num;
			new_entry['venue_num'] = venue_num;
			new_entry['qualy_num'] = qualy_num;
			Comprobar_paso_a_ir();			
		}
	}, null);
}

/**
 * Añade los datos de new_entry y valida el aforo y si está repetida la clase con caballo
 */
function WS_Anadir_clase_inscripcion() {
	var clases = "";
	var niveles = "";
	for (n=0;n<new_entry["clases"].length;n++) {
		clases += "&clases[]=" + new_entry["clases"][n].clase;
		niveles += "&niveles[]=" + new_entry["clases"][n].nivel;
	}
	var params = "WS_Anadir_clase_inscrip&jinete=" + sesion_id_user.toString() + "&id_evento=" + new_entry["id"].toString() + 
		clases + niveles + "&id_cab1=" + new_entry["id_caballo"] + "&venue_member=" + urlencode(new_entry["venue_num"]) + 
		"&num_cab=" + urlencode(new_entry["horse_num"]) + "&num_owner=" + urlencode(new_entry["owner_num"]) + 
		"&org_member=" + urlencode(new_entry["venue_num"]) + 
		"&subjinete=" + new_entry["id_jinete"].toString() + "&qualifier_number=" + urlencode(new_entry["qualy_num"]);
	evento = new_entry["id"];
	Llamar_HM(params, true, true, function(data) {
		if (data.msg!=null) {
			// exito al enviar pero error al insertar
			if (data.clases!=null) {
				Apuntar_lista_espera_clase_full(data.msg, data.clases, true);
			} else {
				Mostrar_error_defecto(data.msg);	
			}
		} else {
			//new_entry = new Array();
			Ocultar_notification();
			Modificar_history_back("my-inscrip", "detail-event");
			Abrir_inscripcion(evento);	
		}
	}, function(data) {
		if (data.clases!=null) {
			Apuntar_lista_espera_clase_full(data.msg, data.clases, true);
		} else {
			Mostrar_error_defecto(data.msg);	
		}
	}, true);
}

function WS_Cargar_formas_pago() {
	var params = "WS_Cargar_formas_pago";
	Llamar_HM(params, false, false, function(data) {
		sesion_fpago = data;
	}, null);
}

function WS_Cargar_totales_inscrip(id_evento, id_inscrip, jinete, callback) {
	var params = "WS_Cargar_totales_inscrip&id_evento=" + id_evento.toString()
			+ "&id_inscripcion=" + id_inscrip.toString() + "&jinete=" +  jinete.toString();
	Llamar_HM(params, true, false, callback, null);
}

function WS_Comenzar_pago_sagepay(id_inscripcion, amount, comision_debito, comision_credito) {
	var params = "WS_Comenzar_pago_sagepay&id_inscripcion=" + id_inscripcion.toString() + 
		"&amount=" + amount.toString() + "&usuario=" + sesion_id_user.toString() + 
		"&comision_debito=" + comision_debito.toString() + "&comision_credito=" + comision_credito.toString();
	Llamar_HM(params, true, false, function(data) {
		$$("#sagepay-iframe-inscripid").val(id_inscripcion);
		Abrir_para_iframe_sagepay(data);
	}, null);
}

function WS_Validar_inscripcion_sagepay(total, id_inscripcion, id_evento, comision_debito, comision_credito) {
	var params = "WS_Validar_inscripcion" + "&id_inscrip=" +id_inscripcion.toString() + 
		"&jinete=" + sesion_id_user.toString() + "&evento=" + id_evento.toString() + "&perfil=" + sesion_perfil.toString();	
	Llamar_HM(params, false, false, function(data) {
		if (data.error == ws_msg_error) {
			Error_validacion_compra(false, "default", "Unsuccessful operation.", "");
		} else if (data.estado==true || data.estado == "true") {
			WS_Comenzar_pago_sagepay(id_inscripcion, total, comision_debito, comision_credito);
		} else {
			Error_validacion_compra(data.estado, data.error_tipo, data.error_msg, data.clases);
		}
	}, null);
}

function WS_Cargar_entries_usuario() {
	var params = "WS_Cargar_entries_usuario&usuario=" + sesion_id_user.toString();
	Llamar_HM(params, true, false, Rellenar_my_entries, null);
}

function WS_Cargar_info_view_entry(id_evento, id_inscrip) {
	var params = "WS_Cargar_info_view_entry&usuario=" + sesion_id_user.toString() +
		"&id_evento=" + id_evento.toString() + "&id_inscripcion=" + id_inscrip.toString();
	 Llamar_HM(params, true, false, function(data) {
		 Rellenar_view_entry(data);
	 }, null);
	
}

function WS_Descargar_fichero(elemento, url_params) {
	Llamar_HM(url_params, true, false, function(data) {
		Descargar_fichero(app_u, data.fichero, data.nombre, elemento);
	}, null);
}

function WS_Generar_schedule(id_evento) {
	var params = "WS_Generar_schedule&evento=" + id_evento.toString();
	WS_Descargar_fichero("#content-view-entry-docs", params);
}

function WS_Generar_entry_form(id_inscripcion) {
	var params = "WS_Generar_entry_form&id_inscripcion=" + id_inscripcion.toString();
	WS_Descargar_fichero("#content-view-entry-docs", params);
}

function WS_Generar_invoice(id_inscripcion) {
	var params = "WS_Generar_invoice&id_inscripcion=" + id_inscripcion.toString();
	WS_Descargar_fichero("#content-view-entry-docs", params);
}

function WS_Descargar_times(id_evento) {
	var params = "WS_Descargar_times&evento=" + id_evento.toString();
	WS_Descargar_fichero("#content-view-entry-docs", params);
}

function WS_Unir_lista_espera(clases, bol_volver_atras) {
	var params = "WS_Unir_lista_espera&jinete=" + sesion_id_user.toString();
	var clases_param = "";
	if (clases.length>0) {
		for (n=0;n<clases.length;n++) {
			clases_param += "&id_clase[]=" + clases[n].id_clase;
		}	
	} else {
		clases_param = "&id_clase[]=" + clases.id_clase;
	}
	params += clases_param;
	Llamar_HM(params, true, true, function(data) {
		if (data.estado==true || data.estado=="true") {
			Mostrar_error_html(data.mensaje, "hm-happy", "Close");
		} else {
			Mostrar_error_defecto(data.mensaje);
		}
		if (bol_volver_atras) Lungo.Router.back();
	}, function() {
		Mostrar_error_defecto();
		if (bol_volver_atras) Lungo.Router.back();
	});
}

function WS_Ver_notas_clase(id_clase, ver_en_nivel) {
	var params = "WS_Ver_notas_clase&id_clase=" + id_clase.toString();
	$$("#content-select-level-notes").html("");
	Llamar_HM(params, true, false, function(data) {
		if (data.notas!=null) {
			if (data.notas.length>0) {
				var html = "";
				html += "<div class='box box-card'><span class='bold700'>" + data.nombre + "</span><div class='divisor-class'></div>" + nl2br(data.notas) + "</div>";
				if (ver_en_nivel) {
					$$("#content-select-level-notes").html(html);
				} else {
					html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div><br/>" + html;
					Ver_doc("Notes", html);	
				}
			}
		}
		if (ver_en_nivel) Abrir_select_lvl(id_clase);
	}, function() { 
		// no pasa nada
		if (ver_en_nivel) Abrir_select_lvl(id_clase);
	});
}

function WS_Leer_info_para_join_waiting_list(id_clase) {
	var params = "WS_Leer_info_para_join_waiting_list&id_clase=" + id_clase.toString();
	Llamar_HM(params, false, false, function(data) {
		if (data.estado==true || data.estado=='true') {
			Apuntar_lista_espera_clase_full(data.msg, data.clases, false);	
		}
	}, null);
}

function WS_Send_email(nombre, origen, destino, asunto, cuerpo, callback, callback_error) {
	var params = "WS_Send_email&nombre=" + urlencode(nombre) + "&origen=" + urlencode(origen) + 
		"&destino=" + urlencode(destino) + "&asunto=" + urlencode(asunto) + "&cuerpo=" + urlencode(cuerpo);
	Llamar_HM(params, true, true, callback, callback_error);
}

function WS_Comprobar_fecha_token(fecha, callback, callback_error) {
	var params = "WS_Comprobar_fecha_token&fecha=" + urlencode(fecha);
	var url = ws_hm + params;
	$$.ajax({
		type : 'POST', // defaults to 'GET'
		url : url,
		dataType : 'json', // 'json', 'xml', 'html', or 'text'
		async : true,
		crossDomain : true,
		success : function(data) {
			if (data.estado==true || data.estado=='true') {
				app_status_token_ok = true;
				callback();	
			} else {
				callback_error();
			}
		},
		error : function(xhr, type) {
			callback_error();
		}
	});
}

function WS_Cargar_my_results() {
	var params = "WS_Cargar_my_results&usuario=" + sesion_id_user.toString();
	Llamar_HM(params, true, false, Rellenar_my_results,null);
}

function WS_Descargar_results(id_evento) {
	var params = "WS_Descargar_results&evento=" + id_evento.toString();
	WS_Descargar_fichero("#content-my-results", params);
}

function WS_Actualizar_notas_secretario(notas, id_inscripcion, callback) {
	var params = "WS_Actualizar_notas_secretario&notas=" + urlencode(notas) + "&id_inscripcion=" + id_inscripcion.toString();
	Llamar_HM(params, true, true, callback, null);
} 

