/**
 * Mostrar error en un div normalmente, no es una notificación
 * 
 * @param target,
 *            elemento del dom
 * @param error,
 *            integer con el error
 */
function Mostrar_error(target, error) {
	var arr_msg = new Array("No events are available at this time",
			"No events are available near your location",
			"No events are available with these filters",
			"No favs events are available at this time");
	var html = "<div class='div-error'><div class='div-error-content'>"
			+ "<img class='icon-error' src='images/icons/error.png' /><br>ERROR<br><br>"
			+ arr_msg[error] + "</div></div>";
	$$(target).html(html);
}

/**
 * Rellena el ul de la lista de next events
 * 
 * @param data,
 *            json con valores de la lista
 */
function Rellenar_next_events(data, id_error) {
	$$("#list-next-events").html('');
	$$("#error-next-events").html('');
	if (data.length > 0 && data.error != ws_msg_error) {
		for (var i = 0; i < data.length; i++) {
			color = "li-gris";
			if (data[i].pay_online == '1') {
				color = "li-verde-claro";
			}
			numdia = Fecha_a_numdia(data[i].fec_ini);
			mes = Fecha_a_mes(data[i].fec_ini, false);
			html = "<div class='left icon-list-cont icon-blanco box'><div class='div-numdia'>"
					+ numdia
					+ "</div><div class='div-mes'>"
					+ mes
					+ "</div></div>";
			html += "<div class='div-nombre-ev'>" + data[i].nombre_evento
					+ "<br> <span class='span-disciplina'>"
					+ data[i].disciplina + "</span></div>";
			$$("#list-next-events").append(
					"<li id='" + data[i].id + "' class='arrow " + color + "'>"
							+ html + "</li>");
		}
	} else {
		// no devuelve ningun dato
		Mostrar_error("#list-next-events", id_error);
	}
	Lungo.Router.section("next-events");
}

function Cambiar_vista_segun_perfil() {
	if (sesion_perfil==2 || sesion_perfil==3) {
		$$("#li-my-entries").removeClass("ocultar");
		$$("#li-near-events").addClass("bottom-grey");
		$$("#li-near-events").removeClass("bottom-red");
	} else {
		$$("#li-my-entries").addClass("ocultar");
		$$("#li-near-events").addClass("bottom-red");
		$$("#li-near-events").removeClass("bottom-grey");
	}
}

/**
 * Rellena la vista de la ficha del evento
 * 
 * @param data,
 *            fila en json del detalle del evento
 */
function Rellenar_detail_event(data) {
	var html1 = "", html2 = "", closing = "";
	;
	if (data.id > 0) {
		var fec_fin = null;
		// limpiar algunos campos
		data.coaches = data.coaches.trim();
		data.notas = data.notas.trim();
		data.description = data.description.trim();
		data.sponsor = data.sponsor.trim();
		data.jueces = data.jueces.trim();
		data.email = data.email.trim();
		data.telefono = data.telefono.trim();
		if (data.latitud == null)
			data.latitud = 0;
		if (data.longitud == null)
			data.longitud = 0;
		// fin limpiar
		if (data.fec_ini == data.fec_fin) {
			// si son iguales, que no muestre la hora
			fec_fin = Fecha_a_dia_hora(data.fec_fin, false);
		} else {
			fec_fin = Fecha_a_dia_hora(data.fec_fin, true);
		}
		html1 = html1 + "<div class='box ev-info-nombre-evento'>"
				+ data.nombre_evento + "</div>";
		html1 = html1
				+ "<div class='width49 left detail-fecha box'><div class='div-fec-ini box'>START</div><div class='div-fec-ini-valor box'>"
				+ Fecha_a_dia_hora(data.fec_ini, true)
				+ "</div></div><div class='width2 left detail-fecha box'><div class='sep-vertical-fecha box'><div class='sep-vertical box'></div></div></div>"
				+ "<div class='box width49 left detail-fecha'><div class='box div-fec-ini'>END</div><div class='box div-fec-ini-valor'>"
				+ fec_fin + "</div></div><div class='clear'></div>";

		if (data.publicar_closing == 1) {
			closing = Fecha_a_dia_hora(data.fec_closing, true);
			late_entry = "--";
			if (data.late_entries == 1) {
				late_entry = data.time_closing + " hrs before start";
			}
			html2 = html2
					+ "<div class='width49 left detail-fecha-closing box'><div class='div-fec-close box'>CLOSING DATE</div><div class='div-fec-close-valor box'>"
					+ closing
					+ "</div></div><div class='width2 left detail-fecha-closing box'><div class='sep-vertical-fecha-closing box'><div class='sep-vertical-closing box'></div></div></div>"
					+ "<div class='box width49 left detail-fecha-closing'><div class='box div-fec-close'>LATE ENTRIES</div><div class='box div-fec-close-valor'>"
					+ late_entry + "</div></div><div class='clear'></div>";
		}
		html2 += "<div class='box pad15'>";
		if (data.clases.length > 0) {
			/*
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Classes</div>";
			var txt_clases = "<ol>";
			for (i = 0; i < data.clases.length; i++) {
				txt_clases += "<li>" + data.clases[i].nombre + "</li>";
			}
			txt_clases += "</ol>";
			html2 = html2 + "<div class='box ev-info-datos'>" + txt_clases
					+ "</div>";*/
			html2 += "<div class='box box-card'><span class='bold700'>Classes</span>" + 
				"<div class='divisor-class'></div>";
			var txt_clases = "<ul id='ul-classes-event-info' class='list'>";
			for (i = 0; i < data.clases.length; i++) {
				txt_clases += "<li>" + data.clases[i].nombre + "</li>";
			}
			txt_clases += "</ul>";
			html2 += txt_clases + "</div>";
		}

		//html2 = html2 + "<div class='box ev-info-nombre-evento'>Share event</div>";
		html2 = html2 + "<div class='box box-card'><span class='bold700'>Share event</span>";
		html2 = html2 + "<div class='divisor-class'></div><div class='box ev-info-media-social'>";
		html2 = html2
				+ "<div class='center-txt box left width20-pad'><a href='"
				+ url_facebook
				+ encodeURI(web_detail + data.id)
				+ "'><img src='images/icons/facebook.png' class='width100 icon-share-social' /></a></div>";
		html2 = html2
				+ "<div class='center-txt box left width20-pad'><a href='"
				+ url_googleplus
				+ encodeURI(web_detail + data.id)
				+ "'><img src='images/icons/googleplus.png' class='width100 icon-share-social' /></a></div>";
		html2 = html2
				+ "<div class='center-txt box left width20-pad'><a href='"
				+ url_twitter
				+ encodeURI("Events in " + data.venue_nombre + " "
						+ Fecha_a_dia_hora(data.fec_ini, true)
						+ " - Horse Monkey " + web_detail + data.id)
				+ "'><img src='images/icons/twitter.png' class='width100 icon-share-social' /></a></div>";
		html2 = html2
				+ "<div class='center-txt box left width20-pad'><a href='mailto:?subject="
				+ encodeURI("Events in " + data.venue_nombre + " "
						+ Fecha_a_dia_hora(data.fec_ini, true)
						+ " - Horse Monkey")
				+ "&body="
				+ encodeURI(web_detail + data.id)
				+ "'><img src='images/icons/email.png' class='width100 icon-share-social' /></a></div>";
		html2 = html2 + "</div></div>";

		if (data.notas.length > 0) {
			//html2 = html2 + "<div class='box ev-info-nombre-evento'>Notes</div>";
			html2 = html2 + "<div class='box box-card'><span class='bold700'>Notes</span>";
			html2 = html2 + "<div class='divisor-class'></div>"
					+ nl2br(data.notas) + "</div>";
		}
		if (data.description.length > 0) {
			//html2 = html2 + "<div class='box ev-info-nombre-evento'>Latest news</div>";
			html2 = html2 + "<div class='box box-card'><span class='bold700'>Latest news</span>";
			html2 = html2 + "<div class='divisor-class'></div>" + nl2br(data.description) + "</div>";
		}
		if (data.coaches.length > 0) {
			//html2 = html2 + "<div class='box ev-info-nombre-evento'>Coaches</div>";
			html2 = html2 + "<div class='box box-card'><span class='bold700'>Coaches</span>";
			html2 = html2 + "<div class='divisor-class'></div>" + nl2br(data.coaches) + "</div>";
		}
		if (data.sponsor.length > 0) {
			html2 = html2 + "<div class='box box-card'><span class='bold700'>Sponsors</span>";
			html2 = html2 + "<div class='divisor-class'></div>"
					+ nl2br(data.sponsor) + "</div>";
		}
		if (data.jueces.length > 0) {
			html2 = html2 + "<div class='box box-card'><span class='bold700'>Judges</span>";
			html2 = html2 + "<div class='divisor-class''></div>"
					+ nl2br(data.jueces) + "</div>";
		}
		// datos del venue
		html2 = html2
				+ "<div class='box box-card'><span class='bold700'>Venue Details</span>";
		html2 = html2
				+ "<div class='divisor-class'></div>"
				+ nl2br(data.direccion) + "<br/>";
		if (data.telefono.length > 0) {
			html2 = html2 + nl2br(data.telefono) + "<br/>";
		}
		if (data.email.length > 0) {
			html2 = html2 + "Email<br/>" + nl2br(data.email);
		}
		if (data.latitud!=null && data.longitud!=null) {
			html2 += "<div class='pinmap-view-entry'><img id='img-pinmap-event-detail' src='images/icons/pinmap_azul.png' /></div>";
			$$("#event_detail_latitud").val(data.latitud);
			$$("#event_detail_longitud").val(data.longitud);
		}
		html2 = html2 + "</div>";
		html2 = html2 + "<input type='hidden' id='event_detail_latitud' value='0' />";
		html2 = html2 + "<input type='hidden' id='event_detail_longitud' value='0' />";

		$$("#ev-info-parte1").html(html1);
		$$("#ev-info-parte2").html(html2);
		$$("#btn-enter-event").attr("rel", data.id);
		$$("#btn-map-enter-event").attr("rel", data.id);
		$$("#btn-map-route-enter-event").attr("rel", data.id);
		if (data.latitud != 0 && data.longitud != 0) {
			$$("#btn-gmaps").show();
			Dibujar_mapa(data.latitud, data.longitud, "mapPlaceholder", false);
			$$("#event_detail_latitud").val(data.latitud);
			$$("#event_detail_longitud").val(data.longitud);
		} else {
			$$("#btn-gmaps").hide();
		}
	} else {
		$$("#btn-enter-event").attr("rel", "0");
		$$("#btn-map-enter-event").attr("rel", "0");
	}
}

