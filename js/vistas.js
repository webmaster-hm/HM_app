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
		if (data.clases.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Classes</div>";
			var txt_clases = "<ol>";
			for (i = 0; i < data.clases.length; i++) {
				txt_clases += "<li>" + data.clases[i].nombre + "</li>";
			}
			txt_clases += "</ol>";
			html2 = html2 + "<div class='box ev-info-datos'>" + txt_clases
					+ "</div>";
		}

		html2 = html2
				+ "<div class='box ev-info-nombre-evento'>Share event</div>";
		html2 = html2 + "<div class='box ev-info-media-social'>";
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
		html2 = html2 + "</div>";

		if (data.notas.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Notes</div>";
			html2 = html2 + "<div class='box ev-info-datos'>"
					+ nl2br(data.notas) + "<br><br></div>";
		}
		if (data.description.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Latest news</div>";
			html2 = html2 + "<div class='box ev-info-datos'>"
					+ nl2br(data.description) + "<br><br></div>";
		}
		if (data.coaches.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Coaches</div>";
			html2 = html2 + "<div class=box 'ev-info-datos'>"
					+ nl2br(data.coaches) + "<br><br></div>";
		}
		if (data.sponsor.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Sponsors</div>";
			html2 = html2 + "<div class='box ev-info-datos'>"
					+ nl2br(data.sponsor) + "<br><br></div>";
		}
		if (data.jueces.length > 0) {
			html2 = html2
					+ "<div class='box ev-info-nombre-evento'>Judges</div>";
			html2 = html2 + "<div class='box ev-info-datos'>"
					+ nl2br(data.jueces) + "<br><br></div>";
		}

		// datos del venue
		html2 = html2
				+ "<div class='box ev-info-nombre-evento'>Venue Details</div>";
		html2 = html2
				+ "<div class='box ev-info-datos'><span class='bold700'>Address</span><br>"
				+ nl2br(data.direccion) + "<br>";
		if (data.telefono.length > 0) {
			html2 = html2 + nl2br(data.telefono) + "<br><br>";
		}
		if (data.email.length > 0) {
			html2 = html2 + "Email<br>" + nl2br(data.email) + "<br><br>";
		}
		html2 = html2 + "</div>";
		html2 = html2
				+ "<input type='hidden' id='event_detail_latitud' value='0' />";
		html2 = html2
				+ "<input type='hidden' id='event_detail_longitud' value='0' />";

		$$("#ev-info-parte1").html(html1);
		$$("#ev-info-parte2").html(html2);
		$$("#btn-enter-event").attr("rel", data.id);
		$$("#btn-map-enter-event").attr("rel", data.id);
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
			html += "<div class='box ev-info-nombre-evento ev-info-border-top'>Venue</div>";
			html += "<div class='box ev-info-datos center-txt'>" + data.venue_nombre + "<br></div>";
		}
		if (data.fed_nombre!=null) {
			html += "<div class='box ev-info-nombre-evento'>Association</div>";
			html += "<div class='box ev-info-datos center-txt'>" + data.fed_nombre + "<br></div>";
		}
		$$("#more-info-event").html(html);
		// si hay productos, mostrar los servicios vacios con el + para añadir
		if (data.nservicios>0) {
			Rellenar_servicios_inscripcion_vacia(false);
		}
	}
}

function Rellenar_clases_inscripcion_vacio() {
	$$("#content-my-inscrip-classes").html("");
	var html = "<ul id='list-classes' class='list'>";
	html += "<li rel='0' class='add'>ADD CLASS<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";
	html += "</ul>";
	Lungo.Element.count("#label-inscrip-classes", "0");
	$$("#my-inscrip-nclases").val("0");
	$$("#content-my-inscrip-classes").html(html);
}

