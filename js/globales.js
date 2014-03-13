	// VARIABLES GLOBALES
	var ws_hm = ""; //direccion del webservice 
	var web_detail = "";
	var token_ws = "1111111111111111111111111"; // token de validacion para el webservice
	var app_token_key = "2222222222222222222222222"; // se usa para encriptar y desencriptar
	var ws_msg_error = "KO";
	var app_limite_eventos = 0;
	var app_dias_vista = 0; /* numero de dias del filtro de eventos */
	var app_search_from = new Date();
	var app_search_to = new Date();
	var cal_objeto = null; /* global del calendario */
	var storage = null;
		
	var map = null;
	var map_detail = null;
	var map_markersArray = [];
	var map_detail_markersArray = [];
	var app_google_coords = null;
	var app_latitud_destino = 0; /* esto es para pintar la ruta y para usar como global a la hora de dibujar el mapa en detail event */
	var app_longitud_destino = 0; /* esto es para pintar la ruta y para usar como global a la hora de dibujar el mapa en detail event */
	var app_latitud = 0;
	var app_longitud = 0;
	var app_edad_cache_coords = 600000; /* 10 minutos */
	var app_latitud_defecto = 51.5075256;
	var app_longitud_defecto = -0.12794959999996536;
	var app_pais = 1;
	var app_status_network = true; // por defecto True para hacer pruebas en web
	var app_moneda = "";
	var app_terms_qualifying = "";
	
	var paypal_clientID = "";
	var paypal_moneda = "GBP";
	var paypal_approved = "";
	
	/*
	app_latitud_defecto = 53.47502679999999; // aintree para pruebas
	app_longitud_defecto = -2.952388;
	*/
	
	var url_facebook = "http://www.facebook.com/share.php?u=";
	var url_twitter = "http://twitter.com/?status=";
	var url_googleplus = "https://plus.google.com/share?url=";
	
	/* VARIABLES DE SESION */
	var sesion_id_user = 0;
	var sesion_nombre = "";
	var sesion_perfil = 0;
	
	/* VARIABLES POR INSCRIPCION DE CLASE */
	var new_entry = [];
	