function Dibujar_mapa_vacio() {
	var html = "";
	html = "<div class='centrar'><img class='icon-error' src='images/icons/error.png'><br>No map available</div>";
	$$("#mapPlaceholder").html(html);
}

/**
 * 
 * @param data
 * @param id_select,
 *            elemento del dom
 * @param texto,
 *            texto del "All", si viene en blanco no se rellena
 */
function Rellenar_combo(data, id_select, texto) {
	var opciones = "";
	if (texto.length > 0) {
		opciones = "<option value='0'>" + texto + "</option>";
	}
	for (var i = 0; i < data.length; i++) {
		opciones += "<option value='" + data[i].id + "'>" + data[i].nombre
				+ "</option>";
	}
	$$(id_select).html(opciones);
}

/**
 * Viene directamente el html definido con sus opciones
 * 
 * @param id_select
 * @param html
 */
function Rellenar_combo_con_html(id_select, html) {
	$$(id_select).html(html);
}

/**
 * 
 * @param data
 *            con los datos del evento
 */
function Rellenar_my_inscrip_info_event(data) {
	$$("#fechas-info-event").html("");
	$$("#more-info-event").html("");
	$$("#my-inscrip-notes").val("");
	if (data.id > 0) {
		$$("#my-inscrip-nombre-ev1").text(data.nombre_evento);
		$$("#my-inscrip-nombre-ev2").text(data.nombre_evento);
		$$("#my-inscrip-nombre-ev3").text(data.nombre_evento);
		$$("#my-inscrip-nombre-ev4").text(data.nombre_evento);
		if (data.fec_ini == data.fec_fin) {
			// si son iguales, que no muestre la hora
			fec_fin = Fecha_a_dia_hora(data.fec_fin, false);
		} else {
			fec_fin = Fecha_a_dia_hora(data.fec_fin, true);
		}
		var html = "";
		html = html
				+ "<div class='width49 left detail-fecha box'><div class='div-fec-ini box'>START</div><div class='div-fec-ini-valor box'>"
				+ Fecha_a_dia_hora(data.fec_ini, true)
				+ "</div></div><div class='width2 left detail-fecha box'><div class='sep-vertical-fecha box'><div class='sep-vertical box'></div></div></div>"
				+ "<div class='box width49 left detail-fecha'><div class='box div-fec-ini'>END</div><div class='box div-fec-ini-valor'>"
				+ fec_fin + "</div></div><div class='clear'></div>";

		if (data.publicar_closing == 1) {
			closing = Fecha_a_dia_hora(data.fec_closing, true);
			late_entry = "--";
			if (data.late_entries == 1) {
				late_entry = data.time_closing + " hrs before start";
			}
			html = html
					+ "<div class='width49 left detail-fecha-closing box'><div class='div-fec-close box'>CLOSING DATE</div><div class='div-fec-close-valor box'>"
					+ closing
					+ "</div></div><div class='width2 left detail-fecha-closing box'><div class='sep-vertical-fecha-closing box'><div class='sep-vertical-closing box'></div></div></div>"
					+ "<div class='box width49 left detail-fecha-closing'><div class='box div-fec-close'>LATE ENTRIES</div><div class='box div-fec-close-valor'>"
					+ late_entry + "</div></div><div class='clear'></div>";
		}
		$$("#fechas-info-event").html(html);
		html = "";
		if (data.venue_nombre!=null) {
			html += "<div class='box box-card'><span class='bold700'>Venue</span><div class='divisor-class'></div>";
			html +=  data.venue_nombre	+ "<br/>"+ nl2br(data.direccion) + "<br/>";
			if (data.telefono.length > 0) {
				html += nl2br(data.telefono) + "<br/>";
			}
			if (data.email.length > 0) {
				html += "Email<br/>" + nl2br(data.email);
			}
			if (data.latitud!=null && data.longitud!=null) {
				html += "<div class='pinmap-view-entry'><img rel='" + data.latitud + "_" + data.longitud + "' id='img-pinmap-my-inscrip' src='images/icons/pinmap_azul.png' /></div>";
			}
			html += "</div>";
		}
		if (data.fed_nombre!=null) {
			html += "<div class='box box-card'><span class='bold700'>Association</span>";
			html += "<div class='divisor-class'></div>" + data.fed_nombre + "</div>";
		}
		$$("#more-info-event").html(html);
		$$("#my-inscrip-notes").val(data.notas);
		// si hay productos, mostrar los servicios vacios con el + para añadir
		if (data.nservicios>0) {
			Rellenar_servicios_inscripcion_vacia(false);
		}
	}
}

