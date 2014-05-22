function Iniciar_variables_globales() {
	app_search_from = new Date();
	app_search_to = Sumar_dias_a_date(new Date(), app_dias_vista);
	Calcular_posicion();
}

function Cerrar_aside() {
	Lungo.Aside.hide();
}

/* siempre devuelve true */
function Calcular_posicion() {
	if (navigator.geolocation) {
		var timeoutVal = 15000; // 15 secs
		navigator.geolocation.getCurrentPosition(Guardar_posicion,
				Reset_posicion, {
					enableHighAccuracy : false,
					timeout : timeoutVal,
					maximumAge : app_edad_cache_coords
				});
	} else {
		Reset_posicion();
	}
	return true;
}

function Reset_posicion(error) {
	if (error!=null) {
		console.log(error.message);
	}
	app_latitud = app_latitud_defecto;
	app_longitud = app_longitud_defecto;
}

function Guardar_posicion(position) {
	app_latitud = position.coords.latitude;
	app_longitud = position.coords.longitude;
}

function Comprobar_estado_gps(bol_mostrar_mensaje) {
	var bolOk = false;
	if (app_es_IOS) {
		bolOk = true;
	} else if (app_es_Android) {
		navigator.geolocation.isGPSEnabled(function () {
			console.log("gps on");
			bolOk = true; 
		}, function() {
			if (bol_mostrar_mensaje) {
				//Ups! Your telephone cannot find you!! Please activate Location services in your phone settings so Monkey can calculate the route!
				//Comprobar_si_notification_is_show();
				Mostrar_error_defecto("Ups! Your telephone cannot find you!! Please activate Location services in your device settings so Monkey can calculate the route!", 
						app_medium_time_msg_error);
			} else {
				console.log("gps off");
			}
			bolOk = false;
		});	
	}
	return bolOk;
}

function Dibujar_mapa(latitude, longitude, div, bol_es_map_detail) {
	if (window.google) {
		app_google_coords = new google.maps.LatLng(latitude, longitude);
		var map_tmp = null;
		var markers_tmp = [];
		if (bol_es_map_detail) {
			map_tmp = map_detail;
			markers_tmp = map_detail_markersArray;
		} else {
			map_tmp = map;
			markers_tmp = map_markersArray;
		}
		if (map_tmp == null) {
			// Enable the visual refresh
			google.maps.visualRefresh = true;
			var mapOptions = {
				zoom : 7,
				center : app_google_coords,
				mapTypeControl : false,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				backgroundColor : '#FFFFFF',
				disableDefaultUI : true,
				mapTypeControlOptions : {
					style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
				},
				navigationControl : false,
				navigationControlOptions : {
					style : google.maps.NavigationControlStyle.DEFAULT
				},
				scaleControl : false,
				streetViewControl : false,
				draggable : false,
				scrollwheel : true,
				disableDoubleClickZoom : false
			};

			// create the map, and place it in the HTML map div
			map_tmp = new google.maps.Map(document.getElementById(div), mapOptions);
			// place the initial marker
			var marker = new google.maps.Marker({
				position : app_google_coords,
				map : map_tmp,
				title : "Current location!"
			});
			markers_tmp.push(marker);
			map_tmp.setCenter(app_google_coords);
		} else {
			// si ya existe el mapa, limpiar markers
			limpiarMarkers(markers_tmp);
			// place the initial marker
			var marker = new google.maps.Marker({
				position : app_google_coords,
				map : map_tmp,
				title : "Current location!"
			});
			markers_tmp.push(marker);
			map_tmp.setCenter(app_google_coords);
		}
		if (bol_es_map_detail) {
			map_detail = map_tmp;
			map_detail_markersArray = markers_tmp;
		} else {
			map = map_tmp;
			map_markersArray = markers_tmp;
		}
	} else {
		Dibujar_mapa_vacio();
	}
}

function limpiarMarkers(tmp) {
	if (tmp != null) {
		for (var i = 0; i < tmp.length; i++) {
			tmp[i].setMap(null);
		}
	}
}