function Rellenar_clases_inscripcion(data) {
	$$("#content-my-inscrip-classes").html("");
	var html = "<ul id='list-classes' class='list'>";
	html += "<li rel='0' class='add'>ADD CLASS<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";
	if (data.length>0) {
		for (var i = 0; i < data.length; i++) {
			if (i%2==0) {
				class_alter = " class='par' ";
			} else {
				class_alter = "";
			}
			html += "<li rel='" + data[i].id + "' " + class_alter + ">"+ nl2br(data[i].clase);
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
			html += "<li rel='0' class='add'>ADD CLASS<div rel='0' class='addclass div-action-add-class icon-list-right icon-add-class'></div></li>";	
		}*/
	}
	html += "</ul>";
	$$("#content-my-inscrip-classes").html(html);
}

function Rellenar_servicios_inscripcion(data) {
	$$("#content-my-inscrip-services").html("");
	var html = "<ul id='list-services' class='list'>";
	html += "<li rel='0' class='add'>ADD SERVICE/PRODUCT<div rel='0' class='addservice div-action-add-class icon-list-right icon-add-class'></div></li>";
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
		html += "<li rel='0' class='add'>ADD SERVICE/PRODUCT<div rel='0' class='addservice div-action-add-class icon-list-right icon-add-class'></div></li>";
		html += "</ul>";	
	}
	Lungo.Element.count("#label-inscrip-services", "0");
	$$("#content-my-inscrip-services").html(html);
}

