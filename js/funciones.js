
/* LLAMADAS A SECCIONES */

function Go_home() {
	Lungo.Router.section("index-menu");
}

function Abrir_next_events() {
	WS_Cargar_next_events();
}

function Abrir_detalle_evento(id) {
	WS_Cargar_detail_event(id);
}

function Abrir_search_events() {
	Lungo.Router.section("search-events");
}

function Abrir_fav_events() {
	WS_Cargar_events_favs();
}

function Abrir_eventos_cercanos() {
	WS_Cargar_events_near();	
}

function Abrir_select_date(bol_es_from) {
	if (bol_es_from) {
		// el atributo rel del calendar es from, para saber donde debe devolver
		// el valor
		$$("#calendar").attr("rel", "from");
		$$("#select-date header > h1").text("Select From");
		cal_objeto.goto(app_search_from.getMonth(), app_search_from.getFullYear());
		$$('#custom-month').html(cal_objeto.getMonthName());
		$$('#custom-year').html(cal_objeto.getYear());
	} else {
		// el atributo rel del calendar es to
		$$("#calendar").attr("rel", "to");
		$$("#select-date header > h1").text("Select To");
		cal_objeto.goto(app_search_to.getMonth(), app_search_to.getFullYear());
		$$('#custom-month').html(cal_objeto.getMonthName());
		$$('#custom-year').html(cal_objeto.getYear());
	}
	Lungo.Router.section("select-date");
}

function Buscar_eventos() {
	var disc = 0, region = 0, asociacion = 0, distancia = 0, otros = 0, venue = 0;
	var desde = "", hasta = "";
	desde = $$("#frm-search-from").val();
	hasta = $$("#frm-search-to").val();
	disc = $$("#frm-search-disc").val();
	asociacion = $$("#frm-search-asoc").val();
	region = $$("#frm-search-county").val();
	distancia = $$("#frm-search-distance").val();
	otros = $$("#frm-search-others").val();
	venue = $$("#frm-search-venue").val();
	if (disc.length<1) {
		disc = "0";
	}
	if (asociacion.length<1) {
		asociacion = "0";
	}
	if (region.length<1) {
		region = "0";
	}
	if (otros.length<1) {
		otros = "0";
	}
	if (venue.length<1) {
		venue = "0";
	}
	WS_Cargar_events_x_filtros(desde, hasta, disc, asociacion, region, distancia, otros, venue);
}

function Abrir_mapa_detalle(latitud_destino, longitud_destino) {
	// dibujar mapa grande
	Dibujar_mapa(latitud_destino, longitud_destino, "content_map_event", true);
	Lungo.Router.section("map-event");
	
}

function Abrir_ruta_externa(latitud_destino, longitud_destino) {
	if (app_latitud!=0 && app_longitud!=0) {
		url = "https://maps.google.es/maps?saddr=" + app_latitud + "," + app_longitud + "&daddr=" + latitud_destino + "," + longitud_destino + "&hl=en&z=6";
		Confirmar_abrir_maps(url);
	}
}

function Logout() {
	var arr_user = Comprobar_storage_user();
	if (arr_user!=null && arr_user[0].length>0 && arr_user[1].length>0) {
		$$('#txtLoginUser').val(arr_user[0]);
		$$('#txtLoginPass').val(arr_user[1]);
	} else {
		$$('#txtLoginUser').val('');
		$$('#txtLoginPass').val('');		
	} 
	Reset_valores_sesion();
	Abrir_login();
}

function Abrir_login() {
	Lungo.Router.section("login");
}

function Login_automatico() {
	var arr_user = Comprobar_storage_user();
	if (arr_user!=null && arr_user[0].length>0 && arr_user[1].length>0) {
			$$('#txtLoginUser').val(arr_user[0]);
			$$('#txtLoginPass').val(arr_user[1]);
			WS_Login();
	} else {
		$$('#txtLoginUser').val('');
		$$('#txtLoginPass').val('');
	}
}

function Ver_doc(titulo, texto) {
	$$("#view-doc header > h1").text(titulo);
	$$("#content_view_doc").html(texto);
	Lungo.Router.article("view-doc", "art-view-doc");
	$("#art-view-doc").scrollTop(0);
}

function Limpiar_form_registro() {
	$$('#txtSignupEmail').val('');
	$$('#txtSignupPass').val('');
	$$('#txtSignupRepeatPass').val('');
	$$('#txtSignupName').val('');
	$$('#txtSignupSurname').val('');
	$$('#frm-signup-riders').val('1');
}

function Reset_valores_sesion() {
	sesion_id_user = 0;
	sesion_nombre = "";
	$$("#span-username").text("");
}

function Comprobar_logueado() {
	if (sesion_id_user>0) {
		return true;
	} else {
		Logout();
	}
}

function Abrir_inscripcion(eventId) {
	if (eventId>0) {
		WS_Comprobar_puede_apuntarse(eventId, Abrir_tras_comprobar, Error_no_puede_inscribirse, eventId);
	}
}

function Abrir_tras_comprobar(data) {
	$$("#my-inscrip-eventid").val(eventId);
	WS_Leer_datos("id, evento", "v_inscripcion", "evento = " + eventId.toString() + " AND confirmado = 0 AND jinete = " + sesion_id_user.toString(), "", 
			Cargar_datos_inscripcion, Cargar_datos_inscripcion_vacia, eventId);
}

function Error_no_puede_inscribirse(eventId) {
	Lungo.Notification.error("Error", "Ups! You can&apos;t enter in this event because the registration time is over or has been cancelled.",
			"hm-sad", 3);
}

function Cargar_datos_inscripcion(data) {
	WS_Cargar_info_event_para_inscrip(data.evento, data.id, sesion_id_user);
}

function Cargar_datos_inscripcion_vacia(evento) {
	WS_Cargar_info_event_para_inscrip(evento, 0, sesion_id_user);
}