/*
 * function Pintar_ruta(lat_orig, long_orig, lat_dest, long_dest) { if
 * (map_detail != undefined) { lat_orig = 51.5075256; long_orig =
 * -0.12794959999996536; directionsService = new
 * google.maps.DirectionsService(); directionsDisplay = new
 * google.maps.DirectionsRenderer(); directionsDisplay.setMap(map_detail); var
 * origen = new google.maps.LatLng(lat_orig, long_orig); var destino = new
 * google.maps.LatLng(lat_dest, long_dest); var request = { origin : origen,
 * destination : destino, travelMode : google.maps.DirectionsTravelMode.DRIVING,
 * region: "uk" }; directionsService.route(request, function(result, status) {
 * if (status == google.maps.DirectionsStatus.OK) {
 * directionsDisplay.setMap(map_detail);
 * directionsDisplay.setDirections(result); } }); } }
 */

function Confirmar_abrir_maps(url) {
	if (Comprobar_estado_gps(true)) {
		//Comprobar_si_notification_is_show();
		if (app_latitud!=0 && app_longitud!=0) {
			Lungo.Notification.confirm({
				icon : 'hm-rider',
				title : 'Go to external application',
				description : 'HM App go to open external application to view route map. Are you sure?',
				accept : {
					icon : 'checkmark',
					label : 'Yes',
					callback : function() {
						if (app_es_IOS) {
							window.open(url, '_system','location=yes');
						} else {
							navigator.app.loadUrl(url, {openExternal : true});	
						}
					}
				},
				cancel : {
					icon : 'close',
					label : 'Cancel',
					callback : function() {
						return false;
					}
				}
			});	
		} else {
			Lungo.Notification.success("Warning", "Please wait your device is trying to locate you!", "time", 
					app_long_time_msg_error, Calcular_posicion);
		}
	}
}

/**
 * Comprobamos que existan en local storage los datos del usuario Devuelve un
 * array con user, pass o null si no estan
 */
function Comprobar_storage_user() {
	var user = window.localStorage.getItem("user");
	var pass = window.localStorage.getItem("pass");
	var arr = null;
	if (user != null && user.length > 0 && pass.length > 0) {
		var decrypted = CryptoJS.AES.decrypt(pass, app_token_key);
		arr = new Array(user, decrypted.toString(CryptoJS.enc.Utf8));
	}
	return arr;
}

function Guardar_storage_user(user, pass) {
	window.localStorage.removeItem("user");
	window.localStorage.removeItem("pass");
	if (user.length > 0 && pass.length > 0) {
		var encrypted = CryptoJS.AES.encrypt(pass, app_token_key);
		window.localStorage.setItem("user", user);
		window.localStorage.setItem("pass", encrypted);
	}
}

function Salir_app() {
	if (navigator.app) {
		navigator.app.exitApp();
	} else if (navigator.device) {
		navigator.device.exitApp();
	} else {
		Logout();
	}
}

