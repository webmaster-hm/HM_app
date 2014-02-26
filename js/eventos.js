/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function(){
	Iniciar_variables_globales();
	document.addEventListener("deviceready", onDeviceReady, false);
	// lo que va ahora debería ir dentro del device ready, pero para web debo ponerlo aqui, para dispositivo cambiarlo de sitio
	Login_automatico();

};

// Cuando el dispositivo este listo
function onDeviceReady(){
    // accedemos a los eventos de Lungo
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);

	//navigator.splashscreen.hide();
	
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



