Lungo.ready(function() {
		
	/* CARGAR DESPLEGABLES AL INICIO DE LA APLICACION */
	if ($$('select#frm-search-disc option').length<1) {
		WS_Cargar_disciplinas("#frm-search-disc", true);	
	}
	if ($$('select#frm-search-asoc option').length<1) {
		WS_Cargar_asociaciones("#frm-search-asoc", true);	
	}
	if ($$('select#frm-search-county option').length<1) {
		WS_Cargar_regiones(app_pais, "#frm-search-county", true);	
	}
	
	if ($$('select#frm-search-distance option').length<1) {
		WS_Cargar_filtro_distancia("#frm-search-distance");	
	}

	if ($$('select#frm-search-others option').length<1) {
		WS_Cargar_filtro_varios("#frm-search-others");	
	}
	
	if ($$('select#frm-search-venue option').length<1) {
		WS_Cargar_venues("#frm-search-venue", true);	
	}
	/* FIN DE CARGA DE DESPLEGABLES */

	/* LISTADO DE EVENTOS */
	$$('#list-next-events li').tap(function() {
		valor = $$(this).attr("id");
		Abrir_detalle_evento(valor);
	});
	/* FIN LISTADO DE EVENTOS */
	
	/* DETAIL EVENT */
	Lungo.dom('#detail-event').on('load', function(event){	
		/* en estas variables globales están las coords del venue */
		if (map!=null) {
			google.maps.event.trigger(map, 'resize');				
			if (app_google_coords!=null) {
				map.setCenter(app_google_coords);
			}
		}
		$("#detail-event > article").scrollTop(0);
	});	
	$$('#mapPlaceholder').tap(function() {
		Abrir_mapa_detalle($$("#event_detail_latitud").val(), $$("#event_detail_longitud").val());
	});
	$$("#btn-gmaps").tap(function() {
		Abrir_mapa_detalle($$("#event_detail_latitud").val(), $$("#event_detail_longitud").val());
	});
	$$("#btn-enter-event").tap(function() {
		eventId = $$("#btn-enter-event").attr("rel");
		Abrir_inscripcion(eventId);
	});
	/* FIN DETAIL EVENT */
		
	/* SIGN UP */
	Lungo.dom('#signup').on('load', function(event){	
		Limpiar_form_registro();	
	});
	$$("#frm-signup-action").tap(function() {
		Crear_cuenta();
	});	
	/* FIN SIGN UP */
	
	/* DETAIL MAP */
	Lungo.dom('#map-event').on('load', function(event){
		/* en estas variables globales están las coords del venue */
		if (map_detail!=null) {
			google.maps.event.trigger(map_detail, 'resize');				
			if (app_google_coords!=null) {
				map_detail.setCenter(app_google_coords);
			}
		}
	});
	$$("#btn-view-route").tap(function() {
		// siempre tiene app google coords los datos del ultimo mapa abierto, y como estamos en map event, son las coordenadas del mapa actual
		if (app_google_coords!=null) Abrir_ruta_externa(app_google_coords.d, app_google_coords.e);
	});
	$$("#btn-map-enter-event").tap(function() {
		eventId = $$("#btn-map-enter-event").attr("rel");
		Abrir_inscripcion(eventId);
	});
	
	/* FIN DETAIL MAP */
	
	/* SEARCH EVENTS */
	Lungo.dom('#search-events').on('load', function(event){
		$$("#frm-search-to").val(Fecha_date_a_formato_HM(app_search_to));
		$$("#frm-search-from").val(Fecha_date_a_formato_HM(app_search_from));
	});	
	$$('#div-frm-search-to').tap(function() {
		Abrir_select_date(false);
	});
	$$('#frm-search-to').tap(function() {
		Abrir_select_date(false);
	});
	$$('#frm-search-from').tap(function() {
		Abrir_select_date(true);
	});
	$$('#div-frm-search-from').tap(function() {
		Abrir_select_date(true);
	});
	$$('#frm-search-action').tap(function() {
		Buscar_eventos();
	});
	/* FIN SEARCH EVENTS */
	
	/* LOGIN */
	$$('article#art_login a[data-action=login]').tap(function() {
		WS_Login();
	});
	$$('article#art_login a[data-action=forgot]').tap(function() {
		Lungo.Router.section("forgot-pass");
	});
	$$('article#art_login a[data-action=signup]').tap(function() {
		Lungo.Router.section("signup");
	});
	/* FIN LOGIN */
	
	/* RESET PASS */
	$$("#frm-forgot-action").tap(function() {
		Reset_password();	
	});
	/* FIN RESET PASS */
	
	/* ASIDE */
	$$("#li-search-events").tap(function() {
		Abrir_search_events();
	});
	$$("#li-go-home").tap(function() {
		Go_home();
	});
	$$("#li-next-events").tap(function() {
		Abrir_next_events();
	});
	$$("#li-near-events").tap(function() {
		Abrir_eventos_cercanos();
	});	
	$$("#li-logout").tap(function() {
		Logout();
	});	
	/* FIN ASIDE */
	
	/* INDEX MENU */
	$$("#div-menu-next-events").tap(function() {
		Abrir_next_events();
	});
	$$("#div-menu-search-events").tap(function() {
		Abrir_search_events();
	});
	$$("#div-menu-near-events").tap(function() {
		Abrir_eventos_cercanos();
	});
	$$("#div-menu-fav-events").tap(function() {
		Abrir_fav_events();
	});
	/* FIN INDEX MENU */
	
	/* MY INSCRIPTION */
	Lungo.dom('#my-inscrip').on('load', function(event){	
		
	});
		
	/* FIN MY INSCRIPTION */
});