function Rellenar_clases_inscripcion_vacio() {
	$$("#content-my-inscrip-classes").html("");
	var html = "<ul id='list-classes' class='list'>";
	html += "<li rel='0' class='add'>ADD MORE<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";
	html += "</ul>";
	Lungo.Element.count("#label-inscrip-classes", "0");
	$$("#my-inscrip-nclases").val("0");
	$$("#content-my-inscrip-classes").html(html);
}

function Rellenar_clases_inscripcion(data) {
	$$("#content-my-inscrip-classes").html("");
	var html = "<ul id='list-classes' class='list'>";
	html += "<li rel='0' class='add'>ADD MORE<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";
	if (data.length>0) {
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = " class='par' ";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' " + class_alter + ">"+ nl2br(data[i].clase);
			if (data[i].abrev!=null) {
				if (data[i].abrev.length>0) html += " (" + data[i].abrev + ")";
			} 
			if (data[i].nombre) {			
				html += "<div class='divisor-class'></div><span class='li-class-horse-rider'>Horse: " + data[i].nombre + "</span>";	
			}
			if (data[i].subjinete) {
				html += "<div class='divisor-class'></div><span class='li-class-horse-rider'>Rider: " + data[i].nombre + "</span>";
			}
			html += "<div rel='" + data[i].id + "' class='removeclass div-action-class icon-list-right icon-remove-class'></div></li>"; 
		}
		Lungo.Element.count("#label-inscrip-classes", data.length);
		$$("#my-inscrip-nclases").val(data.length.toString());
		/*if (data.length>3) {
			html += "<li rel='0' class='add'>ADD MORE<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";	
		}*/
	}
	html += "</ul>";
	$$("#content-my-inscrip-classes").html(html);
}

function Rellenar_servicios_inscripcion(data) {
	$$("#content-my-inscrip-services").html("");
	var html = "<ul id='list-services' class='list'>";
	html += "<li rel='0' class='add'>ADD/EDIT<div rel='0' class='addservice div-action-add-class icon-list-right icon-add-class'></div></li>";
	if (data.length>0) {
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = " class='par' ";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' " + class_alter + ">"+ nl2br(data[i].nombre) + " x " + data[i].cantidad;
			html += "<div rel='" + data[i].id + "' class='removeservice div-action-class icon-list-right icon-remove-class'></div></li>"; 
		}
		Lungo.Element.count("#label-inscrip-services", data.length);
		/*if (data.length>4) {
			html += "<li rel='0' class='add'>ADD SERVICE/PRODUCT<div rel='0' class='addservice div-action-add-class icon-list-right icon-add-class'></div></li>";	
		}*/
	}
	html += "</ul>";
	$$("#content-my-inscrip-services").html(html);
}

function Rellenar_servicios_inscripcion_vacia(bol_no_hay_servicios) {
	$$("#content-my-inscrip-services").html("");
	var html = "";
	if (bol_no_hay_servicios) {
		html = "<div class='pad15 '><div class='width100 marco-gris'><br>No services available for this event.<br><br></div></div>";
	} else {
		html = "<ul id='list-services' class='list'>";
		html += "<li rel='0' class='add'>ADD/EDIT<div rel='0' class='addservice div-action-add-class icon-list-right icon-add-class'></div></li>";
		html += "</ul>";	
	}
	Lungo.Element.count("#label-inscrip-services", "0");
	$$("#content-my-inscrip-services").html(html);
}

