Lungo.ready(function() {
		
	/* LISTADO DE EVENTOS */
	$$('#list-next-events li').tap(function() {
		valor = $$(this).attr("id");
		Abrir_detalle_evento(valor);
	});
	/* FIN LISTADO DE EVENTOS */
	
	/* ASIDE */
	$$('#header-aside .icon').tap(function() {
		Cerrar_aside();
	});
	/* FIN ASIDE */
	
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

	$$("#btn-buy-paypal").tap(function() {
		var id_inscrip = $$("#my-inscrip-inscripid").val();
		Comprar_paypal($$("#total_payment").text(), id_inscrip);
	});

	$$(".removeclass").tap(function() {
		var id_inscrip_det = $$(this).attr("rel");
		Confirmar_eliminar_clase_servicio("You have selected to delete this class. Are you sure?", id_inscrip_det, "clase");
	});

	$$(".removeservice").tap(function() {
		var id_inscrip_det = $$(this).attr("rel");
		Confirmar_eliminar_clase_servicio("You have selected to delete this service. Are you sure?", id_inscrip_det, "servicio");
	});
	
	$$(".addservice").tap(function() {
		var eventId = $$("#my-inscrip-eventid").val();
		Abrir_add_service(eventId);
	});
	
	$$("#list-services .add").tap(function() {
		var eventId = $$("#my-inscrip-eventid").val();
		Abrir_add_service(eventId);
	});
	
	$$(".addclass").tap(function() {
		var eventId = $$("#my-inscrip-eventid").val();
		Comenzar_proceso_anadir_clase(eventId);
	});
	
	$$("#list-classes .add").tap(function() {
		var eventId = $$("#my-inscrip-eventid").val();
		Comenzar_proceso_anadir_clase(eventId);
	});
	/* FIN MY INSCRIPTION */

	/* ADD SERVICE */
	$$("#add-qty-service").tap(function() {
		Cambiar_input_number("#frm-services-quantity", true);
	})	;
	$$("#remove-qty-service").tap(function() {
		Cambiar_input_number("#frm-services-quantity", false);
	});
	$$("#frm-add-service").tap(function() {
		Anadir_producto_inscripcion();
	});
	
	
	/* FIN ADD SERVICE */
	
	/* MY ADDRESS */
	$$("#frm-address-action").tap(function() {
		Actualizar_direccion();
	});
	/* FIN MY ADDRESS */
	
	/* ADD CLASS ENTRY */
	$$("#list-select-class-entry li").tap(function() {
		if ($$(this).hasClass("row-selected")) {
			$$(this).removeClass("row-selected");
			$$(this).removeClass("li-selected");
		} else {
			if (!new_entry['clase_multiple']) {
				// solo se puede seleccionar 1
				$$("#list-select-class-entry > li").removeClass("row-selected");
				$$("#list-select-class-entry > li").removeClass("li-selected");
			}
			$$(this).addClass("row-selected");
			$$(this).addClass("li-selected");
		}
	});
	/* FIN ADD CLASS ENTRY */
	
	/* SELECT HORSE ENTRY */
	$$("#list-select-horse-entry li").tap(function() {
		if ($$(this).hasClass("row-selected")) {
			$$(this).removeClass("row-selected");
			$$(this).removeClass("li-selected");
			$$("#next-select-horse").addClass("ancla-disabled");
			$$("#btn-edit-horse").addClass("ancla-disabled");
		} else {
			$$("#list-select-horse-entry > li").removeClass("row-selected");
			$$("#list-select-horse-entry > li").removeClass("li-selected");
			$$(this).addClass("row-selected");
			$$(this).addClass("li-selected");
			$$("#next-select-horse").removeClass("ancla-disabled");
			$$("#btn-edit-horse").removeClass("ancla-disabled");
		}
	});
	
	// boton next step
	$$("#next-select-horse").tap(function() {
		if (!$$("#next-select-horse").hasClass("ancla-disabled")) {
			//siguiente paso
			new_entry['paso_actual'] = 2;
			var id_caballo = $$("#list-select-horse-entry .row-selected").attr("rel");
			if (id_caballo>0) {
				new_entry['id_caballo'] = id_caballo;
				Comprobar_paso_a_ir();	
			}
		}
	});
	
	// boton editar
	$$("#btn-edit-horse").tap(function() {
		if (!$$("#btn-edit-horse").hasClass("ancla-disabled")) {
			var id_caballo = $$("#list-select-horse-entry .row-selected").attr("rel");
			if (id_caballo>0) {
				Abrir_my_horse(true, id_caballo);
			}
		}
	});
	
	$$("#btn-new-horse").tap(function() {
		Abrir_my_horse(false, 0);
	});
	
	// hold en lista de elementos para editar, seleccionar el que acaba de editarse
	/*$$("#list-select-horse-entry li").hold(function() {
		var id_caballo = $$(this).attr("rel");
		if (id_caballo>0) {
			Abrir_my_horse(true, id_caballo);
			$$(this).addClass("row-selected");
			$$(this).addClass("li-selected");
			$$("#next-select-horse").removeClass("ancla-disabled");
			$$("#btn-edit-horse").removeClass("ancla-disabled");
			$$("#list-select-horse-entry > li").removeClass("row-selected");
			$$("#list-select-horse-entry > li").removeClass("li-selected");
		}
	});*/
	
	/* FIN SELECT HORSE ENTRY */
	
	/* MY HORSE */
	$$("#frm-horse-action").tap(function() {
		Guardar_caballo();
	});
	/* FIN MY HORSE */
});

