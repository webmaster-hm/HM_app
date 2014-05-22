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
			if (window.google) {
				google.maps.event.trigger(map, 'resize');				
				if (app_google_coords!=null) {
					map.setCenter(app_google_coords);
				}	
			}
		}
		//$("#detail-event > article").scrollTop(0);
		document.getElementById("art-detail-event").scrollTop = 0;
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
	
	$$("#img-pinmap-event-detail").tap(function() {
		Abrir_mapa_detalle($$("#event_detail_latitud").val(), $$("#event_detail_longitud").val());
		/*var lats = $$(this).attr("rel");
		if (lats.length>0) {
			var arr_lats = lats.split("_");
			if (arr_lats.length>1) {
				latitud_destino = arr_lats[0];
				longitud_destino = arr_lats[1];
				Abrir_mapa_detalle(latitud_destino, longitud_destino);	
			}	
		}*/
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
		var lat = 0, long = 0;
		lat = $$("#map_event_latitud").val();
		long = $$("#map_event_longitud").val();
		if (lat!=0 && long!=0) { 
			Abrir_ruta_externa(lat, long);	
		}
	});
	$$("#btn-map-enter-event").tap(function() {
		eventId = $$("#btn-map-enter-event").attr("rel");
		Abrir_inscripcion(eventId);
	});
	$$("#btn-map-route-enter-event").tap(function() {
		eventId = $$("#btn-map-route-enter-event").attr("rel");
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
	$$("#li-my-entries").tap(function() {
		Abrir_my_entries();
	});	
	$$("#li-logout").tap(function() {
		Logout();
	});	
	$$("#li-contact").tap(function() {
		Abrir_contact();
	});
	$$("#li-my-results").tap(function() {
		Abrir_my_results();
	});
	/* FIN ASIDE */
	
	/* INDEX MENU */
	Lungo.dom('#index-menu').on('load', function(event){
		if (typeof app_premium === "undefined") {
			// por defecto lo oculta
			Mostrar_opciones_premium(false);
		} else {
			if (app_premium) {
				Mostrar_opciones_premium(true);
			} else {
				Mostrar_opciones_premium(false);
			}	
		}
	});
	
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
	$$("#div-menu-my-entries").tap(function() {
		Abrir_my_entries();
	});
	$$("#div-menu-my-results").tap(function() {
		Abrir_my_results();
	});
	/* FIN INDEX MENU */
	
	/* MY INSCRIPTION */
	
	$$("#btn-buy-now").tap(function() {
		var id_inscrip = $$("#my-inscrip-inscripid").val();
		Comprar_ahora(id_inscrip);
	});

	$$("#btn-buy-now2").tap(function() {
		var id_inscrip = $$("#my-inscrip-inscripid").val();
		Comprar_ahora(id_inscrip);
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
	
	$$("#img-pinmap-my-inscrip").tap(function() {
		var lats = $$(this).attr("rel");
		if (lats.length>0) {
			var arr_lats = lats.split("_");
			if (arr_lats.length>1) {
				latitud_destino = arr_lats[0];
				longitud_destino = arr_lats[1];
				Abrir_mapa_detalle(latitud_destino, longitud_destino);	
			}	
		}	
	});
	
	$$("#my-inscrip-save-notes").tap(function() {
		var id_inscrip = $$("#my-inscrip-inscripid").val();
		Salvar_notas_inscripcion(id_inscrip);
	});
	
	/* FIN MY INSCRIPTION */

	/* ADD SERVICE */
	$$("#add-qty-service").tap(function() {
		Cambiar_input_number("#frm-services-quantity", true);
	})	;
	$$("#remove-qty-service").tap(function() {
		Cambiar_input_number("#frm-services-quantity", false);
	});
	$$("#btn-add-service-action").tap(function() {
		Anadir_productos_inscripcion();
	});
	$$("#list-add-services li").tap(function() {
		var id_prod = $$(this).attr("rel");
		var cantidad = $$("#service_val_" + id_prod.toString()).val();
		var nombre = $$("#span_nombre_serv_val_" + id_prod.toString()).text();
		Abrir_select_number(cantidad, id_prod, nombre);
	});
	
	/* FIN ADD SERVICE */
	
	/* MY ADDRESS */
	$$("#frm-address-action").tap(function() {
		Actualizar_direccion();
	});
	/* FIN MY ADDRESS */
	
	/* SELECT CLASS ENTRY */
	$$("#list-select-class-entry li").tap(function() {
		if ($$(this).hasClass("row-selected")) {
			// si está ya marcada como seleccionada
			$$(this).removeClass("row-selected");
			$$(this).removeClass("li-selected");
			// comprobar si queda alguna seleccionada
			seleccionados = $$("#list-select-class-entry").find("li.row-selected");
			if (seleccionados.length<1) {
				$$("#next-select-class").addClass("ancla-disabled");
			}
		} else if ($$(this).hasClass("li-verde-claro") || $$(this).hasClass("li-rojo")) {
			// es que no está en disabled
			$$(this).addClass("row-selected");
			$$(this).addClass("li-selected");
			var id = $$(this).attr("rel");
			/* desactivado */
			//Mostrar_select_lvl(id);
			/* desactivado */
			if (new_entry['lleva_lvl']  && app_niveles_disc.length > 0) {
				WS_Ver_notas_clase(id, true);	
			} else {
				WS_Ver_notas_clase(id, false);	
			}
			$$("#next-select-class").removeClass("ancla-disabled");
		} else if ($$(this).hasClass("li-entered") && !$$(this).hasClass("li-paid")) {
			// ya está metida anteriormente en la inscripcion, con lo cual hay que eliminarla
			// comprobar si queda alguna seleccionada
			seleccionados = $$("#list-select-class-entry").find("li.row-selected");
			if (seleccionados.length<1) {
				$$("#next-select-class").addClass("ancla-disabled");
			}
			var id = $$(this).attr("rel");
			Eliminar_clase_ya_insertada(id, new_entry["id_caballo"], new_entry["id"], 0);
		} else if ($$(this).hasClass("li-none")) {
			// solo lleva li-none si es gris y ademas no hay espacios
			var id = $$(this).attr("rel");
			WS_Leer_info_para_join_waiting_list(id);
		}
	});
	
	// click para escoger nivel si es BD
	/* DESACTIVADO
	$$(".div-lvl-class").tap(function() {
		var id = $$(this).attr("rel");
		if (!$$("#class_" + id).hasClass("li-gris") && $$("#class_" + id).hasClass("li-selected")) {
			// si hay espacios disponibles
			//Mostrar_select_lvl(id); 
		}
	});*/
	
	// boton next step
	$$("#next-select-class").tap(function() {
		if (!$$("#next-select-class").hasClass("ancla-disabled")) {
			//siguiente paso
			// comprobar que haya 1 o  mas selected
			seleccionados = $$("#list-select-class-entry").find("li.row-selected");
			if (seleccionados.length>0) {
				// elimina todos los datos anteriores
				new_entry['clases'].splice(0, new_entry['clases'].length);
				new_entry['paso_actual'] = 7;
				var id_class, level;
				for (n=0;n<seleccionados.length;n++) {
					level = "0";
					id_class = $$(seleccionados[n]).attr("rel");
					if ($$("#class_lvl_val_" + id_class).length>0) {
						level = $$("#class_lvl_val_" + id_class).val();
					}
					arr_temp = new Array();
					arr_temp["clase"] = id_class;
					arr_temp["nivel"] = level;
					new_entry['clases'].push(arr_temp);
				}
				Comprobar_paso_a_ir();
			}
		}
	});
		
	/* SELECT  ADD CLASS ENTRY */
	
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
				Abrir_my_horse(true, id_caballo, false);
			}
		}
	});
	
	$$("#btn-new-horse").tap(function() {
		Abrir_my_horse(false, 0, false);
	});
	
	// hold en lista de elementos para editar, seleccionar el que acaba de editarse
	/*$$("#list-select-horse-entry li").hold(function() {
		var id_caballo = $$(this).attr("rel");
		if (id_caballo>0) {
			Abrir_my_horse(true, id_caballo, false);
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
	
	/* SELECT RIDER ENTRY */
	$$("#list-select-rider-entry li").tap(function() {
		if ($$(this).hasClass("row-selected")) {
			$$(this).removeClass("row-selected");
			$$(this).removeClass("li-selected");
			$$("#next-select-rider").addClass("ancla-disabled");
			$$("#btn-edit-rider").addClass("ancla-disabled");
		} else {
			$$("#list-select-rider-entry > li").removeClass("row-selected");
			$$("#list-select-rider-entry > li").removeClass("li-selected");
			$$(this).addClass("row-selected");
			$$(this).addClass("li-selected");
			$$("#next-select-rider").removeClass("ancla-disabled");
			$$("#btn-edit-rider").removeClass("ancla-disabled");
		}
	});
	
	// boton next step
	$$("#next-select-rider").tap(function() {
		if (!$$("#next-select-rider").hasClass("ancla-disabled")) {
			//siguiente paso
			new_entry['paso_actual'] = 4;
			var id_jinete = $$("#list-select-rider-entry .row-selected").attr("rel");
			if (id_jinete>0) {
				new_entry['id_jinete'] = id_jinete;
				Comprobar_paso_a_ir();	
			}
		}
	});
	
	// boton editar
	$$("#btn-edit-rider").tap(function() {
		if (!$$("#btn-edit-rider").hasClass("ancla-disabled")) {
			var id_jinete = $$("#list-select-rider-entry .row-selected").attr("rel");
			if (id_jinete>0) {
				Abrir_my_rider(true, id_jinete, false);
			}
		}
	});
	
	$$("#btn-new-rider").tap(function() {
		Abrir_my_rider(false, 0, false);
	});
	
	/* FIN SELECT HORSE ENTRY */
	
	/* MY RIDER */
	$$("#frm-rider-action").tap(function() {
		Guardar_subjinete();
	});
	/* FIN MY RIDER */
	
	/* MY PROFILE */
	$$("#frm-profile-action").tap(function() {
		Guardar_my_profile();
	});
	/* FIN MY PROFILE */

	/* SELECT MEMBERSHIPS ASSOC */
	// boton next step
	$$("#next-select-memberships").tap(function() {
		if (Validar_select_memberships()) {
			WS_Actualizar_memberships_y_validar(new_entry['id_jinete'], new_entry['id_caballo'], new_entry['federacion'], 
					$$("#txtMemberHorse").val(), $$("#txtMemberOwner").val(), $$("#txtMemberRider").val(), 
					$$("#txtMemberVenue").val(), $$("#txtMemberQualifying").val(), new_entry['id'], new_entry['tipo_qualifier']);
		}
	});
	/*FIN SELECT MEMBERSHIPS ASSOC */
	
	/* PROCESO DE PAGO SAGEPAY */
	
	$$("#list-select-method li").tap(function() {
		var id = $$(this).attr("rel");
		if (id>1) {
			var comision_debito = $$("#hidden_method_comision_2").val();
			var comision_credito = $$("#hidden_method_comision_3").val();
			var total = $$("#hidden_method_total_sin_com_" + id).val();
			total = parseFloat(total);
			comision_debito = parseFloat(comision_debito);
			comision_credito = parseFloat(comision_credito);
			WS_Validar_inscripcion_sagepay(total, $$("#select-method-inscripid").val(), $$("#select-method-eventid").val(), 
					comision_debito, comision_credito);	
		} else {
			// paypal
			var comision = $$("#hidden_method_comision_1").val();
			var total = $$("#hidden_method_total_sin_com_" + id).val();
			total = parseFloat(total);
			comision = parseFloat(comision);
			Comprar_paypal((total + comision), $$("#select-method-inscripid").val());
		}	
	});
	
	$$("#sagepay-back").tap(function() {
		Comprobar_volver_atras_sagepay($$("#sagepay-iframe-inscripid").val());
	});

	$$("#btn-sagepay-entries").tap(function() {
		Abrir_my_entries();
	});
	
	/* FIN PROCESO DE PAGO SAGEPAY */

	/* LIST MY ENTRIES */
	$$("#list-my-entries li").tap(function() {
		var id = $$(this).attr("rel");
		var arr = id.split("_");
		if ($$(this).hasClass("li-azul-claro") || $$(this).hasClass("li-rojo")) {
			// ya confirmada
			var entryId = arr[1];
			Abrir_view_entry(entryId, arr[0]);
		} else {
			// abrir inscripcion pendiente
			var eventId = arr[0];
			Abrir_inscripcion(eventId);
		}
	});
	
	/* FIN MY ENTRIES */
	
	/* VIEW ENTRY */
	$$("#img-pinmap-view-entry").tap(function() {
		var lats = $$(this).attr("rel");
		if (lats.length>0) {
			var arr_lats = lats.split("_");
			if (arr_lats.length>1) {
				latitud_destino = arr_lats[0];
				longitud_destino = arr_lats[1];
				Abrir_mapa_detalle(latitud_destino, longitud_destino);	
			}	
		}
	});
	
	$$(".action-down-schedule").tap(function() {
		var id = $$(this).attr("rel");
		if (id>0) {
			WS_Generar_schedule(id);
		}
	});
	
	$$(".action-down-entryform").tap(function() {
		var id = $$(this).attr("rel");
		if (id>0) {
			WS_Generar_entry_form(id);
		}
	});

	$$(".action-down-invoice").tap(function() {
		var id = $$(this).attr("rel");
		if (id>0) {
			WS_Generar_invoice(id);
		}
	});
	
	$$(".action-down-times").tap(function() {
		var id = $$(this).attr("rel");
		if (id>0) {
			WS_Descargar_times(id);
		}
	});
	
	//
	/* FIN VIEW ENTRY */
	
	/* VIEW DOC */
	$$("#continue-view-doc").tap(function() {
		Lungo.Router.back();
	});
	/* FIN VIEW DOC */

	/* CONTACT */
	$$("#frm-contact-action").tap(function() {
		Enviar_contact();
	});
	/* FIN CONTACT */

	/* MY RESULTS */
	$$("#list-my-results li").tap(function() {
		var id = $$(this).attr("rel");
		if (id>0) {
			WS_Descargar_results(id);
		}
	});
	/* FIN MY RESULTS */
	
});