function Rellenar_totales_inscripcion(data) {
	$$("#summary-content").html("");
	$$("#summary-content2").html("");
	//Lungo.Element.count("#label-inscrip-checkout", app_moneda + " " + number_format(data.total_final,2));
	var html = "";
	//html = "<a href='#' id='btn-buy-now' class='button anchor margin-bottom'><span class='icon shopping-cart'></span><abbr>Buy now</abbr></a>";
	html += "<table class='width100 font110 line180'>";
	html += "<tr><td class='td1-summary'>NET:</td><td class='td2-summary'>" + app_moneda + " <span id='net_payment'>" + number_format(data.total,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>HM Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='hm_fee_payment'>" + number_format(data.total_hm,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>VAT:</td><td class='td2-summary'>" + app_moneda + " <span id='vat_payment'>" + number_format(data.total_vat,2) + "</span></td></tr>";
	html += "</table>";
	var html2 = "<span class='font80 color-gris'>* V.A.T. only be applicable to HM Fee.</span><br><br>";
	var late_entry = "Your entry is still on time! No late entry fees on this transaction!";
	if (data.late_entry) {
		late_entry = "Your entry includes a late fee " + app_moneda + number_format(data.fee_late,2) + " per class.";
	}	
	html2 += "<div class='width100 marco-gris'>" + late_entry + "</div><br><br>";
	if (data.total_final>0) {
		html2 += "<div class='width100 form'>";
		html2 += "<fieldset><label class='anchor width70'>I accept <a href='javascript:WS_Leer_terms(\"terms_buyers\");' class='underline'>HM T&C</a></label>" + 
			"<input type='checkbox' id='chk_accept_hm' name='chk_accept_hm' class='inline right' /></fieldset>";
		if (data.req_qualifier_num && data.tipo_qualifier==3) {
			html2 += "<fieldset><label class='anchor width70'>I accept <a href='javascript:Ver_doc(\"Qualifying T&C\", app_terms_qualifying);' class='underline'>Qualifying T&C</a>" + 
				"</label><input type='checkbox' id='chk_accept_qualifying' name='chk_accept_qualifying' class='inline right' /></fieldset>";
		}
		if (data.req_tc_special && data.tc_special.length>0) {
			html2 += "<fieldset><label class='anchor width70'>I accept these <a href='javascript:Ver_doc(\"Special T&C\", \"" + nl2br(data.tc_special) + "\");' class='underline'>" + 
				"Special T&C</a></label><input type='checkbox' id='chk_special' name='chk_special' class='inline right' /></fieldset>";		
		}
		if (!data.mayor_edad) {
			html2 += "<fieldset><label class='anchor width70'>This entry has been verified by a responsible adult</label>" + 
				"<input type='checkbox' id='chk_adult' name='chk_adult' class='inline right' /></fieldset>";
		}
		//html2 += "<br><a href='#' id='btn-buy-paypal' class='button anchor margin-bottom'><span class='icon shopping-cart'></span><abbr>Buy with PayPal</abbr></a>";
		html2 += "</div>";		
	}
	$$("#summary-content").html(html);
	$$("#summary-content2").html(html2);
	
}

function Rellenar_totales_inscripcion_vacia(evento) {
	$$("#summary-content").html("");
	$$("#summary-content2").html("");
	//Lungo.Element.count("#label-inscrip-checkout", app_moneda + " 0.00");
	var html = "<table class='width100 font110 line180'>";
	html += "<tr><td class='td1-summary'>NET:</td><td class='td2-summary'>" + app_moneda + " <span id='net_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>HM Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='hm_fee_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>VAT:</td><td class='td2-summary'>" + app_moneda + " <span id='vat_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "</table>";
	var html2 = "<span class='font80 color-gris'>* V.A.T. only be applicable to HM Fee.</span><br><br>";
	$$("#summary-content").html(html);
	$$("#summary-content2").html(html2);
}

function Rellenar_clases_disponibles_evento(data) {
	$$("#content-select-class").html("");
	if (!$$("#next-select-class").hasClass("ancla-disabled")) {
		$$("#next-select-class").addClass("ancla-disabled");	
	}
	var html = "", html_clase = "", html_count_li = "";
	if (new_entry['lleva_lvl']) {
		$$("#select-class header > h1").text("Select class/es and level");	
	} else {
		$$("#select-class header > h1").text("Select class/es");
	}
	if (data.length>0) {
		html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
		html += "<ul id='list-select-class-entry' class='list'>";
		for (var i = 0; i < data.length; i++) {
			html_clase = "";
			if (i%2==0) {
				class_alter = " par ";
			} else {
				class_alter = "";
			}
			color = "li-verde-claro";
			if (data[i].disponibles=="-") {
				html_count_li = "";
			} else if (data[i].disponibles>0) {
				html_count_li = "<span class='tag count marginleft6'>" + data[i].disponibles;
				if (data[i].disponibles >1) {
					html_count_li += " Spaces Left</span>";
				} else {
					html_count_li += " Space Left</span>";	
				}
				color = "li-rojo";
			} else {
				// no hay 
				color = "li-gris li-none";
				html_count_li = " <span class='tag count marginleft6'>None Available</span> ";
			}
			// comprobar si está en disabled la clase entera porque ya se inscrito en ella
			if (data[i].repite>0) {
				color = "li-gris li-selected li-entered";
				html_count_li = " <span class='tag count marginleft6 font95'>ENTERED</span> ";
			} else if (data[i].repite_comprada>0) {
				color = "li-azul-claro li-selected li-entered li-paid";
				html_count_li = " <span class='tag count marginleft6 font95'>PAID</span> ";
			}
			numdia = Fecha_a_numdia(data[i].fecha);
			mes = Fecha_a_mes(data[i].fecha, false);
			if (new_entry['lleva_lvl'] && app_niveles_disc.length>0) {
				if (data[i].repite>0) {
					nivel_valor = app_niveles_disc[data[i].nivel][0];
					nivel_nombre = app_niveles_disc[data[i].nivel][2];
				} else if (data[i].repite_comprada>0) {
					nivel_valor = app_niveles_disc[data[i].nivel_comprada][0];
					nivel_nombre = app_niveles_disc[data[i].nivel_comprada][2];
				} else {
					nivel_valor = app_niveles_disc[0][0];
					nivel_nombre = app_niveles_disc[0][2];
				}
				// metemos niveles de disciplina
				html_clase = "<div class='left icon-list-cont icon-blanco box'><div class='div-lvl'>"
					+ numdia + "</div><div class='div-mes'>" + mes + "</div></div>";
				html_clase += "<div id='class_lvl_" + data[i].id + "' rel='" + data[i].id + "' class='left icon-gris div-lvl-class box'>" 
					+ "<div class='div-lvl'>" 
					+ "<input type='hidden' id='class_lvl_val_" + data[i].id + "' value='" + nivel_valor + "' /><span id='span_class_lvl_" + data[i].id + "'>" 
					+ nivel_nombre + "</span></div>" 
					+ "<div class='div-mes'>ORTH</div></div>";
				html_clase += "<div class='div-descrip-clase-select'>" + data[i].descripcion + 
					"<br><span class='italic90'>Fee: " + app_moneda + " " + data[i].precio + "</span>" + html_count_li + "</div>";
			} else {
				html_clase = "<div class='left icon-list-cont icon-blanco box'><div class='div-numdia'>"
					+ numdia + "</div><div class='div-mes'>" + mes + "</div></div>";
				html_clase += "<div class='div-descrip-clase-select'>" + data[i].descripcion + 
					"<br><span class='italic90'>Fee: " + app_moneda + " " + data[i].precio + "</span>" + html_count_li + "</div>";				
			}
			html += 	"<li  id='class_" + data[i].id + "' rel='" + data[i].id + "' class='" + color + " " + class_alter + "'>"
							+ html_clase + "</li>";			
		}
		html += "</ul>";
		$$("#content-select-class").html(html);
	}
	Lungo.Router.section("select-class");
}

function Rellenar_clases_disponibles_evento_vacia() {
	$$("#content-select-class").html("");
	if (!$$("#next-select-class").hasClass("ancla-disabled")) {
		$$("#next-select-class").addClass("ancla-disabled");	
	}
	Lungo.Router.section("select-class");
}

function Rellenar_lista_caballos(data) {
	$$("#content-select-horse").html("");
	var html = "";
	if (!$$("#next-select-horse").hasClass("ancla-disabled")) {
		$$("#next-select-horse").addClass("ancla-disabled");	
	}
	if (data.length>0) {
		html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
		html += "<ul id='list-select-horse-entry' class='list'>";
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = "par";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' class='li-verde-claro " + class_alter + "' ><div class='box div-img-horse-select'>" + 
				"<img src='images/icons/caballo_hm_azul.png' alt='Horse' title='Horse' /></div><div class='div-nombre-horse-select'><span class='bold700'>" + data[i].nombre + 
				"</span>&nbsp;<span class='font90'>(" + data[i].sexo + ")</span><br><span class='italic90'>DOB: " + Fecha_a_cadena_corta(data[i].dob, true, true) + "</span></div></li>";
		}
		html += "</ul>";
		html += "<div class='actions-list'><a href='#' id='btn-new-horse' class='button anchor49 margin-bottom'><span class='icon plus'></span><abbr>Add new horse</abbr></a>";
		html += "<a href='#' id='btn-edit-horse' class='button anchor49 margin-bottom edit ancla-disabled marginleft2p'><span class='icon pencil'></span><abbr>Edit horse</abbr></a></div>";
		$$("#content-select-horse").html(html);
	}
	Lungo.Router.section("select-horse");
}

