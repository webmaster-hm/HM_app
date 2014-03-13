
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
		Lungo.Notification.error("Error", "This option is only available to riders/yards.","hm-sad", 3);
	}
}

function Abrir_eventos_cercanos() {
	WS_Cargar_events_near();	
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
	if (sesion_perfil==2 || sesion_perfil==3) {
		if (eventId>0) {
			WS_Comprobar_puede_apuntarse(eventId, Abrir_tras_comprobar, Error_no_puede_inscribirse, eventId);
		}	
	} else {
		Lungo.Notification.error("Error", "This option is only available to riders/yards.","hm-sad", 3);
	}
}

function Abrir_tras_comprobar(data) {
	$$("#my-inscrip-eventid").val(eventId);
	$$("#my-inscrip-inscripid").val(0);
	WS_Leer_datos("id, evento", "v_inscripcion", "evento = " + eventId.toString() + " AND confirmado = 0 AND jinete = " + sesion_id_user.toString(), "", 
			Cargar_datos_inscripcion, Cargar_datos_inscripcion_vacia);
}

function Error_no_puede_inscribirse(eventId) {
	Lungo.Notification.error("Error", "Ups! You can&apos;t enter in this event because the registration time is over or has been cancelled.",
			"hm-sad", 3);
}

function Cargar_datos_inscripcion(data) {
	$$("#my-inscrip-inscripid").val(data.id);
	WS_Cargar_info_event_para_inscrip(data.evento, data.id, sesion_id_user);
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
			Lungo.Notification.error("Error", "Ups! You must accept HM Terms & Conditions.",
					"hm-sad", 2);
			bolOk = false;
			return bolOk;
		}
	}	
	if ($$("input#chk_accept_qualifying").length>0) {
		if (!document.getElementById('chk_accept_qualifying').checked) { 
			Lungo.Notification.error("Error", "Ups! You must accept Qualifying Terms & Conditions.",
					"hm-sad", 2);
			bolOk = false;
			return bolOk;
		}
	}	
	if ($$("input#chk_special").length>0) {
		if (!document.getElementById('chk_special').checked) { 
			Lungo.Notification.error("Error", "Ups! You must accept Special  Terms & Conditions.",
					"hm-sad", 2);
			bolOk = false;
			return bolOk;
		}
	}
	if ($$("input#chk_adult").length>0) {
		if (!document.getElementById('chk_adult').checked) { 
			Lungo.Notification.error("Error", "Ups! This entry must be verified by a responsible adult.",
					"hm-sad", 2);
			bolOk = false;
			return bolOk;
		}
	}	
	var total = $$("#total_payment").text();
	if (!total>0) {
		Lungo.Notification.error("Error", "Ups! The total payment must be greater than 0.00.",
				"hm-sad", 2);
		bolOk = false;
		return bolOk;
	}
	return bolOk;
}

function Comprar_paypal(importe, id_inscripcion) {
	if (Validar_checkout_entry(id_inscripcion)) {
		WS_Validar_inscripcion(importe, id_inscripcion, sesion_id_user, $$("#my-inscrip-eventid").val(), 
				sesion_perfil, Efectuar_compra, Error_validacion_compra);
	}
}