function Rellenar_totales_inscripcion(data) {
	$$("#summary-content").html("");
	$$("#summary-content2").html("");
	var total_final = data.total + data.total_hm + data.total_vat + data.total_paypal; 
	Lungo.Element.count("#label-inscrip-checkout", app_moneda + " " + number_format(total_final,2));
	var html = "<table class='width100 font110 line180'>";
	html += "<tr><td class='td1-summary'>NET:</td><td class='td2-summary'>" + app_moneda + " <span id='net_payment'>" + number_format(data.total,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>HM Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='hm_fee_payment'>" + number_format(data.total_hm,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>VAT:</td><td class='td2-summary'>" + app_moneda + " <span id='vat_payment'>" + number_format(data.total_vat,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>Paypal Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='paypal_payment'>" + number_format(data.total_paypal,2) + "</span></td></tr>";
	html += "<tr><td colspan='2'><div class='divisor-class'></div></td></tr>";
	html += "<tr><td class='td1-summary font120 bold700'>Total Payment:</td><td class='td2-summary font120 bold700'>" + app_moneda + " <span id='total_payment'>" + number_format(total_final,2) + "</span></td></tr>";
	html += "</table>";
	var html2 = "<span class='font80 color-gris'>* V.A.T. only be applicable to HM Fee.</span><br><br>";
	var late_entry = "Your entry is still on time! No late entry fees on this transaction!";
	if (data.late_entry) {
		late_entry = "Your entry includes a late fee " + app_moneda + number_format(data.fee_late,2) + " per class.";
	}	
	html2 += "<div class='width100 marco-gris'>" + late_entry + "</div><br><br>";
	if (total_final>0) {
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
		html2 += "<a href='#' id='btn-buy-paypal' class='button anchor margin-bottom'><span class='icon shopping-cart'></span><abbr>Buy with PayPal</abbr></a>";
		html2 += "</div>";		
	}
	$$("#summary-content").html(html);
	$$("#summary-content2").html(html2);
}

function Rellenar_totales_inscripcion_vacia(evento) {
	$$("#summary-content").html("");
	$$("#summary-content2").html("");
	Lungo.Element.count("#label-inscrip-checkout", app_moneda + " 0.00");
	var html = "<table class='width100 font110 line180'>";
	html += "<tr><td class='td1-summary'>NET:</td><td class='td2-summary'>" + app_moneda + " <span id='net_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>HM Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='hm_fee_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>VAT:</td><td class='td2-summary'>" + app_moneda + " <span id='vat_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td class='td1-summary'>Paypal Fee:</td><td class='td2-summary'>" + app_moneda + " <span id='paypal_payment'>" + number_format(0,2) + "</span></td></tr>";
	html += "<tr><td colspan='2'><div class='divisor-class'></div></td></tr>";
	html += "<tr><td class='td1-summary font120 bold700'>Total Payment:</td><td class='td2-summary font120 bold700'>" + app_moneda + " <span id='total_payment'>" + 
		number_format(0,2) + "</span></td></tr>";
	html += "</table>";
	var html2 = "<span class='font80 color-gris'>* V.A.T. only be applicable to HM Fee.</span><br><br>";
	$$("#summary-content").html(html);
	$$("#summary-content2").html(html2);
}

function Rellenar_clases_disponibles_evento(data) {
	$$("#content-select-class").html("");
	var html = "";
	if (data.length>0) {
		html = "<ul id='list-select-class-entry' class='list'>";
		for (var i = 0; i < data.length; i++) {
			html_clase = "";
			if (i%2==0) {
				class_alter = " par ";
			} else {
				class_alter = "";
			}
			color = "li-verde-claro";
			numdia = Fecha_a_numdia(data[i].fecha);
			mes = Fecha_a_mes(data[i].fecha, false);
			html_clase = "<div class='left icon-list-cont icon-blanco box'><div class='div-numdia'>"
					+ numdia
					+ "</div><div class='div-mes'>"
					+ mes
					+ "</div></div>";
			html_clase += "<div class='div-descrip-clase-select'>" + data[i].descripcion + "<br><span class='italic90'>Fee: " + app_moneda + " " + data[i].precio + "</span></div>";
			//html_clase += "<div class='div-chk-clase-select'><input type='checkbox' class='inline right' name='chk_select_class_" + data[i].id + "' id='chk_select_class" + data[i].id + "' /></div>";
			html += 	"<li rel='" + data[i].id + "' class='" + color + " " + class_alter + "'>"
							+ html_clase + "</li>";			
		}
		html += "</ul>";
		$$("#content-select-class").html(html);
	}
	Lungo.Router.section("select-class");
}

function Rellenar_clases_disponibles_evento_vacia() {
	$$("#content-select-class").html("");
	Lungo.Router.section("select-class");
}

function Rellenar_lista_caballos(data) {
	$$("#content-select-horse").html("");
	var html = "";
	if (data.length>0) {
		html = "<ul id='list-select-horse-entry' class='list'>";
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
		html += "<div class='actions-list'><a href='#' id='btn-new-horse' class='button anchor margin-bottom'><span class='icon plus'></span><abbr>Add new horse</abbr></a><br>";
		html += "<a href='#' id='btn-edit-horse' class='button anchor margin-bottom edit ancla-disabled'><span class='icon pencil'></span><abbr>Edit horse</abbr></a></div>";
		$$("#content-select-horse").html(html);
	}
	Lungo.Router.section("select-horse");
}

function Rellenar_lista_caballos_vacia() {
	$$("#content-select-horse").html("");
	html = "<ul id='list-select-horse-entry' class='list'>";
	html += "</ul>";
	html += "<div class='actions-list'><a href='#' id='btn-new-horse' class='button anchor margin-bottom'><span class='icon plus'></span><abbr>Add new horse</abbr></a><br>";
	html += "<a href='#' id='btn-edit-horse' class='button anchor margin-bottom edit ancla-disabled'><span class='icon pencil'></span><abbr>Edit horse</abbr></a></div>";
	$$("#content-select-horse").html(html);
	Lungo.Router.section("select-horse");
}

function Rellenar_cmb_sexo_caballo(data) {
	Rellenar_combo(data, "#frm-horse-gender", "");
}

function Rellenar_ficha_caballo(data) {
	var id_caballo = parseInt(data[0].id);
	if (id_caballo>0) {
		$$("#txtDOB").val(data[0].dob);
		$$("#frm-horse-gender").val(data[0].sexo);
		$$("#txtOwner").val(data[0].owner);
		$$("#txtHorse").val(data[0].nombre);	
		Lungo.Router.section("my-horse");
	}
}