function Rellenar_lista_caballos_vacia() {
	$$("#content-select-horse").html("");
	if (!$$("#next-select-horse").hasClass("ancla-disabled")) {
		$$("#next-select-horse").addClass("ancla-disabled");	
	}
	html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
	html += "<ul id='list-select-horse-entry' class='list'>";
	html += "</ul>";
	html += "<div class='actions-list'><a href='#' id='btn-new-horse' class='button anchor49 margin-bottom'><span class='icon plus'></span><abbr>Add new horse</abbr></a>";
	html += "<a href='#' id='btn-edit-horse' class='button anchor49 margin-bottom edit ancla-disabled marginleft2p'><span class='icon pencil'></span><abbr>Edit horse</abbr></a></div>";
	$$("#content-select-horse").html(html);
	Lungo.Router.section("select-horse");
}

function Rellenar_cmb_sexo_caballo(data) {
	Rellenar_combo(data, "#frm-horse-gender", "");
}

function Rellenar_cmb_sexo(data) {
	Rellenar_combo(data, "#frm-rider-gender", "");
	if ($$('select#frm-profile-gender option').length<1) {
		Rellenar_combo(data, "#frm-profile-gender", "");	
	}
}

function Rellenar_ficha_caballo(data) {
	var id_caballo = parseInt(data[0].id);
	if (id_caballo>0) {
		$$("#txtDOB").val(data[0].dob);
		$$("#frm-horse-gender").val(data[0].sexo);
		$$("#txtOwner").val(data[0].owner);
		$$("#txtHorse").val(data[0].nombre);	
		$$("#txtHeight").val(data[0].altura);
		Lungo.Router.section("my-horse");
	}
}

function Rellenar_lista_jinetes_vacia() {
	$$("#content-select-rider").html("");
	if (!$$("#next-select-rider").hasClass("ancla-disabled")) {
		$$("#next-select-rider").addClass("ancla-disabled");	
	}
	html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
	html += "<ul id='list-select-rider-entry' class='list'>";
	html += "</ul>";
	html += "<div class='actions-list'><a href='#' id='btn-new-rider' class='button anchor49 margin-bottom'><span class='icon plus'></span><abbr>Add new rider</abbr></a>";
	html += "<a href='#' id='btn-edit-rider' class='button anchor49 margin-bottom edit ancla-disabled marginleft2p'><span class='icon pencil'></span><abbr>Edit rider</abbr></a></div>";
	$$("#content-select-rider").html(html);
	Lungo.Router.section("select-rider");
}

function Rellenar_lista_jinetes(data) {
	$$("#content-select-rider").html("");
	if (!$$("#next-select-rider").hasClass("ancla-disabled")) {
		$$("#next-select-rider").addClass("ancla-disabled");	
	}
	var html = "";
	if (data.length>0) {
		html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
		html += "<ul id='list-select-rider-entry' class='list'>";
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = "par";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' class='li-verde-claro " + class_alter + "' ><div class='box div-img-rider-select'>" + 
				"<img src='images/icons/rider_azul.png' alt='Rider' title='Rider' /></div><div class='div-nombre-rider-select'><span class='bold700'>" + data[i].nombre + 
				"</span><br><span class='italic90'>DOB: " + Fecha_a_cadena_corta(data[i].dob, true, true) + "</span></div></li>";
		}
		html += "</ul>";
		html += "<div class='actions-list'><a href='#' id='btn-new-rider' class='button anchor49 margin-bottom'><span class='icon plus'></span><abbr>Add new rider</abbr></a>";
		html += "<a href='#' id='btn-edit-rider' class='button anchor49 margin-bottom edit ancla-disabled marginleft2p'><span class='icon pencil'></span><abbr>Edit rider</abbr></a></div>";
		$$("#content-select-rider").html(html);
	}
	Lungo.Router.section("select-rider");
}

function Rellenar_ficha_subjinete(data) {
	var id = parseInt(data[0].id);
	if (id>0) {
		$$("#txtRiderDOB").val(data[0].dob);
		$$("#frm-rider-gender").val(data[0].sexo);
		$$("#txtRiderName").val(data[0].nombre);
		$$("#txtRiderSurname").val(data[0].apellido1);	
		Lungo.Router.section("my-rider");
	}
}

function Rellenar_ficha_profile(data) {
	var id = parseInt(data[0].id);
	if (id>0) {
		$$("#txtProfileDOB").val(data[0].dob);
		$$("#frm-profile-gender").val(data[0].sexo);
		$$("#txtProfileName").val(data[0].nombre);
		$$("#txtProfileSurname").val(data[0].apellido1);	
		Lungo.Router.section("my-profile");
	}
}

function Mostrar_select_lvl(id_class) {
	if (new_entry['lleva_lvl']) {
		Comprobar_si_notification_is_show();
		var html = "<table class='div-center tb-lvl'>";
		var checked = "";
		for (i=0;i<app_niveles_disc.length;i++) {
			html += "<tr>";
			if ($$("#class_lvl_val_" + id_class).attr("value")==app_niveles_disc[i][0]) {
				checked = " checked='checked' ";
			} else {
				checked = "";
			}
			html += "<td class='italic'>";	
			html += "<input type='radio'  class='radio-lvl' name='grupo-select-lvl' rel='" + id_class + "' id='" + i + "' value='" + app_niveles_disc[i][1] + "' " + checked 
				+ " onclick='Select_lvl(" + id_class + ", " + i + ");' />" + 
				"<label for='" + app_niveles_disc[i][0] + "'>" + app_niveles_disc[i][1] + "</label></td>";
			html += "</tr>";
		}
		html += "</table>";
		Lungo.Notification.html(Generar_notification_html(html, "hm-happy"), "Select level");	
	}
}