function Error_validacion_compra(estado, tipo, mensaje) {
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
	WS_Cargar_direccion_usuario(Rellenar_form_address);
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

function Efectuar_compra(importe, id_inscripcion) {
	// Choices are "PayPalEnvironmentNoNetwork", "PayPalEnvironmentSandbox", or
	// "PayPalEnvironmentProduction"
	/*
	window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentSandbox");
	  
	// en test moneda USD
	paypal_moneda = "USD";
	  
	var payment = new PayPalPayment(importe, paypal_moneda, "Entry_" + id_inscripcion.toString());
	var paypal_business = ""; // no hace falta en teoria, porque al pasar el clientID ya sabe los datos
	window.plugins.PayPalMobile.prepareForPayment(paypal_clientID);
	window.plugins.PayPalMobile.presentPaymentUI(paypal_clientID, paypal_business, paypal_business, 
			payment, Compra_completada, Compra_cancelada);*/
}

function Compra_completada(data) {
	var pay_id = data.response['id'];
	var pay_state = data.response['state'];
    var pay_date = data.response['create_time'];
    var total_hm = $("#hm_fee_payment").text();
    var paypal_fee = $("#paypal_payment").text();
    if (pay_state==paypal_approved && pay_id.length>0) {
    	// comprobar por ws el estado de la transaccion
    	WS_Comprobar_pago_paypal(pay_id, total_hm, paypal_fee, Compra_verificada, Compra_no_verificada);
    }
}

function Compra_cancelada(reason) {
	   console.log("Payment cancelled: " + reason);
}

function Compra_verificada(data) {
	
}

function Compra_no_verificada() {
	
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
		Lungo.Notification.error('Error',
				'Ups! Your address is required field.', 'hm-sad', 2);
		$('#txtAddress').select();
	} else if (ciudad.length<1) {
		Lungo.Notification.error('Error',
				'Ups! Your town is required field.', 'hm-sad', 2);
		$('#txtTown').select();
	} else if (cp.length<1) {
		Lungo.Notification.error('Error',
				'Ups! Your postal code is required field.', 'hm-sad', 2);
		$('#txtPostcode').select();
	} else if (movil.length<1) {
		Lungo.Notification.error('Error',
				'Ups! Your mobile number is required field.', 'hm-sad', 2);
		$('#txtMobile').select();
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
	Lungo.Notification.confirm({
	    icon: 'user',
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

function Abrir_add_service(eventId) {
	if (eventId>0) {
		$$("#add-service-eventId").val(eventId);
		$$("#frm-services-quantity").val("1");
		// si hay clases se muestra para añadir
		if ($$("#my-inscrip-nclases").val()>0) {
			$$("#info-add-service").html("<div class='marco-gris'>Please select from the drop down menu the products or services that you want to add to your entry:</div>");
			$$("#frm-add-service").removeAttr("disabled");
			WS_Cargar_servicios_evento(eventId, function (data) {
					Rellenar_combo(data, "#frm-services", "Select service/product");
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

function Anadir_producto_inscripcion() {
	var eventId = $$("#add-service-eventId").val();
	var producto = parseInt($$("#frm-services").val());
	var cantidad = parseInt($$("#frm-services-quantity").val());
	if (producto>0) {
		if (cantidad>0) {
			WS_Anadir_producto_inscrip(eventId, sesion_id_user, producto, cantidad, 
				function(data) {
					Rellenar_totales_inscripcion(data);
					Lungo.Element.count("#label-inscrip-services", data.servicios);
					if (data.servicios>0) {
						if (data.servicios%2==0) {
							class_alter = "";
						} else {
							class_alter = " class='par' ";
						}
						html = "";
						html += "<li rel='" + data.id + "' " + class_alter + ">"+ nl2br(data.nombre) + " x " + cantidad;
						html += "<div rel='" + data.id + "' class='removeservice div-action-class icon-list-right icon-remove-class'></div></li>";
						$$("#list-services").append(html);
					}
					Lungo.Router.back();
				}, function(data) {
					if (data==null) {
						Lungo.Notification.error("Error", "Unsuccessful operation.","hm-sad", 2);
					} else if (data.msg!="") {
						Lungo.Notification.html(Generar_notification_html(data.msg, "hm-sad"), "Close");
					} else {
						Lungo.Notification.error("Error", "Unsuccessful operation.","hm-sad", 2);
					}
					Lungo.Router.back();
				}
			);	
		} else {
			Lungo.Notification.error("Error", "Ups! Quantity must be a valid number and greater than zero.",
					"hm-sad", 2);
		}		
	} else {
		Lungo.Notification.error("Error", "Ups! You must select a service/product.",
				"hm-sad", 2);
	}
}

function Comenzar_proceso_anadir_clase(id_evento) {
	// iniciar variable
	new_entry = [];
	WS_Cargar_info_evento_proceso_anadir_clase(id_evento, 
		function (data) {
		new_entry = JSON.parse( JSON.stringify(data));
		new_entry['paso_actual'] = 1;
		new_entry['id_evento'] = id_evento;
			Comprobar_paso_a_ir();
			//WS_Cargar_clases_evento_disponibles(id_evento);
		}, 
		function (data) {
			Lungo.Notification.error("Error", "Unsuccessful operation","hm-sad", 2);
		}
	);
}

function Comprobar_paso_a_ir() {
	if (new_entry['abierto'] && new_entry['libres']>0) {
		switch (new_entry['paso_actual']) {
			case 1:
				if (new_entry['competicion']==3) {
					new_entry['paso_actual'] = 3;
					// llamar a las funciones del paso 3
				} else {
					Abrir_select_horse();					
				}
				break;
			case 2:
				if (new_entry['req_horse_dob'] || new_entry['req_owner_name']) {
					
				}
				break;
			case 3: 
				
				break;
		}
	}
}

function Abrir_select_horse() {
	WS_Cargar_caballos_usuario();
}

function Abrir_my_horse(bol_edit, id_caballo) {
	if (!bol_edit) {
		// nuevo caballo
		$$("#my-horse header > h1").text("Add new horse");
		var dob = Fecha_date_a_formato_HM(new Date());
		$$("#txtDOB").val(dob);
		$$("#frm-horse-bol-edit").val("0");
		$$("#frm-horse-id").val("0");
		$$("#txtOwner").val("");
		$$("#txtHorse").val("");
		Lungo.Router.section("my-horse");
	} else {
		$$("#my-horse header > h1").text("Edit horse");
		$$("#frm-horse-bol-edit").val("1");
		$$("#frm-horse-id").val(id_caballo.toString());
		WS_Cargar_caballo_id(id_caballo);
	}
}

function Guardar_caballo() {
	// validar formulario de caballo
	var dob = "", owner = "", sexo = 0, nombre = "";
	dob = $$("#txtDOB").val();
	sexo = $$("#frm-horse-gender").val();
	owner = $$("#txtOwner").val();
	nombre = $$("#txtHorse").val();
	owner = owner.trim();
	nombre = nombre.trim();
	if (!(nombre.length>0)) {
		Comprobar_si_notification_is_show();
		Lungo.Notification.error("Error", "Ups! Horse's name is a mandatory field.","hm-sad", 2);
		return false;
	}
	if (isDate(dob)==false) {
		Comprobar_si_notification_is_show();
		Lungo.Notification.error("Error", "Ups! Invalid date.",
				"hm-sad", 2);		
		return false;
	}
	if (!(sexo>0)) {
		Comprobar_si_notification_is_show();
		Lungo.Notification.error("Error", "Ups! Gender is a mandatory field.","hm-sad", 2);
		return false;
	}
	if (!(owner.length>0)) {
		Comprobar_si_notification_is_show();
		Lungo.Notification.error("Error", "Ups! Owner's name is a mandatory field.","hm-sad", 2);
		return false;
	}
	var id_caballo = $$("#frm-horse-id").val();
	if (id_caballo>0) {
		WS_Guardar_caballo(nombre, dob, owner, sexo, id_caballo, true);	
	} else {
		WS_Guardar_caballo(nombre, dob, owner, sexo, 0, false);
	}
}

function Actualizar_lista_caballos(data) {
	if (data.id>0) {
		WS_Cargar_caballos_usuario();
	}
	Lungo.Router.back();
}