function Crear_cuenta() {
	// primero hay que validar los datos suministrados
	var usuario = $$('#txtSignupEmail').val();
	var password = $$('#txtSignupPass').val();
	var repeat_pass = $$('#txtSignupRepeatPass').val();
	var nombre = $$('#txtSignupName').val();
	var apellido = $$('#txtSignupSurname').val();
	nombre = nombre.trim();
	usuario = usuario.trim();
	password = password.trim();
	repeat_pass = repeat_pass.trim();
	apellido = apellido.trim();
	if (nombre.length > 0 && apellido.length > 0 && Validar_email(usuario)
			&& usuario.length > 0 && password.length > 0
			&& repeat_pass.length > 0 && password == repeat_pass) {
		// comprobar si existe el usuario en la base de datos
		var n_riders = $$('#frm-signup-riders').val();
		WS_Comprobar_usuario(usuario, password, nombre, apellido, n_riders);
	} else {
		if (nombre.length < 1) {
			Mostrar_error_defecto('Ups! Your name is required field.');
			document.getElementById("txtSignupName").select();
			//$('#txtSignupName').select();
		} else if (apellido.length < 1) {
			Mostrar_error_defecto('Ups! Your surname is required field.');
			document.getElementById("txtSignupSurname").select();
			//$('#txtSignupSurname').select();
		} else if (usuario.length < 1) {
			Mostrar_error_defecto('Ups! Your email is required field.');
			document.getElementById("txtSignupEmail").select();
			//$('#txtSignupEmail').select();
		} else if (Validar_email(usuario) == false) {
			Mostrar_error_defecto('Ups! Your email is not valid.');
			document.getElementById("txtSignupEmail").select();
			//$('#txtSignupEmail').select();
		} else if (password.length < 1) {
			Mostrar_error_defecto('Ups! Your password is required field.');
			document.getElementById("txtSignupPass").select();
			//$('#txtSignupPass').select();
		} else if (repeat_pass.length < 1 || password != repeat_pass) {
			document.getElementById("txtSignupRepeatPass").select();
			//$('#txtSignupRepeatPass').select();
			Mostrar_error_defecto('Ups! You must repeat the password field.');
		}
	}
}

function Reset_password() {
	var email = $$('#txtForgotEmail').val();
	if (Validar_email(email)) {
		WS_Reset_password(email);
	} else {
		Mostrar_error_defecto('Ups! Your email is not valid.');
		document.getElementById("txtForgotEmail").select();
		//$('#txtForgotEmail').select();
	}
}

function Generar_token() {
	var texto = "";
	/* formar texto con una cadena a comprobar despues */
	texto = token_ws;
	fecha = Fecha_UTC();
	texto += "_" + fecha[0] + "_" + fecha[1] + "_" + fecha[2] + "_" + fecha[3] + "_" + fecha[4]; 
	var semilla = app_token_key;
	var suma = 0;
	var newtexto = "";
	for (x = 0; x < semilla.length; x++) {
		suma += semilla.charCodeAt(x);
	}
	semilla = suma.toString();
	suma = 0;
	for (z = 0; z < semilla.length; z++) {
		suma += parseInt(semilla.charAt(z));
	}
	semilla = parseInt(suma);
	for (y = 0; y < texto.length; y++) {
		if (texto.charCodeAt(y) + semilla > 126) {
			suma = ((texto.charCodeAt(y) + semilla) - 126) + 31;
		} else {
			suma = (texto.charCodeAt(y) + semilla);
		}
		newtexto += String.fromCharCode(suma)
	}
	return newtexto;
}

function Cambiar_input_number(elemento, bol_sumar) {
	var valor = parseInt($$(elemento).val());
	if (isNaN(valor)) {
		valor = 0;
		$$(elemento).val(valor.toString());
	}
	if (bol_sumar) {
		valor += 1;
		$$(elemento).val(valor.toString());
	} else {
		if (valor>0) {
			valor -= 1;
			$$(elemento).val(valor.toString());
		} else {
			valor = 0;
			$$(elemento).val(valor.toString());
		}	
	} 
}

/**
 * 
 * @param params, sin el token
 * @param mostrar_loading, boolean, para que muestre el icono de carga
 * @param controlo_mensajes, boolean, si es true, significa que no tengo que hacer el hide de notification, porque mostrare los msgs de exito y error
 * @param callback
 * @param callback_error
 * @param pasar_data_a_error, boolean, pasa "data" a callback error
 */