function Rellenar_select_memberships(data) {
	var bolHay = false;
	$$("#div-select-memberships-nombre_evento").text(new_entry['nombre_evento']);
	$$("#txtMemberRider").val("");
	$$("#txtMemberHorse").val("");
	$$("#txtMemberOwner").val("");
	$$("#txtMemberQualifying").val("");
	$$("#txtMemberVenue").val("");
	if (new_entry['req_rid_num'] || (new_entry['req_qualifier_num'] && new_entry['tipo_qualifier']==1)) {
		$$("#div-member-rider").show();
		bolHay = true;
	} else {
		$$("#div-member-rider").hide();
	}
	if (data.rider_num.length>0) {
		$$("#txtMemberRider").val(data.rider_num);
	}
	if (new_entry['req_hor_num'] && new_entry['hay_caballo']) {
		$$("#div-member-horse").show();		
		bolHay = true;
	} else {
		$$("#div-member-horse").hide();
	}
	if (data.horse_num.length>0) {
		$$("#txtMemberHorse").val(data.horse_num);
	}
	if (new_entry['req_own_num'] && new_entry['hay_caballo']) {
		$$("#div-member-owner").show();
		bolHay = true;
	} else {
		$$("#div-member-owner").hide();		
	}
	if (data.owner_num.length>0) {
		$$("#txtMemberOwner").val(data.owner_num);
	}
	if (new_entry['req_qualifier_num'] && new_entry['tipo_qualifier']==3) {
		$$("#div-member-qualifier").show();
		bolHay = true;
	} else {
		$$("#div-member-qualifier").hide();
	}
	if (new_entry['req_venue_num'] || new_entry['accept_dto'] || (new_entry['req_qualifier_num'] && new_entry['tipo_qualifier']==2)) {
		$$("#div-member-venue").show();
		bolHay = true;
		if (new_entry['req_venue_num'] || (new_entry['req_qualifier_num'] && new_entry['tipo_qualifier']==2)) {
			// es imprescindible
			$$("#lbl-member-venue").text("Venue/Organiser Membership Number *");
			$$("#txtMemberVenue").attr("placeholder", "Enter venue/organiser number");
			$$("#txtMemberVenue").attr("name", "txtMemberVenue");
		} else {
			// es solo para descuentos
			$$("#lbl-member-venue").text("Venue/Organiser Membership Number");
			$$("#txtMemberVenue").attr("placeholder", "Enter venue/organiser number (optional)");
			$$("#txtMemberVenue").attr("name", "txtMemberVenue_optional");
		}
	} else {
		$$("#div-member-venue").hide();
	}
	if (data.venue_num.length>0) {
		$$("#txtMemberVenue").val(data.venue_num);
	}
	if (bolHay) {
		Lungo.Router.section("select-memberships");
	}
}

function Mostrar_select_level() {
	$$("#content-select-level").html("");
	var html = "";
	var id_class = $$("#select-lvl-id-class").val();
	if (id_class>0) {
		html = "<div class='box ev-info-nombre-evento'>" + new_entry['nombre_evento'] + "</div>";
		html += "<ul id='list-select-level' class='list'>";
		for (n=0;n<app_niveles_disc.length;n++) {
			if (n%2==0) {
				class_alter = "par";
			} else {
				class_alter = "";
			}
			html += "<li class='li-verde-claro " + class_alter + "' id='lvl_" + id_class + "_" + n + "' onclick='Select_lvl(" + id_class + ", " + n + ");'>" + 
				app_niveles_disc[n][1] + " (" + app_niveles_disc[n][2] + ")</li>";
		}	
		html += "</ul>";
		$$("#content-select-level").html(html);
		Lungo.Router.section("select-level");
	}
}

function Mostrar_formas_pago(data) {
	$$("#content-select-method").html("");
	var html = "", desc_fpago = "";
	$$("#select-method-inscripid").val("0");
	$$("#select-method-eventid").val("0");
	if (data.total!=null && data.id_inscripcion!=null) {
		$$("#select-method-inscripid").val(data.id_inscripcion);
		$$("#select-method-eventid").val(data.id_evento);
		html = "<div class='box ev-info-nombre-evento'>" + data.nombre_evento + "</div>";
		html += "<ul id='list-select-method' class='list'>";
		for (x=0;x<data.comisiones.length; x++) {
			if (x%2==0) {
				class_alter = "par";
			} else {
				class_alter = "";
			}
			fpago = Buscar_elemento_sesion_fpago(data.comisiones[x]["fpago"]);
			if (fpago!=null) {
				total = data.total + data.total_hm + data.total_vat + data.comisiones[x]["comision"];
				if (data.comisiones[x]["comision"]>0) {
					desc_fpago = "<span class='italic85'>" + "(+ fee " + ((fpago["recargo"]>0) ? number_format((fpago["recargo"] * 100),2) + " % + " : "" )+ app_moneda + 
					" " + number_format(fpago["recargo_x_op"],2) + " per entry)</span>";
				} else {
					desc_fpago = "<span class='italic85'>This transaction has not Payment Charges</span>";
				}
				html += "<li id='method_" + data.comisiones[x]["fpago"] + "' class='" + class_alter + "' rel='" + data.comisiones[x]["fpago"] + "'>" +
					"<div class='div-img-method'><img class='radius3 img-method' src='images/" + data.comisiones[x]["imagen"] + "' /></div><div class='box div-nombre-method' >" + 
					"<span class='bold700'>" + ((fpago["id"]!=1) ? "Sagepay " : "") + fpago["nombre"]+ "</span><br>" + desc_fpago +  
					"</div><div class='box div-total-method bold700 radius3'>" +
					app_moneda + " " + number_format(total,2) + 
					"</div><input type='hidden' id='hidden_method_comision_" + data.comisiones[x]["fpago"] + "' value='" + number_format(data.comisiones[x]["comision"],2) + "' />" +
					"<input type='hidden' id='hidden_method_hmfee_" + data.comisiones[x]["fpago"] + "' value='" + number_format(data.total_hm,2) + "' />" + 
					"<input type='hidden' id='hidden_method_total_sin_com_" + data.comisiones[x]["fpago"] + "' value='" + number_format(data.total + data.total_hm + data.total_vat,2) + "' /></li>";	
			}
		}
		html += "</ul><br/>";
		html += "<div class='center-txt'><img class='img-logo-fpago-g radius3' src='images/logo_paypal_g.jpg' /><br/>" + 
			"<img class='img-logo-fpago-g radius3' src='images/logo_sagepay_g.png' /></div>";
		
	}
	$$("#content-select-method").html(html);
	Lungo.Router.section("select-method");	
}

