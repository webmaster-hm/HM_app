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
		var timeoutVal = 5000;
		navigator.geolocation.getCurrentPosition(Guardar_posicion,
				Reset_posicion, {
					enableHighAccuracy : true,
					timeout : timeoutVal,
					maximumAge : app_edad_cache_coords
				});
	} else {
		Reset_posicion();
	}
	return true;
}

function Reset_posicion() {
	app_latitud = app_latitud_defecto;
	app_longitud = app_longitud_defecto;
}

function Guardar_posicion(position) {
	app_latitud = position.coords.latitude;
	app_longitud = position.coords.longitude;
}

function Dibujar_mapa(latitude, longitude, div, bol_es_map_detail) {
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
	Lungo.Notification
			.confirm({
				icon : 'user',
				title : 'Go to external application',
				description : 'HM App go to open external application to view route map. Are you sure?',
				accept : {
					icon : 'checkmark',
					label : 'Yes',
					callback : function() {
						window.location.href = url;
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
	if (nombre.length > 0 && apellido.length > 0 && Validar_email(usuario)
			&& usuario.length > 0 && password.length > 0
			&& repeat_pass.length > 0 && password == repeat_pass) {
		// comprobar si existe el usuario en la base de datos
		var n_riders = $$('#frm-signup-riders').val();
		WS_Comprobar_usuario(usuario, password, nombre, apellido, n_riders);
	} else {
		if (nombre.length < 1) {
			Lungo.Notification.error('Error',
					'Ups! Your name is required field.', 'hm-sad', 2);
			$('#txtSignupName').select();
		} else if (apellido.length < 1) {
			Lungo.Notification.error('Error',
					'Ups! Your surname is required field.', 'hm-sad', 2);
			$('#txtSignupSurname').select();
		} else if (usuario.length < 1) {
			Lungo.Notification.error('Error',
					'Ups! Your email is required field.', 'hm-sad', 2);
			$('#txtSignupEmail').select();
		} else if (Validar_email(usuario) == false) {
			Lungo.Notification.error('Error', 'Ups! Your email is not valid.',
					'hm-sad', 2);
			$('#txtSignupEmail').select();
		} else if (password.length < 1) {
			Lungo.Notification.error('Error',
					'Ups! Your password is required field.', 'hm-sad', 2);
			$('#txtSignupPass').select();
		} else if (repeat_pass.length < 1 || password != repeat_pass) {
			$('#txtSignupRepeatPass').select();
			Lungo.Notification.error('Error',
					'Ups! You must repeat the password field.', 'hm-sad', 2);
		}
	}
}

function Reset_password() {
	var email = $$('#txtForgotEmail').val();
	if (Validar_email(email)) {
		WS_Reset_password(email);
	} else {
		Lungo.Notification.error('Error', 'Ups! Your email is not valid.',
				'hm-sad', 2);
		$('#txtForgotEmail').select();
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


