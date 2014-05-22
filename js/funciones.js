
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
	if (sesion_perfil==2 || sesion_perfil==3) {
		WS_Cargar_events_favs();	
	} else {
		Mostrar_error_defecto("This option is only available to riders/yards.");
	}
}

function Abrir_eventos_cercanos() {
	WS_Cargar_events_near();	
}

function Abrir_my_results() {
	WS_Cargar_my_results();
}

/**
 * Abre la seccion de select date del calendario de search events
 * @param bol_es_from
 */
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

/**
 * Llama al ws de cargar eventos por filtros
 */
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
	if (window.google) {
		// dibujar mapa grande
		$$("#map_event_latitud").val(latitud_destino);
		$$("#map_event_longitud").val(longitud_destino);
		Dibujar_mapa(latitud_destino, longitud_destino, "content_map_event", true);
		Lungo.Router.section("map-event");		
	}
}

function Abrir_ruta_externa(latitud_destino, longitud_destino) {
	if (window.google) {
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
	//$("#art-view-doc").scrollTop(0);
	document.getElementById("art-view-doc").scrollTop = 0;
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
	if (sesion_perfil==2 || sesion_perfil==3) {
		if (eventId>0) {
			WS_Comprobar_puede_apuntarse(eventId, Abrir_tras_comprobar, Error_no_puede_inscribirse, eventId);
		}	
	} else {
		Mostrar_error_defecto("This option is only available to riders/yards.");
	}
}

function Abrir_tras_comprobar(data) {
	$$("#my-inscrip-eventid").val(data.id);
	$$("#my-inscrip-inscripid").val(0);
	WS_Leer_datos("id, evento", "v_inscripcion", "evento = " + data.id.toString() + " AND confirmado = 0 AND jinete = " + sesion_id_user.toString(), "", 
			Cargar_datos_inscripcion, Cargar_datos_inscripcion_vacia);
}

function Error_no_puede_inscribirse(eventId) {
	Mostrar_error_defecto("Ups! You can&apos;t enter in this event because the registration time is over or has been cancelled.");
}

function Cargar_datos_inscripcion(data) {
	$$("#my-inscrip-inscripid").val(data[0].id);
	WS_Cargar_info_event_para_inscrip(data[0].evento, data[0].id, sesion_id_user);
}

function Cargar_datos_inscripcion_vacia() {
	var evento = $$("#my-inscrip-eventid").val();
	WS_Cargar_info_event_para_inscrip(evento, 0, sesion_id_user);
}

function Validar_checkout_entry(id_inscripcion) {
	var bolOk = true;
	// comprobar los checks si están marcados
	if ($$("input#chk_accept_hm").length>0) {
		if (!document.getElementById('chk_accept_hm').checked) {
			Mostrar_error_defecto("Ups! You must accept HM Terms & Conditions.");
			bolOk = false;
			return bolOk;
		}
	}	
	if ($$("input#chk_accept_qualifying").length>0) {
		if (!document.getElementById('chk_accept_qualifying').checked) {
			Mostrar_error_defecto("Ups! You must accept Qualifying Terms & Conditions.");
			bolOk = false;
			return bolOk;
		}
	}	
	if ($$("input#chk_special").length>0) {
		if (!document.getElementById('chk_special').checked) { 
			Mostrar_error_defecto("Ups! You must accept Special  Terms & Conditions.");
			bolOk = false;
			return bolOk;
		}
	}
	if ($$("input#chk_adult").length>0) {
		if (!document.getElementById('chk_adult').checked) { 
			Mostrar_error_defecto("Ups! This entry must be verified by a responsible adult.");
			bolOk = false;
			return bolOk;
		}
	}	
	var total = $$("#net_payment").text();
	if (!total>0) {
		Mostrar_error_defecto("Ups! The total net must be greater than 0.00.");
		bolOk = false;
		return bolOk;
	}
	return bolOk;
}

function Comprar_paypal(importe, id_inscripcion) {
	if (Validar_checkout_entry(id_inscripcion)) {
		WS_Validar_inscripcion_paypal(importe, id_inscripcion, sesion_id_user, $$("#my-inscrip-eventid").val(), 
				sesion_perfil, Efectuar_compra_paypal, Error_validacion_compra);
	}
}

function Comprar_ahora(id_inscripcion) {
	if (Validar_checkout_entry(id_inscripcion)) {
		WS_Cargar_totales_inscrip($$("#my-inscrip-eventid").val(), id_inscripcion, sesion_id_user, Mostrar_formas_pago);
		/*WS_Validar_inscripcion(importe, id_inscripcion, sesion_id_user, $$("#my-inscrip-eventid").val(), 
				sesion_perfil, Efectuar_compra, Error_validacion_compra);*/
	}
}

function Error_validacion_compra(estado, tipo, mensaje, clases) {
	if (estado==false) {
		switch (tipo) {
			case "no_address":
				$$("#div-my-address-info").html("<div class='width100 marco-rojo'>" + mensaje + "</div>");
				Abrir_my_address(true);
				break;
			case "no_mobile":
				$$("#div-my-address-info").html("<div class='width100 marco-rojo'>" + mensaje + "</div>");
				Abrir_my_address(true);
				break;
			case "full_class":
				// confirmation
				Apuntar_lista_espera_clase_full(mensaje, clases, true);
				break;
			case "services_error":
				Lungo.Notification.html(Generar_notification_html(mensaje, "hm-sad"), "Close");
				Lungo.Router.article("my-inscrip", "art-my-inscrip-services");
				break;
			default:
				Lungo.Notification.html(Generar_notification_html(mensaje, "hm-sad"), "Close");
				break;
		}
	}
}

function Abrir_my_address(limpiar_form) {
	if (limpiar_form) {
		Limpiar_form_address();
		Cargar_address();
	}
	Lungo.Router.section("my-address");
}

function Cargar_address() {
	WS_Cargar_direccion_usuario(Rellenar_form_address, Limpiar_form_address);
}

function Rellenar_form_address(data) {
	$$('#txtAddress').val(data.direccion);
	$$('#txtAddress2').val(data.direccion2);
	$$('#txtTown').val(data.ciudad);
	$$('#txtPostcode').val(data.cp);
	$$('#txtMobile').val(data.movil);
	$$('#frm-address-county').val(data.region);
}

function Limpiar_form_address() {
	$$('#txtAddress').val('');
	$$('#txtAddress2').val('');
	$$('#txtTown').val('');
	$$('#txtPostcode').val('');
	$$('#txtMobile').val('');
	$$('#frm-address-county').val(0);
}

function Efectuar_compra_paypal(importe, id_inscripcion) {
	if (app_es_DEBUG) {
		paypal_moneda = "USD";	
		paypal_entorno = "PayPalEnvironmentSandbox";
	} else {
		paypal_entorno = "PayPalEnvironmentProduction";
	}
	if (app_es_IOS) {
		var clientIDs = {
				paypal_entorno: paypal_clientID
		};		
		PayPalMobile.init(clientIDs, function() {
			var config = new PayPalConfiguration({merchantName: "Horse Monkey", 
				merchantPrivacyPolicyURL: "https://horsemonkey.com/privacypolicy", 
				merchantUserAgreementURL: "https://horsemonkey.com/terms_buyersandothers"});
			PayPalMobile.prepareToRender(paypal_entorno, config, function(){
				var payment = new PayPalPayment(importe.toString(), paypal_moneda, "Entry_" + id_inscripcion.toString(), "Sale");
				// single payment
				PayPalMobile.renderSinglePaymentUI(payment, Compra_completada_paypal, Compra_cancelada);
			});
		}); 
	} else if (app_es_Android) {
		// Choices are "PayPalEnvironmentNoNetwork", "PayPalEnvironmentSandbox", or  "PayPalEnvironmentProduction"
		window.plugins.PayPalMobile.setEnvironment(paypal_entorno);
		// en test moneda USD
		var payment = new PayPalPayment(importe.toString(), paypal_moneda, "Entry_" + id_inscripcion.toString());
		var paypal_business = ""; // no hace falta en teoria, porque al pasar el clientID ya sabe los datos
		window.plugins.PayPalMobile.prepareForPayment(paypal_clientID);
		window.plugins.PayPalMobile.presentPaymentUI(paypal_clientID, paypal_business, paypal_business, 
				payment, Compra_completada_paypal, Compra_cancelada);	
	}
}

function Compra_completada_paypal(data) {
	var pay_id = data.response['id'];
	var pay_state = data.response['state'];
    var pay_date = data.response['create_time'];
    var total_hm = $$("#hidden_method_hmfee_1").val();
    var paypal_fee = $$("#hidden_method_comision_1").val();
    if (pay_state==paypal_approved && pay_id.length>0) {
    	// comprobar por ws el estado de la transaccion
    	WS_Comprobar_pago_paypal(pay_id, total_hm, paypal_fee, Compra_verificada, Compra_no_verificada);
    }
}

function Compra_cancelada(reason) {
	   console.log("Payment cancelled: " + reason);
}

function Compra_verificada(data) {
	var id_inscripcion = $$("#my-inscrip-inscripid").val();
	WS_Leer_datos("confirmado", "v_inscripcion", " id = " + id_inscripcion.toString(), "", function (data) {
		if (data[0]["confirmado"] ==1 || data[0]["confirmado"]=="1") {
			Modificar_history_back("my-inscrip", "detail-event");
			//Comprobar_si_notification_is_show();
			Lungo.Notification.success("Success", "You payment is being processed. Once approved you will receive a confirmation email and you will find the details in MY ENTRIES.<br/>" +  
				"<br/>If you want Monkey to give you directions to this show please allow your phone to access Maps", "check", 10, Abrir_my_entries);
		} else {
			Compra_no_verificada();	
		}
	},
	function () {
		Compra_no_verificada();
	});
}

function Compra_no_verificada() {
	Modificar_history_back("my-inscrip", "detail-event");
	//Comprobar_si_notification_is_show();
	Lungo.Notification.success("Warning", "You payment is pending approval. If you do not receive an email confirming your entry or you do not find " + 
		"your entry in MY ENTRIES please get in touch <a href='mailto:contact@horsemonkey.com'>contact@horsemonkey.com</a>.", "question-sign", 10, Abrir_my_entries);
}

function Validar_form_address() {
	var bolOk = false;
	var direccion = $$('#txtAddress').val();
	var ciudad = $$('#txtTown').val();
	var cp = $$('#txtPostcode').val();
	var movil = $$('#txtMobile').val();
	direccion = direccion.trim();
	ciudad = ciudad.trim();
	cp = cp.trim();
	movil = movil.trim();
	if (direccion.length < 1) {
		Mostrar_error_defecto('Ups! Your address is required field.');
		//$('#txtAddress').select();
		document.getElementById("txtAddress").select();
	} else if (ciudad.length<1) {
		Mostrar_error_defecto('Ups! Your town is required field.');
		//$('#txtTown').select();
		document.getElementById("txtTown").select();
	} else if (cp.length<1) {
		Mostrar_error_defecto('Ups! Your postal code is required field.');
		//$('#txtPostcode').select();
		document.getElementById("txtPostcode").select();
	} else if (movil.length<1) {
		Mostrar_error_defecto('Ups! Your mobile number is required field.');
		//$('#txtMobile').select();
		document.getElementById("txtMobile").select();
	} else {
		bolOk = true;
	}
	return bolOk;
}

function Actualizar_direccion() {
	if (Validar_form_address()) {
		var direccion = $$('#txtAddress').val();
		var direccion2 = $$('#txtAddress2').val();
		var ciudad = $$('#txtTown').val();
		var cp = $$('#txtPostcode').val();
		var movil = $$('#txtMobile').val();
		var region = $$('#frm-address-county').val();
		direccion = direccion.trim();
		ciudad = ciudad.trim();
		cp = cp.trim();
		movil = movil.trim();
		direccion2 = direccion2.trim();
		WS_Actualizar_direccion(sesion_id_user, direccion, direccion2, ciudad, cp, movil, region);
	}
}

function Quitar_clase_inscrip(id_detalle) {
	if (id_detalle>0) {
		var eventId = $$("#my-inscrip-eventid").val();
		var id_inscripcion = $$("#my-inscrip-inscripid").val();
		WS_Eliminar_clase(id_detalle, eventId, id_inscripcion, Redibujar_inscrip);
	}
}

/**
 * 
 * @param pregunta
 * @param id_detalle
 * @param tipo, si tipo es "clase" ira a eliminar clase, sino a eliminar servicio
 * @returns
 */
function Confirmar_eliminar_clase_servicio(pregunta, id_detalle, tipo) {
	Comprobar_si_notification_is_show();
	Lungo.Notification.confirm({
	    icon: 'hm-rider',
	    title: 'Confirm this operation?',
	    description: pregunta, 
	    accept: {
	        icon: 'ok',
	        label: 'Yes',
	        callback: function(){ 
	        	if (tipo=="clase") {
	        		Quitar_clase_inscrip(id_detalle);
	        	} else {
	        		Quitar_servicio_inscrip(id_detalle);
	        	}
	        }
	    },
	    cancel: {
	        icon: 'remove',
	        label: 'No',
	        callback: function(){ return false; }
	    }
	});	
}

function Quitar_servicio_inscrip(id_detalle) {
	if (id_detalle>0) {
		var eventId = $$("#my-inscrip-eventid").val();
		var id_inscripcion = $$("#my-inscrip-inscripid").val();
		WS_Eliminar_servicio(id_detalle, eventId, id_inscripcion, Redibujar_inscrip);
	}
}

function Redibujar_inscrip(data) {
	var eventId = $$("#my-inscrip-eventid").val();
	if (data.clases==0) {
		// a cero todo
		$$("#my-inscrip-inscripid").val(0);
		Rellenar_totales_inscripcion_vacia(eventId);
		Rellenar_clases_inscripcion_vacio();
		if (data.n_servicios>0) {
			Rellenar_servicios_inscripcion_vacia(false);
		} else {
			//servicios vacios, no acepta
			Rellenar_servicios_inscripcion_vacia(true);
		}
	} else {
		// quitar elemento li
		// comprobar si viene de clases o de servicios
		if (data.origen=="clases") {
			// clases
			Rellenar_totales_inscripcion(data);
			Lungo.Element.count("#label-inscrip-classes", data.clases);
			$$("#my-inscrip-nclases").val(data.clases.toString());
			var clase_li = $$("#list-classes li[rel='" + data.id_detalle + "']");
			clase_li.remove();
		} else {
			// servicios
			Rellenar_totales_inscripcion(data);
			Lungo.Element.count("#label-inscrip-services", data.servicios);
			if (data.servicios>0) {
				var servicio_li = $$("#list-services li[rel='" + data.id_detalle + "']");
				servicio_li.remove();	
			} else {
				Rellenar_servicios_inscripcion_vacia(false);
			}
		}
	}
}

function Anadir_productos_inscripcion() {
	var eventId = $$("#add-service-eventId").val();
	var productos = [], cantidades = [];
	$$("#list-add-services li").each(function(indice, elemento) {
		productos.push($$(elemento).attr("rel"));
		cantidades.push($$("#service_val_" + $$(elemento).attr("rel")).val());
	});
	if (productos.length>0) {
		WS_Anadir_productos_inscrip(eventId, sesion_id_user, productos, cantidades, function(data) {
			Ocultar_notification();
			if (data.id_inscripcion>0) {
				Rellenar_totales_inscripcion(data);
				Lungo.Element.count("#label-inscrip-services", data.servicios);
				Modificar_history_back("add_service", "my-inscrip");
				WS_Cargar_servicios_inscrip(data.id_inscripcion, "art-my-inscrip-services");	
			} else {
				Lungo.Router.back();
			}
		}, function(data) {
			if (data==null) {
				Mostrar_error_defecto('Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.');
			} else if (data.msg!="") {
				Lungo.Notification.html(Generar_notification_html(data.msg, "hm-sad"), "Close");
			} else {
				Mostrar_error_defecto('Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.');
			}
			Lungo.Router.back();
		});	
	} else {
		Lungo.Router.back();
	}
}

function Comenzar_proceso_anadir_clase(id_evento) {
	// iniciar variable
	new_entry = [];
	WS_Cargar_info_evento_proceso_anadir_clase(id_evento);
}

function Abrir_select_horse() {
	WS_Cargar_caballos_usuario();
}

/**
 * 
 * @param bol_edit
 * @param id_caballo
 * @param bol_requisitos, si es requisitos, es que al guardar debe aumentar 
 * un paso y comprobar por donde va
 * @returns
 */
function Abrir_my_horse(bol_edit, id_caballo, bol_requisitos) {
	$$("#div-my-horse-info").html("");
	$$("#frm-horse-action abbr").text("Save");
	var dob = Fecha_date_a_formato_HM(new Date());
	$$("#txtDOB").val(dob);
	$$("#frm-horse-bol-edit").val("0");
	$$("#frm-horse-id").val("0");
	$$("#frm-horse-bol-req").val("0");
	$$("#txtOwner").val("");
	$$("#txtHorse").val("");
	$$("#txtHeight").val("");
	if (!bol_edit) {
		// nuevo caballo
		$$("#my-horse header > h1").text("Add new horse");
		Lungo.Router.section("my-horse");
	} else {
		$$("#frm-horse-bol-edit").val("1");
		$$("#frm-horse-id").val(id_caballo.toString());
		if (bol_requisitos) {
			$$("#my-horse header > h1").text("Complete horse details");
			$$("#frm-horse-bol-req").val("1");
			$$("#div-my-horse-info").html("<div class='marco-gris width100'>Please check your horse details to proceed.</div>");
			$$("#frm-horse-action abbr").text("Continue");
		} else {
			$$("#my-horse header > h1").text("Edit horse");
			$$("#frm-horse-bol-req").val("0");
		}
		WS_Cargar_caballo_id(id_caballo);
	}
}

function Guardar_caballo() {
	// validar formulario de caballo
	var dob = "", owner = "", sexo = 0, nombre = "", altura = 0;
	dob = $$("#txtDOB").val();
	sexo = $$("#frm-horse-gender").val();
	owner = $$("#txtOwner").val();
	nombre = $$("#txtHorse").val();
	altura = $$("#txtHeight").val();
	owner = owner.trim();
	nombre = nombre.trim();
	altura = altura.trim();
	if (!(nombre.length>0)) {
		Mostrar_error_defecto("Ups! Horse's name is a mandatory field.");
		return false;
	}
	if (isDate(dob)==false) {
		Mostrar_error_defecto("Ups! Invalid date.");
		return false;
	}
	if (!(sexo>0)) {
		Mostrar_error_defecto("Ups! Gender is a mandatory field.");
		return false;
	}
	if (!(owner.length>0)) {
		Mostrar_error_defecto("Ups! Owner's name is a mandatory field.");
		return false;
	}
	if (!(altura.length>0)) {
		Mostrar_error_defecto("Ups! Horse's height is a mandatory field.");
		return false;
	} else if (!isNumber(altura)) {
		// comprobar si es numerico
		Mostrar_error_defecto("Ups! Horse's height must be a number.");
		return false;
	} else if (!(altura>0)) {
		Mostrar_error_defecto("Ups! Horse's height must be greater than zero.");
		return false;
	}
	var id_caballo = $$("#frm-horse-id").val();
	var viene_requisitos = false;
	if ($$("#frm-horse-bol-req").val()=="1") {
		viene_requisitos = true;
	}
	if (id_caballo>0) {
		WS_Guardar_caballo(nombre, dob, owner, sexo, id_caballo, true, viene_requisitos, altura);	
	} else {
		WS_Guardar_caballo(nombre, dob, owner, sexo, 0, false, false, altura);
	}
}

function Actualizar_lista_caballos(data) {
	if (data.id>0) {
		WS_Cargar_caballos_usuario();
	}
	Lungo.Router.back();
}

/**
 * Esta funcion si está ok debe llamar a check altura (que es la siguiente en las comprobaciones)
 * @param id_caballo
 * @returns
 */
function Comprobar_check_dob_caballo(id_caballo) {
	WS_Leer_datos("checked_dob", "v_caballo", "id = " + id_caballo.toString(), "", 
		function (data) {
			if (data[0].checked_dob=="1" || data[0].checked_dob=="true") {
				if (new_entry['req_horse_height'] && id_caballo>0) {
					Comprobar_altura_caballo(id_caballo);
				} else {
					new_entry['paso_actual'] = 3;
					Comprobar_paso_a_ir();
				}
			} else {
				// editar el caballo
				Abrir_my_horse(true, new_entry['id_caballo'], true);
			}
	}, function () {
		// editar el caballo
		Abrir_my_horse(true, new_entry['id_caballo'], true);
	});
}

/**
 * Esta funcion si está ok debe llamar a check dob (que es la siguiente en las comprobaciones)
 * @param id_caballo
 * @returns
 */
function Comprobar_owner_caballo(id_caballo) {
	WS_Leer_datos("owner", "v_caballo", "id = " + id_caballo.toString(), "", 
		function (data) {
			if (data[0].owner!=null && data[0].owner.length>0) {
				if (new_entry['req_horse_dob'] && id_caballo>0) {
					Comprobar_check_dob_caballo(id_caballo);
				} else {
					new_entry['paso_actual'] = 3;
					Comprobar_paso_a_ir();
				}
			} else {
				// editar el caballo
				Abrir_my_horse(true, new_entry['id_caballo'], true);
			}
	}, function () {
		// editar el caballo
		Abrir_my_horse(true, new_entry['id_caballo'], true);
	});
}

function Comprobar_altura_caballo(id_caballo) {
	WS_Leer_datos("altura", "v_caballo", "id = " + id_caballo.toString(), "", 
		function (data) {
			if (data[0].altura!=null && data[0].altura>0) {
				new_entry['paso_actual'] = 3;
				Comprobar_paso_a_ir();
			} else {
				// editar el caballo
				Abrir_my_horse(true, new_entry['id_caballo'], true);
			}
	}, function () {
		// editar el caballo
		Abrir_my_horse(true, new_entry['id_caballo'], true);
	});
}

function Abrir_select_rider() {
	WS_Cargar_jinetes_usuario();
}

function Abrir_my_rider(bol_edit, id_jinete, bol_requisitos) {
	$$("#div-my-rider-info").html("");
	$$("#frm-rider-action abbr").text("Save");
	var dob = Fecha_date_a_formato_HM(new Date());
	$$("#txtRiderDOB").val(dob);
	$$("#frm-rider-bol-edit").val("0");
	$$("#frm-rider-id").val("0");
	$$("#frm-rider-bol-req").val("0");
	$$("#txtRiderName").val("");
	$$("#txtRiderSurname").val("");
	$$("#frm-rider-gender").val("3"); // por defecto el 3 es "-"
	if (!bol_edit) {
		// nuevo 
		$$("#my-rider header > h1").text("Add new rider");
		Lungo.Router.section("my-rider");
	} else {
		$$("#frm-rider-bol-edit").val("1");
		$$("#frm-rider-id").val(id_jinete.toString());
		if (bol_requisitos) {
			$$("#my-rider header > h1").text("Complete rider details");
			$$("#frm-rider-bol-req").val("1");
			$$("#div-my-rider-info").html("<div class='marco-gris width100'>Please check your rider details to proceed.</div>");
			$$("#frm-rider-action abbr").text("Continue");
		} else {
			$$("#my-rider header > h1").text("Edit rider");
			$$("#frm-rider-bol-req").val("0");
		}
		WS_Cargar_subjinete_id(id_jinete);
	}
}

function Guardar_subjinete() {
	var dob = "", apellido1 = "", sexo = 3, nombre = "";
	dob = $$("#txtRiderDOB").val();
	sexo = $$("#frm-rider-gender").val();
	apellido1 = $$("#txtRiderSurname").val();
	nombre = $$("#txtRiderName").val();
	apellido1 = apellido1.trim();
	nombre = nombre.trim();
	if (!(nombre.length>0)) {
		Mostrar_error_defecto("Ups! Rider's name is a mandatory field.");
		return false;
	}
	if (!(apellido1.length>0)) {
		Mostrar_error_defecto("Ups! Rider's surname is a mandatory field.");
		return false;
	}
	if (isDate(dob)==false) {
		Mostrar_error_defecto("Ups! Invalid date.");
		return false;
	}
	if (!(sexo>0 && sexo<3)) {
		Mostrar_error_defecto("Ups! Gender is a mandatory field.");
		return false;
	}
	var id_subjinete = $$("#frm-rider-id").val();
	var viene_requisitos = false;
	if ($$("#frm-rider-bol-req").val()=="1") {
		viene_requisitos = true;
	}
	if (id_subjinete>0) {
		WS_Guardar_subjinete(nombre, apellido1, dob, sexo, id_subjinete, true, viene_requisitos);
	} else {
		WS_Guardar_subjinete(nombre, apellido1, dob, sexo, 0, false, false);
	}
}

function Actualizar_lista_subjinetes(data) {
	if (data.id>0) {
		WS_Cargar_jinetes_usuario();
	}
	Lungo.Router.back();
}

function Comprobar_check_dob_subjinete(id_subjinete) {
	WS_Leer_datos("checked_dob", "v_subjinete", "id = " + id_subjinete.toString(), "", 
		function (data) {
			if (data[0].checked_dob=="1" || data[0].checked_dob=="true") {
				new_entry['paso_actual'] = 6;
				Comprobar_paso_a_ir();
			} else {
				// editar el rider
				Abrir_my_rider(true, new_entry['id_jinete'], true);
			}
	}, function () {
		// editar el rider
		Abrir_my_rider(true, new_entry['id_jinete'], true);
	});
}

function Comprobar_check_dob_profile() {
	WS_Leer_datos("checked_dob", "v_usuario", "id = " + sesion_id_user.toString(), "", 
			function (data) {
				if (data[0].checked_dob=="1" || data[0].checked_dob=="true") {
					new_entry['paso_actual'] = 6;
					Comprobar_paso_a_ir();
				} else {
					// editar 
					Abrir_my_profile(true);
				}
		}, function () {
			// editar
			Abrir_my_profile(true);
		});
}

function Abrir_my_profile(bol_requisitos) {
	/* siempre es edit */
	$$("#div-my-profile-info").html("");
	$$("#frm-profile-action abbr").text("Save");
	var dob = Fecha_date_a_formato_HM(new Date());
	$$("#txtProfileDOB").val(dob);
	$$("#frm-profile-bol-req").val("0");
	$$("#txtProfileName").val("");
	$$("#txtProfileSurname").val("");
	$$("#frm-profile-gender").val("3"); // por defecto el 3 es "-"
	if (bol_requisitos) {
		$$("#frm-profile-bol-req").val("1");
		$$("#div-my-profile-info").html("<div class='marco-gris width100'>Please check your DOB to proceed.</div>");
		$$("#frm-profile-action abbr").text("Continue");
	} else {
		$$("#frm-profile-bol-req").val("0");
	}
	WS_Cargar_my_profile();
}

function Guardar_my_profile() {
	var dob = "", apellido1 = "", sexo = 3, nombre = "";
	dob = $$("#txtProfileDOB").val();
	sexo = $$("#frm-profile-gender").val();
	apellido1 = $$("#txtProfileSurname").val();
	nombre = $$("#txtProfileName").val();
	apellido1 = apellido1.trim();
	nombre = nombre.trim();
	if (!(nombre.length>0)) {
		Mostrar_error_defecto("Ups! Your name is a mandatory field.");
		return false;
	}
	if (!(apellido1.length>0)) {
		Mostrar_error_defecto("Ups! Your surname is a mandatory field.");
		return false;
	}
	if (isDate(dob)==false) {
		Mostrar_error_defecto("Ups! Invalid date.");
		return false;
	}
	if (!(sexo>0 && sexo<3)) {
		Mostrar_error_defecto("Ups! Gender is a mandatory field.");
		return false;
	}
	var viene_requisitos = false;
	if ($$("#frm-profile-bol-req").val()=="1") {
		viene_requisitos = true;
	}
	WS_Guardar_my_profile(nombre, apellido1, dob, sexo, viene_requisitos);
}

function Select_lvl(id_class, indice) {
	$$("#lvl_" + id_class + "_" + indice).addClass("li-selected");
	$$("#lvl_" + id_class + "_" + indice).addClass("row-selected");
	$$("#class_lvl_val_" + id_class).attr("value", app_niveles_disc[indice][0]);
	$$("#span_class_lvl_" + id_class).text(app_niveles_disc[indice][2]);
	Lungo.Router.back();
	//Lungo.Notification.hide();
}

function Validar_select_memberships()  {
	var rider_num = "", horse_num = "", owner_num = "", venue_num= "", qualy_num = "";
	if ($$("#div-member-horse").css("display")!="none") {
		horse_num = $$("#txtMemberHorse").val();
		horse_num = horse_num.trim();
		if (horse_num.length<1) {
			Mostrar_error_defecto('Ups! Horse number is required field.');
			//$("#txtMemberHorse").select();
			document.getElementById("txtMemberHorse").select();
			return false;
		} else {
			$$("#txtMemberHorse").val(horse_num);
		}
	}
	if ($$("#div-member-owner").css("display")!="none") {
		owner_num = $$("#txtMemberOwner").val();
		owner_num = owner_num.trim();
		if (owner_num.length<1) {
			Mostrar_error_defecto('Ups! Owner number is required field.');
			//$("#txtMemberOwner").select();
			document.getElementById("txtMemberOwner").select();
			return false;
		} else {
			$$("#txtMemberOwner").val(owner_num);
		}
	}
	if ($$("#div-member-rider").css("display")!="none") {
		rider_num = $$("#txtMemberRider").val();
		rider_num = rider_num.trim();
		if (rider_num.length<1) {
			Mostrar_error_defecto('Ups! Rider number is required field.');
			//$("#txtMemberRider").select();
			document.getElementById("txtMemberRider").select();
			return false;
		} else {
			$$("#txtMemberRider").val(rider_num);
		}
	}
	if ($$("#div-member-venue").css("display")!="none") {
		venue_num = $$("#txtMemberVenue").val();
		venue_num = venue_num.trim();
		$$("#txtMemberVenue").val(venue_num);
		// si el name es txtmembervenue es que es requerido
		if (venue_num.length<1 && $$("#txtMemberVenue").attr("name")=="txtMemberVenue") {
			Mostrar_error_defecto('Ups! Venue number is required field.');
			//$("#txtMemberVenue").select();
			document.getElementById("txtMemberVenue").select();
			return false;
		}
	}
	if ($$("#div-member-qualifier").css("display")!="none") {
		qualy_num = $$("#txtMemberQualifying").val();
		qualy_num = qualy_num.trim();
		if (qualy_num.length<1) {
			Mostrar_error_defecto('Ups! Qualifying number card is required field.');
			//$("#txtMemberQualifying").select();
			document.getElementById("txtMemberQualifying").select();
			return false;
		} else {
			$$("#txtMemberQualifying").val(qualy_num);
		}
	}
	return true;
}

function Calcular_comision_x_fpago(total, total_hm_fee, vat, fpago) {
	if (total>0) {
		paypal = (total + total_hm_fee + vat) * sesion_fpago[fpago]["recargo"];
		paypal = sesion_fpago[fpago]["recargo_x_op"];
		//paypal = round((($total + $total_hm_fee + $vat)* $rw['recargo']),2);
		//paypal += round($rw['recargo_x_op'],2);
	} else {
		paypal = 0;
	}
	return paypal;
}

function Abrir_select_lvl(id_class) {
	if (new_entry['lleva_lvl']  && app_niveles_disc.length > 0) {
		$$("#select-lvl-id-class").val(id_class);
		Mostrar_select_level();
	}
}

/**
 * Elimina una clase ya entered al pinchar sobre ella en el add class (select)
 * @param id, id de la clase
 * @returns
 */
function Eliminar_clase_ya_insertada(id, caballo, id_evento, id_inscripcion) {
	Comprobar_si_notification_is_show();
	Lungo.Notification.confirm({
	    icon: 'hm-rider',
	    title: 'Confirm this operation?',
	    description: "You have selected to delete this class. Are you sure?", 
	    accept: {
	        icon: 'ok',
	        label: 'Yes',
	        callback: function(){ 
	        	var eventId = $$("#my-inscrip-eventid").val();
	    		var id_inscripcion = $$("#my-inscrip-inscripid").val();
	        	Comenzar_proceso_eliminar_clase_desde_add(id, caballo, eventId, id_inscripcion);
	        }
	    },
	    cancel: {
	        icon: 'remove',
	        label: 'No',
	        callback: function(){ return false; }
	    }
	});
}

/**
 * 
 * @param id, id de la clase
 * @returns
 */
function Comenzar_proceso_eliminar_clase_desde_add(id, caballo, id_evento, id_inscripcion) {
	var where = "", sql = "";
	where = " v_evento_clase.id = " + id.toString() + 
		" AND v_inscripcion.confirmado = 0 AND v_inscripcion.jinete = " + sesion_id_user.toString();
	if (caballo>0) {
		where += " AND v_inscrip_det.caballo1 = " + caballo.toString();
	}
	sql += " v_inscrip_det.id, (CASE WHEN v_evento_clase.aforo = 0 THEN '-' ELSE (v_evento_clase.aforo - " +  
		" (SELECT COUNT(v_inscrip_det.id) FROM v_inscrip_det INNER JOIN v_inscripcion ON v_inscripcion.id = v_inscrip_det.inscripcion " +  
		" WHERE v_inscripcion.confirmado = 1 AND v_inscripcion.evento = " + id_evento.toString() + " AND v_inscrip_det.evento_clase = v_evento_clase.id) ";
	if (id_inscripcion>0) {
		sql += " - (SELECT COUNT(v_inscrip_det.id) FROM v_inscrip_det INNER JOIN v_inscripcion ON v_inscripcion.id = v_inscrip_det.inscripcion " +
			" WHERE v_inscripcion.confirmado = 0 AND v_inscripcion.evento = " + id_evento.toString() + " AND v_inscripcion.id = " + id_inscripcion.toString() + 
			" AND v_inscrip_det.evento_clase = v_evento_clase.id) ";
	}
	sql += ") END) as disponibles";
	
	WS_Leer_datos(sql, "v_inscrip_det INNER JOIN v_inscripcion ON v_inscripcion.id = v_inscrip_det.inscripcion " + 
		" INNER JOIN v_evento_clase ON v_evento_clase.id = v_inscrip_det.evento_clase", where, "", function (data) {
		var id_detalle = 0;
		id_detalle = data[0].id;
		Quitar_clase_inscrip(id_detalle);
		$$("#class_" + id.toString()).removeClass("li-gris");
		$$("#class_" + id.toString()).removeClass("li-selected");
		$$("#class_" + id.toString()).removeClass("li-entered");
		$$("#class_" + id.toString()).addClass("li-verde-claro");
		$$("#class_" + id.toString() + " .tag").remove();
		// redibujar la fila porque puede estar sin aforo
		var html_count_li = "";
		if (data[0].disponibles=="-") {
			html_count_li = "";
		} else {
			data[0].disponibles = Number(data[0].disponibles) + 1;
			// a disponibles sumarle 1 porque lo he leido antes de eliminarla
			html_count_li = "<span class='tag count marginleft6'>" + data[0].disponibles;
			if (data[0].disponibles >1) {
				html_count_li += " Spaces Left</span>";
			} else {
				html_count_li += " Space Left</span>";	
			}
			color = "li-rojo";
		}
		if (html_count_li.length>0) {
			$$("#class_" + id.toString() + " > div.div-descrip-clase-select").append(html_count_li);	
		}
		//console.log(elem);
	}, function () {
		Mostrar_error_defecto();
	});		
}

function Abrir_para_iframe_sagepay(data) {
	$$("#msg-sagepay").text(data.msg);
	$$("#sagepay-final-charge").html("");
	var html = "";
	if (data.debito!=0 && data.credito!=0 && data.debito!=data.credito) {
		html += "<br/><div class='marco-azul centrar width100 div-center'>Pay with credit card: " + data.credito + "</div>";
		html += "<div class='marco-azul-claro centrar width100 div-center'>Pay with debit card: " + data.debito + "</div>";
		$$("#sagepay-final-charge").html(html);
	} else {
		// da igual debito o credito, porque llevan el total sin comision
		html += "<br/><div class='marco-azul-claro centrar width100 div-center'>Total final: " + data.debito + "</div>";
		$$("#sagepay-final-charge").html(html);
	}
	$$("#iframe-sagepay").attr("src", data.url);
	Modificar_history_back("my-inscrip", "detail-event");
	Lungo.Router.section("sagepay");
}

function Abrir_my_entries() {
	if (sesion_perfil==2 || sesion_perfil==3) {
		//
		WS_Cargar_entries_usuario();		
	} else {
		Mostrar_error_defecto("This option is only available to riders/yards.");
	}
}

function Abrir_view_entry(id, evento) {
	WS_Cargar_info_view_entry(evento, id);	
}

function Apuntar_lista_espera_clase_full(mensaje, clases, bol_volver_atras) {
	Comprobar_si_notification_is_show();
	var lista = "<br/>";
	if (clases.length>0) {
		for (i=0; i<clases.length; i++) {
			if (clases[i].nombre.length>40) {
				lista += "<br/>" + clases[i].nombre.substr(0, 40) + "...";
			} else {
				lista += "<br/>" + clases[i].nombre;
			}
		}	
	} else {
		lista += "<br/>" + clases.nombre;
		if (lista.length>40) {
			lista = lista.substr(0,40) + "...";
		}
	}
	Lungo.Notification.confirm({
	    icon: 'hm-rider',
	    title: 'Join waiting list',
	    description: mensaje + lista,  
	    accept: {
	        icon: 'ok',
	        label: 'Join waiting list',
	        callback: function(){ 
	        	// añadir a lista de espera
	        	WS_Unir_lista_espera(clases, bol_volver_atras);
	        }
	    },
	    cancel: {
	        icon: 'remove',
	        label: 'No',
	        callback: function(){
	        	//Lungo.Router.back();
	        	return false; 
	        }
	    }
	});	
}

function Abrir_add_service(eventId) {
	if (eventId>0) {
		$$("#add-service-eventId").val(eventId);
		// si hay clases se muestra para añadir
		if ($$("#my-inscrip-nclases").val()>0) {
			var nombre_evento = $$("#my-inscrip-nombre-ev2").text();
			//$$("#info-add-service").html("<div class='marco-gris'>You must select each product and amount individually to add them on to your shopping cart:</div>");
			WS_Cargar_servicios_evento(eventId, function (data) {
					Rellenar_servicios_x_evento(data, nombre_evento);
					Lungo.Router.section("add-service"); 
				}, 
				function () { 
					Lungo.Router.back();
				}
			);
		} else {
			Lungo.Notification.html(Generar_notification_html("Ups! You cannot buy a product until you have decided to participate in this event. Please enter a class first.", "hm-sad"), "Close");
		}
	}
}

function Abrir_select_number(valor_ant, id_prod, nombre_prod) {
	$$("#frm-services-quantity").val(valor_ant);
	$$("#select-number-idprod").val(id_prod);
	$$("#titulo-select-number").text(nombre_prod);
	Lungo.Router.section("select-number");
}

function Volver_select_number() {
	var cantidad = $$("#frm-services-quantity").val();
	var id_prod = $$("#select-number-idprod").val();
	$$("#span_service_" + id_prod).text(cantidad);
	$$("#service_val_" + id_prod).val(cantidad);
	Lungo.Router.back();
}

function Abrir_contact() {
	$$('#txtContactName').val("");
	$$('#txtContactEmail').val("");
	$$('#txtContactSubject').val("");
	$$('#txtContactText').val("");
	Lungo.Router.section("contact");
}

function Enviar_contact() {
	if (Validar_contact()) {
		var nombre = $$('#txtContactName').val();
		var email = $$('#txtContactEmail').val();
		nombre = nombre.trim();
		email = email.trim();
		var asunto = $$('#txtContactSubject').val();
		asunto = asunto.trim();
		var mensaje = $$('#txtContactText').val();
		mensaje = mensaje.trim();
		WS_Send_email(nombre, email, app_email_contact, asunto, mensaje, function(data) {
			Lungo.Notification.success("Success", "Your email has been sent successfully.", "check", app_time_msg_error, function() {
				Lungo.Router.back();
				Ocultar_notification();
			});
		}, function() {
			Mostrar_error_defecto();
		});
	}
}

function Validar_contact() {
	var bolOk = false;
	var nombre = $$('#txtContactName').val();
	var email = $$('#txtContactEmail').val();
	nombre = nombre.trim();
	email = email.trim();
	var asunto = $$('#txtContactSubject').val();
	asunto = asunto.trim();
	var mensaje = $$('#txtContactText').val();
	mensaje = mensaje.trim();
	if (nombre.length<1) {
		Mostrar_error_defecto("Ups! Your name is required field.");
		//$('#txtContactName').select();
		document.getElementById("txtContactName").select();
	} else if (email.length<1) {
		Mostrar_error_defecto("Ups! Your email is required field.");
		//$('#txtContactEmail').select();
		document.getElementById("txtContactEmail").select();
	} else if (!Validar_email(email)) {
		Mostrar_error_defecto("Ups! Your email is not valid.");
		//$('#txtContactEmail').select();
		document.getElementById("txtContactEmail").select();
	} else if (asunto.length<1) {
		Mostrar_error_defecto("Ups! The subject is required field.");
		//$('#txtContactSubject').select();
		document.getElementById("txtContactSubject").select();
	} else if (mensaje.length<1) {
		Mostrar_error_defecto("Ups! The message is required field.");
		//$('#txtContactText').select();
		document.getElementById("txtContactText").select();
	} else {
		bolOk = true;
	}
	return bolOk;
}

function Salvar_notas_inscripcion(id_inscrip) {
	var notas = $$("#my-inscrip-notes").val();
	if (id_inscrip>0 && notas.length>0) {
		WS_Actualizar_notas_secretario(notas, id_inscrip, function(data) {
			if (data.estado == true || data.estado == 'true') {	
				Lungo.Notification.success("Success", "Saved!", "check", app_time_msg_error);	
			} else {
				Mostrar_error_defecto();
			}
		});	
	} else {
		Mostrar_error_defecto("Ups! You need to write something so we can save it!");
		document.getElementById("my-inscrip-notes");
	}
	
	
}