function Rellenar_my_entries(data) {
	$$("#content-my-entries").html("");
	var html = "";
	if (data.length>0) {	
		html += "<div class='div-info-entries'><div class='marco-verde'>All your upcoming and pending entries show here. You can view older entries on our website.</div></div>"; 
		html += "<ul id='list-my-entries' class='list'>";
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = " par ";	
			} else {
				class_alter = "";	
			}
			color = " li-azul-claro ";
			html_count_li = "<div class='div-count-classes'>";
			if (data[i].clases>1) {
				clases = " classes";
			} else {
				clases = " class";
			}
			if (data[i].confirmado==0) {
				status = "Pending";
				color = " li-verde-claro ";
				//html_count_li += "<span class='tag count count_verde marginleft6'>" + data[i].clases + clases + "</span>";
				html_count_li += "<span class='tag count count_verde marginleft6'>" + data[i].clases + "</span>";
			} else {
				status = "Paid";
				//html_count_li += "<span class='tag count marginleft6'>" + data[i].clases + clases + " (PAID)</span>";
				html_count_li += "<span class='tag count marginleft6'>" + data[i].clases + "</span>";
			}
			html_count_li += "</div>";
			numdia = Fecha_a_numdia(data[i].fec_ini);
			mes = Fecha_a_mes(data[i].fec_ini, false);
			/*if (data[i].asociacion!=null) {
				asociacion = data[i].asociacion;
			} else {
				asociacion = "";
			}*/
			color_numdia = " icon-blanco ";
			if (data[i].confirmado==0) {
				color_numdia = " icon-verde-claro blanco ";
			}
			if (data[i].estado!=1) {
				color_numdia = " icon-rojo blanco ";
				color = "li-rojo";
			} 
			html_clase = "<div class='left icon-list-cont " + color_numdia + " box'><div class='div-numdia'>"
				+ numdia + "</div><div class='div-mes'>" + mes + "</div></div>";
			if (data[i].tiempos!=null && data[i].confirmado==1) {
				if (data[i].tiempos.length>0) {
					html_clase += "<div class='left icon-gris-claro div-lvl-class box'><img rel='" + data[i].evento + "_" + data[i].id + 
						"' class='ico-times-entries' src='images/icons/clock_azul.png' /></div>";	
				}
			}
			html_clase += "<div class='div-descrip-clase-select'><span class='bold700'>" + data[i].nombre_evento +"</span>";
			html_clase += "<br><span class='italic90'>" + data[i].venue + " - " + status + " (" + data[i].clases + clases + ")</span></div>";
			html += "<li id='my_entry_" + data[i].id + "' class='arrow " + class_alter + color + "' rel='" + data[i].evento + "_" + data[i].id + "'>" + 
				html_clase +"</li>";
		}
		html += "</ul>";
	} else {
		html = "<div class='div-error'><div class='div-error-content'>"
			+ "<img class='icon-error' src='images/icons/error.png' /><br>ERROR<br><br>"
			+ "There are no pending or confirmed entries</div></div>";		
	}
	$$("#content-my-entries").html(html);
	Lungo.Router.section("my-entries");
}

function Rellenar_view_entry(data) {
	$$("#content-view-entry-classes").html("");
	$$("#content-view-entry-services").html("");
	$$("#more-view-entry-info-event").html("");
	$$("#content-view-entry-docs").html("");
	$$("#fechas-view-entry-info-event").html("");
	$$("#more-view-entry-info-event").html("");
	Lungo.Element.count("#label-view-entry-classes", "0");
	Lungo.Element.count("#label-view-entry-services", "0");
	var html = "", msg_cancel = "";
	$$("#view-entry-nombre-ev1").html(data.info[0].nombre_evento);
	$$("#view-entry-nombre-ev2").html(data.info[0].nombre_evento);
	$$("#view-entry-nombre-ev3").html(data.info[0].nombre_evento);
	$$("#view-entry-nombre-ev4").html(data.info[0].nombre_evento);
	if (Number(data.info[0].estado)==4) {
		msg_cancel = "<div class='centrar'><div class='bottom10 div-center marco-rojo'>This event has been cancelled.</div></div>";
	}
	// PRIMERO RELLENAR LAS CLASES
	if (data.clases!=null) {
		if (data.clases.length>0) {
			html += "<ul id='list-classes' class='list'>" + msg_cancel;
			for (var i = 0; i < data.clases.length; i++) {
				if (i%2==0) {
					class_alter = " class='par' ";
				} else {
					class_alter = "";
				}
				html += "<li rel='" + data.clases[i].id + "' " + class_alter + "><table class='width100'><tr><td class='text-left bold700'>" + nl2br(data.clases[i].clase);
				if (data.clases[i].abrev!=null) {
					if (data.clases[i].abrev.length>0) html += " (" + data.clases[i].abrev + ")";
				} 
				html += "</td><td class='text-right'>";
				if (data.clases[i].time_no_define==1) {
					//no muestra las horas
					html += Fecha_a_dia_hora(data.clases[i].fecha_clase, false) + "</td></tr></table>";
				} else {
					html += Fecha_a_dia_hora(data.clases[i].fecha_clase, true) + "</td></tr></table>";	
				}
				if (data.clases[i].nombre) {			
					html += "<div class='divisor-class'></div><span class='li-class-horse-rider'>Horse: " + data.clases[i].nombre + "</span>";	
				}
				if (data.clases[i].subjinete) {
					html += "<div class='divisor-class'></div><span class='li-class-horse-rider'>Rider: " + data.clases[i].nombre + "</span>";
				}
				html += "</li>"; 
			}
			html += "</ul>";
			$$("#content-view-entry-classes").html(html);
			Lungo.Element.count("#label-view-entry-classes", data.clases.length);			
		}
	}
	if (data.servicios!=null) {
		if (data.servicios.length>0) {
			html = "<ul id='list-services' class='list'>" + msg_cancel;
			for (var i = 0; i < data.servicios.length; i++) {
				if (i%2==0) {
					class_alter = " class='par' ";
				} else {
					class_alter = "";
				}
				html += "<li rel='" + data.servicios[i].id + "' " + class_alter + ">"+ nl2br(data.servicios[i].nombre) + " x " + data.servicios[i].cantidad;
				html += "</li>"; 
			}
			$$("#content-view-entry-services").html(html);
			Lungo.Element.count("#label-view-entry-services", data.servicios.length);			
		} else {
			html = "<div class='pad15 '>" + msg_cancel + "<div class='width100 marco-gris'><br>No services purchased in this entry for this event.<br><br></div></div>";
			$$("#content-view-entry-services").html(html);
		}
	} else {
		html = "<div class='pad15 '>" + msg_cancel + "<div class='width100 marco-gris'><br>No services purchased in this entry for this event.<br><br></div></div>";
		$$("#content-view-entry-services").html(html);
	}
	if (data.info!=null) {
		if (data.info[0].fec_ini == data.info[0].fec_fin) {
			// si son iguales, que no muestre la hora
			fec_fin = Fecha_a_dia_hora(data.info[0].fec_fin, false);
		} else {
			fec_fin = Fecha_a_dia_hora(data.info[0].fec_fin, true);
		}
		html = "";
		html = html + "<div class='width49 left detail-fecha box'><div class='div-fec-ini box'>START</div><div class='div-fec-ini-valor box'>"
				+ Fecha_a_dia_hora(data.info[0].fec_ini, true)
				+ "</div></div><div class='width2 left detail-fecha box'><div class='sep-vertical-fecha box'><div class='sep-vertical box'></div></div></div>"
				+ "<div class='box width49 left detail-fecha'><div class='box div-fec-ini'>END</div><div class='box div-fec-ini-valor'>"
				+ fec_fin + "</div></div><div class='clear'></div>";
		$$("#fechas-view-entry-info-event").html(html);
		html = "";
		// PAYMENT DETAILS
		html += msg_cancel + "<div class='box box-card'><span class='bold700'>Payment details</span>" + 
			"<div class='divisor-class'></div>" + 
			"<table class='width100'>" + 
			"<tr><td class='text-left'>Payment date:</td><td class='text-right'>" + Fecha_a_dia_hora(data.info[0].fec_confirm, true) + "</td></tr>" +
			"<tr><td class='text-left'>Paid by " + data.info[0].fpago + ":</td>" + 
			"<td class='text-right font120 bold700'>" + app_moneda + " " + number_format(data.info[0].total,2) + "</td></tr>" +
			"</table></div>";
		html += "</div>";
		// venue
		if (data.info[0].venue!=null) {
			html += "<div class='box box-card'><span class='bold700'>Venue details</span>" + 
				"<div class='divisor-class'></div>" + data.info[0].venue + "<br/>" + data.info[0].venue_dir;
			if (data.info[0].latitud!=null && data.info[0].longitud!=null) {
				html += "<div class='pinmap-view-entry'><img id='img-pinmap-view-entry' rel='" + data.info[0].latitud + "_" + data.info[0].longitud +
					"' src='images/icons/pinmap_azul.png' /></div>";
			}
			html += "</div>";
		}
		if (data.info[0].asociacion!=null) {
			html += "<div class='box box-card'><span class='bold700'>Association</span>" + 
				"<div class='divisor-class'></div>" + data.info[0].asociacion + "</div>";
		}
		$$("#more-view-entry-info-event").html(html);
		// docs
		html = "";
		html += msg_cancel;
		if (data.info[0].notas!=null) {
			// notas para el secretario
			html += "<div class='box top10 box-card'><span class='bold700'>Notes sent to Secretary</span>" + 
				"<div class='divisor-class'></div>" + data.info[0].notas + "</div>";
		}
		html += "<div class='top10 box box-card box-card-clickable action-down-schedule' rel='" + data.info[0].evento + "'> " +
			"<table class='width100'>" + 
			"<tr><td class='vertical-mid text-left'><span class='span-docs-entry' rel='" + data.info[0].evento + "'>Download schedule</span></td><td class='text-right'>" +
			"<img class='ico-docs' src='images/icons/calendar_azul.png' rel='" + data.info[0].evento + "' /></td></tr>" +
			"</table></div>";
		html += "<div class='box box-card box-card-clickable action-down-entryform' rel='" + data.info[0].id + "' >" +
		"<table class='width100'>" + 
		"<tr><td class='vertical-mid text-left'><span rel='" + data.info[0].id + "' class='span-docs-entry'>Download entry form</span></td><td class='text-right'>" +
		"<img rel='" + data.info[0].id + "' class='ico-docs' src='images/icons/entries_verde.png' /></td></tr>" +
		"</table></div>";
		if (data.info[0].factura>0) {
			html += "<div class='box box-card box-card-clickable action-down-invoice' rel='" + data.info[0].id + "'>" +
			"<table class='width100'>" + 
			"<tr><td class='vertical-mid text-left'><span class='span-docs-entry' rel='" + data.info[0].id + "'>Download invoice</span></td><td class='text-right'>" +
			"<img rel='" + data.info[0].id + "' class='ico-docs' src='images/icons/invoice_gris.png' /></td></tr>" +
			"</table></div>";	
		}
		if (data.info[0].tiempos!=null) {
			html += "<div class='box box-card box-card-clickable action-down-times' rel='" + data.info[0].evento + "'>" +
			"<table class='width100'>" + 
			"<tr><td class='vertical-mid text-left'><span class='span-docs-entry' rel='" + data.info[0].evento + "'>Download times</span></td><td class='text-right'>" +
			"<img rel='" + data.info[0].evento + "' class='ico-docs' src='images/icons/clock_rojo.png' /></td></tr>" +
			"</table></div>";	
		}
		$$("#content-view-entry-docs").html(html);
	}
	Lungo.Router.article("view-entry", "art-view-entry-docs");
}

