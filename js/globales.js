	// VARIABLES GLOBALES
	var ws_hm = ""; // URL DEL WEBSERVICE AL QUE CONECTAMOS
	var app_es_DEBUG = true; // la compra la hace con valores de test
	var app_es_Web = true;
	var app_es_IOS = false;
	var app_es_Android = false;
	var web_detail = "";
	var token_ws = "EEEEEEEEEEEEEEEEEEEEEEEE";
	var app_token_key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // se usa para encriptar y desencriptar
	var ws_msg_error = "KO";
	var app_u = "";
	var app_limite_eventos = 0;
	var app_dias_vista = 0; /* numero de dias del filtro de eventos */
	var app_search_from = new Date();
	var app_search_to = new Date();
	var app_time_msg_error = 3;
	var app_medium_time_msg_error = 5;
	var app_long_time_msg_error = 7;
	var cal_objeto = null; /* global del calendario */
	var storage = null;
	var app_ruta_docs = "cdvfile://localhost/temporary/horsemonkey/docs/";
	var app_premium = true;
		
	var map = null;
	var map_detail = null;
	var map_markersArray = [];
	var map_detail_markersArray = [];
	var app_google_coords = null;
	var app_latitud_destino = 0; /* esto es para pintar la ruta y para usar como global a la hora de dibujar el mapa en detail event */
	var app_longitud_destino = 0; /* esto es para pintar la ruta y para usar como global a la hora de dibujar el mapa en detail event */
	var app_latitud = 0;
	var app_longitud = 0;
	var app_edad_cache_coords = 0; /* 300000 = 5 minutos */
	var app_latitud_defecto = 0; //51.5075256;
	var app_longitud_defecto = 0; //-0.12794959999996536;
	var app_pais = 1;
	var app_status_network = false; // por defecto True para hacer pruebas en web
	var app_moneda = "";
	var app_terms_qualifying = "";
	var app_niveles_disc = [];
	var app_email_contact = "";
	var app_status_token_ok = false; // se usa para comprobar que la fecha y hora es correcta, la del usuario
	
	var paypal_clientID = "";
	var paypal_moneda = "GBP"; // por defecto
	var paypal_approved = "";
	var paypal_entorno = "PayPalEnvironmentSandbox"; // por defecto
	
	
	var url_facebook = "http://www.facebook.com/share.php?u=";
	var url_twitter = "http://twitter.com/?status=";
	var url_googleplus = "https://plus.google.com/share?url=";
	
	/* VARIABLES DE SESION */
	var sesion_id_user = 0;
	var sesion_nombre = "";
	var sesion_perfil = 0;
	var sesion_fpago = [];
	
	/* VARIABLES POR INSCRIPCION DE CLASE */
	var new_entry = [];

	