function Llamar_HM(params, mostrar_loading, controlo_mensajes, callback, callback_error, pasar_data_a_error) {
	if (app_status_network) {
		if (app_status_token_ok) {
			var token = urlencode(Generar_token());
			var url = ws_hm + params + "&token=" + token;
			if (mostrar_loading) Lungo.Notification.show();
			$$.ajax({
				type : 'POST', // defaults to 'GET'
				url : url,
				dataType : 'json', // 'json', 'xml', 'html', or 'text'
				async : true,
				crossDomain : true,
				success : function(data) {
					if (data==null || data=="") {
						if (callback_error!=null) {
							if (mostrar_loading && !controlo_mensajes) Lungo.Notification.hide();
							if (pasar_data_a_error) {
								callback_error(data);	
							} else {
								callback_error();
							}
						} else {
							if (mostrar_loading) {
								Mostrar_error_defecto('Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.');
							}
						}
					} else if (data.error == ws_msg_error) {
						if (callback_error!=null) {
							if (mostrar_loading && !controlo_mensajes) Lungo.Notification.hide();
							if (pasar_data_a_error) {
								callback_error(data);	
							} else {
								callback_error();
							}
						} else {
							if (mostrar_loading) {
								Mostrar_error_defecto('Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.');
							}
						}
					} else {
						if (mostrar_loading && !controlo_mensajes) Lungo.Notification.hide();
						callback(data);	
					}
				},
				error : function(xhr, type) {
					if (mostrar_loading && !controlo_mensajes) Lungo.Notification.hide();
					if (callback_error!=null) {
						callback_error();
					} else {
						if (mostrar_loading) {
							Mostrar_error_defecto('Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.');
						}
					}
				}
			});	
		} else {
			Mostrar_error_fecha_invalida();
		}			
	} else {
		// no hay conexion
	}
}

function Comprobar_si_notification_is_show() {
	if (!$$("div.notification").hasClass("show")) {
		Lungo.Notification.show();
	}
}

function Comprobar_si_notification_is_hide() {
	if ($$("div.notification").hasClass("show")) {
		Lungo.Notification.hide();
	}
}

function Ocultar_notification() {
	Lungo.Notification.hide();
}

function Mostrar_error_defecto(msg, time) {
	Comprobar_si_notification_is_show();
	if (msg==null || msg=="") {
		msg = "Unsuccessful operation";
	}
	if (time==null) {
		time = app_time_msg_error;
	}
	Lungo.Notification.error("Error", msg,"hm-sad", time);	
}

function Mostrar_error_html(html, icono, texto_boton) {
	Comprobar_si_notification_is_show();
	Lungo.Notification.html(Generar_notification_html(html, icono), texto_boton);		
}

/**
 * Pagina es hasta donde quiero borrar el historico, pagina2 es una alternativa, porque puede ser que no exista la pagina, 
 * por ejemplo, my-inscrip no existe si no tiene ninguna clase y se accede desde detail-event
 * @param pagina
 * @param pagina2
 */
function Modificar_history_back(pagina, pagina2) {
	var arr_pages = Lungo.Router.pages;
	for (n=arr_pages.length-1;n>0;n--) {
		if (arr_pages[n]==pagina || arr_pages[n]==pagina2) {
			break;
		} else {
			arr_pages.pop();
		}
	}
}