function Rellenar_servicios_x_evento(data, nombre_evento) {
	$$("#content-add-service").html("");
	var html = "";
	if (data.length>0) {
		html = "<div class='box ev-info-nombre-evento'>" + nombre_evento + "</div>";
		html += "<div class='div-info-entries'><div class='marco-gris'>Select item to add or edit the amount required.</div></div>" + 
			"<ul id='list-add-services' class='list'>";
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = "par";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' class='li-verde-claro " + class_alter + "' >";
			html += "<div id='service_" + data[i].id + "' rel='" + data[i].id + "' class='left icon-gris div-lvl-class box'>" 
				+ "<div class='div-lvl'>" 
				+ "<input type='hidden' id='service_val_" + data[i].id + "' value='" + data[i].cantidad + "' /><span id='span_service_" + data[i].id + "'>" 
				+ data[i].cantidad + "</span></div>" 
				+ "<div class='div-mes'>QTY</div></div>";
			if (data[i].descripcion.length>0) {
				descripcion = "* " + data[i].descripcion;	
			} else {
				descripcion = "";
			}
			html += "<div class='div-descrip-clase-select'><span id='span_nombre_serv_val_" + data[i].id + "'>" + data[i].nombre + "</span>" +  
				"<br><span class='italic90'>" + descripcion + "</span></div></li>";
		}
		html += "</ul>";
		$$("#content-add-service").html(html);
	}
}

function Mostrar_error_fecha_invalida() {
	Mostrar_error_html("For security reasons we validate your log in with using date and time. Please check your device to make sure your setting are correct.", "hm-sad", "Close");	
}

function Rellenar_my_results(data) {
	$$("#content-my-results").html("");
	var html = "";
	if (data.length>0) {
		html += "<ul id='list-my-results' class='list'>";
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = " par ";	
			} else {
				class_alter = "";	
			}
			numdia = Fecha_a_numdia(data[i].fec_ini);
			mes = Fecha_a_mes(data[i].fec_ini, false);
			color_numdia = " icon-blanco ";
			html_linea = "<div class='left icon-list-cont " + color_numdia + " box'><div class='div-numdia'>"
				+ numdia + "</div><div class='div-mes'>" + mes + "</div></div>";
			html_linea += "<div class='div-descrip-clase-select'><span class='bold700'>" + data[i].nombre_evento +"</span>";
			html_linea += "<br><span class='italic90'>" + data[i].venue + ")</span></div>";
			html += "<li id='my_results_" + data[i].id + "' class='arrow li-azul-claro " + class_alter + "' rel='" + data[i].id + "'>" + 
				html_linea +"</li>";
		}
		html += "</ul>";
	} else {
		html = "<div class='div-error'><div class='div-error-content'>"
			+ "<img class='icon-error' src='images/icons/error.png' /><br>ERROR<br><br>"
			+ "There are no results</div></div>";		
	}
	$$("#content-my-results").html(html);
	Lungo.Router.section("my-results");
}

function Mostrar_opciones_premium(bolMostrar) {
	if (bolMostrar) {
		$$("#content-menu-my-results").show();
		$$("#li-my-results").show();
	} else {
		$$("#content-menu-my-results").hide();	
		$$("#li-my-results").hide();
	}
}

