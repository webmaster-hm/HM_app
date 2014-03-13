/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	// lo que va ahora debería ir dentro del device ready, pero para web debo ponerlo aqui, para dispositivo cambiarlo de sitio
	WS_Obtener_globales(Ok_globales, Error_globales);
};

// Cuando el dispositivo este listo
function onDeviceReady(){
    // accedemos a los eventos de Lungo
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	//navigator.splashscreen.hide();	
}

function Ok_globales(data) {
	app_limite_eventos = data.app_limite_eventos;
	app_dias_vista = data.app_dias_vista;
	app_pais = data.app_pais;
	web_detail = data.web_detail;
	app_moneda = data.app_moneda;
	app_terms_qualifying = data.app_terms_qualifying;
	paypal_clientID = data.paypal_clientID;
	paypal_approved = data.paypal_approved;
	Iniciar_variables_globales();
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
	if ($$('select#frm-address-county option').length<1) {
		WS_Cargar_regiones(app_pais, "#frm-address-county", false);	
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
	if ($$('select#frm-horse-gender option').length<1) {
		WS_Cargar_sexo_caballo();
	}
		
	/* FIN DE CARGA DE DESPLEGABLES */
	Login_automatico();
}

function Error_globales() {
	Lungo.Notification.error('Error', 'Ups! We are really sorry there seems to be an error with the Horse Monkey&apos;s Service.',
			'hm-sad', 2);
	Salir_app();
}

function onOffline() {
    // Handle the offline event
	app_status_network = false;
	Lungo.Notification.error('Error', 'Ups! You are offline. Don&apos;t forget to check your connection you must be online!!!.',
			'hm-sad', 4, Logout());
}

function onOnline() {
    // Handle the online event
	app_status_network = true;
}

function onBackKeyDown() {	 
	var current = $$("section.show");
	if (current.length>0) {
		for (n=0;n<current.length;n++) {
			if (current[n].id=="login") {
				Salir_app();
			} else {
				// si no está logueado, vuelve al inicio del login
				if (sesion_id_user>0) {
					Lungo.Router.back();
				} else {
					Logout();						
				}
			}
		}
	}
}

document.onkeypress=function(e){
    var esIE = (document.all);
    var esNS = (document.layers);
    tecla = (esIE) ? event.keyCode : e.which;

    if(tecla == 13){
        return false;
      }
};