function Comprobar_paso_a_ir() {
	if (new_entry['abierto'] && new_entry['libres']>0) {
		switch (new_entry['paso_actual']) {
			case 1:
				/* seleccionar caballo */
				/* cargar disciplinas por nivel si es de tipo lleva lvl */
				if (new_entry['lleva_lvl']) {
					WS_Cargar_niveles_disc(new_entry['federacion']);
				}
				if (new_entry['competicion']==3) {
					// llamar a las funciones del paso 3
					new_entry['paso_actual'] = 3;
					Comprobar_paso_a_ir();
				} else {
					Abrir_select_horse();
				}
				break;
			case 2:
				/* requisitos de caballo de dob o owner name */
				// con uno de los dos que vaya a este formulario del caballo se rellenan los dos
				if (new_entry['req_owner_name'] && new_entry['id_caballo']>0) {
					Comprobar_owner_caballo(new_entry['id_caballo']);
				} else if (new_entry['req_horse_dob'] && new_entry['id_caballo']>0) {
					Comprobar_check_dob_caballo(new_entry['id_caballo']);
				} else if (new_entry['req_horse_height'] && new_entry['id_caballo']>0) {
					Comprobar_altura_caballo(new_entry['id_caballo']);
				} else {
					// llamar a funciones del paso 3
					new_entry['paso_actual'] = 3;
					Comprobar_paso_a_ir();
				}
				break;
			case 3: 
				/* si es yard, seleccionar rider */
				if (sesion_perfil==3) {
					Abrir_select_rider();
				} else {
					new_entry['paso_actual'] = 5;
					Comprobar_paso_a_ir();
				}
				break;
			case 4:
				/* si es yard, requisitos de dob del rider */
				if (sesion_perfil==3) {
					if (new_entry['req_rider_dob'] && new_entry['id_jinete']>0)  {
						// check rider dob
						Comprobar_check_dob_subjinete(new_entry['id_jinete']);
					} else {
						new_entry['paso_actual'] = 6;
						Comprobar_paso_a_ir();
					}
				} else {
					new_entry['paso_actual'] = 5;
					Comprobar_paso_a_ir();
				}
				break;
			case 5: 
				/* si no es yard, requisito de dob del rider */
				if (sesion_perfil!=3) {
					if (new_entry['req_rider_dob']) {
						// check dob del profile
						Comprobar_check_dob_profile();
					} else {
						new_entry['paso_actual'] = 6;
						Comprobar_paso_a_ir();
					}
				} else {
					new_entry['paso_actual'] = 6;
					Comprobar_paso_a_ir();
				}
				break;
			case 6:
				/* seleccionar clase */
				
				WS_Cargar_clases_evento_disponibles(new_entry['id'], new_entry['id_caballo']);
				break;
			case 7:
				/* requisitos de membership associations, org memberships y qualifier*/
				if (new_entry['abrir_memberships']) {
					WS_Cargar_memberships(new_entry['id'], new_entry['id_jinete'], new_entry['id_caballo']);
				} else {
					new_entry['paso_actual'] = 8;
					Comprobar_paso_a_ir();
				}
				break;
			case 8:
				/* validar inscripcion */
				WS_Anadir_clase_inscripcion();
				break;				
		}
	}
}

function Buscar_elemento_sesion_fpago(id_buscar) {
	var n = 0;
	for (n=0;n<sesion_fpago.length;n++) {
		if (sesion_fpago[n]["id"]==id_buscar.toString()) {
			return sesion_fpago[n];
		}
	}
	return null;
}

function Comprobar_volver_atras_sagepay(id_inscripcion) {
	WS_Leer_datos("confirmado", "v_inscripcion", " id = " + id_inscripcion.toString(), "", function (data) {
			if (data[0]["confirmado"] ==1 || data[0]["confirmado"]=="1") {
				Modificar_history_back("my-inscrip", "detail-event");
				Lungo.Router.section("my-entries");
			} else {
				Lungo.Router.back();	
			}
		},
		function () {
			Lungo.Router.back();
		}
	);
}

/**
 * 
 * @param url, hace falta si no es debug
 * @param fichero, hace falta siempre, no es el nombre exacto del fichero, lleva la ruta de la carpeta files en web
 * @param nom_fichero, nombre real del fichero sin carpetas
 * @param elemento_dom, hace falta si es debug, para el iframe
 */
function Descargar_fichero(url, fichero, nom_fichero, elemento_dom) {
	if (app_es_Web) {
		// modo web
		$$("#my_down").remove();
		$$(elemento_dom).append("<iframe id='my_down' style='visibility: hidden; display:none;' src='" + app_u + "down/" + 
				fichero + "'></iframe>");
	} else {
		// modo produccion
		var url = encodeURI(app_u + fichero);
		var ft = new FileTransfer();
		ft.download(url, app_ruta_docs + nom_fichero,
	            function(entry) {
					window.resolveLocalFileSystemURL(app_ruta_docs + nom_fichero, function(fileEntry) {
						window.fileOpener.open(fileEntry.nativeURL, Mostrar_error_defecto);	
					}, Mostrar_error_defecto);
	            },
	            function(error) {
	                Mostrar_error_defecto();
	            }
	        );
	}
}

