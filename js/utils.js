function md5(str) {
	// From: http://phpjs.org/functions
	// + original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// + namespaced by: Michael White (http://getsprink.com)
	// + tweaked by: Jack
	// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + input by: Brett Zamir (http://brett-zamir.me)
	// + bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// - depends on: utf8_encode
	// * example 1: md5('Kevin van Zonneveld');
	// * returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
	var xl;

	var rotateLeft = function(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var addUnsigned = function(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	var _F = function(x, y, z) {
		return (x & y) | ((~x) & z);
	};
	var _G = function(x, y, z) {
		return (x & z) | (y & (~z));
	};
	var _H = function(x, y, z) {
		return (x ^ y ^ z);
	};
	var _I = function(x, y, z) {
		return (y ^ (x | (~z)));
	};

	var _FF = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _GG = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _HH = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _II = function(a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function(str) {
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = new Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str
					.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount]
				| (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function(lValue) {
		var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			wordToHexValue_temp = "0" + lByte.toString(16);
			wordToHexValue = wordToHexValue
					+ wordToHexValue_temp.substr(
							wordToHexValue_temp.length - 2, 2);
		}
		return wordToHexValue;
	};

	var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;

	str = utf8_encode(str);

	x = convertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	xl = x.length;
	for (k = 0; k < xl; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
	return temp.toLowerCase();
}

function utf8_decode(str_data) {
	// discuss at: http://phpjs.org/functions/utf8_decode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// input by: Aman Gupta
	// input by: Brett Zamir (http://brett-zamir.me)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Norman "zEh" Fuchs
	// bugfixed by: hitwork
	// bugfixed by: Onno Marsman
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: kirilloid
	// example 1: utf8_decode('Kevin van Zonneveld');
	// returns 1: 'Kevin van Zonneveld'

	var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0;

	str_data += '';

	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i);
		if (c1 <= 191) {
			tmp_arr[ac++] = String.fromCharCode(c1);
			i++;
		} else if (c1 <= 223) {
			c2 = str_data.charCodeAt(i + 1);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
			i += 2;
		} else if (c1 <= 239) {
			// http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
			c2 = str_data.charCodeAt(i + 1);
			c3 = str_data.charCodeAt(i + 2);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12)
					| ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		} else {
			c2 = str_data.charCodeAt(i + 1);
			c3 = str_data.charCodeAt(i + 2);
			c4 = str_data.charCodeAt(i + 3);
			c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6)
					| (c4 & 63);
			c1 -= 0x10000;
			tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
			tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
			i += 4;
		}
	}
	return tmp_arr.join('');
}

function utf8_encode(argString) {
	// From: http://phpjs.org/functions
	// + original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + improved by: sowberry
	// + tweaked by: Jack
	// + bugfixed by: Onno Marsman
	// + improved by: Yves Sucaet
	// + bugfixed by: Onno Marsman
	// + bugfixed by: Ulrich
	// + bugfixed by: Rafal Kukawski
	// + improved by: kirilloid
	// + bugfixed by: kirilloid
	// * example 1: utf8_encode('Kevin van Zonneveld');
	// * returns 1: 'Kevin van Zonneveld'

	if (argString === null || typeof argString === "undefined") {
		return "";
	}

	var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g,
	// "\n");
	var utftext = '', start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
		} else if (c1 & 0xF800 != 0xD800) {
			enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128,
					(c1 & 63) | 128);
		} else { // surrogate pairs
			if (c1 & 0xFC00 != 0xD800) {
				throw new RangeError("Unmatched trail surrogate at " + n);
			}
			var c2 = string.charCodeAt(++n);
			if (c2 & 0xFC00 != 0xDC00) {
				throw new RangeError("Unmatched lead surrogate at " + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode((c1 >> 18) | 240,
					((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128,
					(c1 & 63) | 128);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
}

function urlencode(str) {
	// From: http://phpjs.org/functions
	// + original by: Philip Peterson
	// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + input by: AJ
	// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + improved by: Brett Zamir (http://brett-zamir.me)
	// + bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + input by: travc
	// + input by: Brett Zamir (http://brett-zamir.me)
	// + bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// + improved by: Lars Fischer
	// + input by: Ratheous
	// + reimplemented by: Brett Zamir (http://brett-zamir.me)
	// + bugfixed by: Joris
	// + reimplemented by: Brett Zamir (http://brett-zamir.me)
	// % note 1: This reflects PHP 5.3/6.0+ behavior
	// % note 2: Please be aware that this function expects to encode into UTF-8
	// encoded strings, as found on
	// % note 2: pages served as UTF-8
	// * example 1: urlencode('Kevin van Zonneveld!');
	// * returns 1: 'Kevin+van+Zonneveld%21'
	// * example 2: urlencode('http://kevin.vanzonneveld.net/');
	// * returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
	// * example 3:
	// urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
	// * returns 3:
	// 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
	str = (str + '').toString();

	// Tilde should be allowed unescaped in future versions of PHP (as reflected
	// below), but if you want to reflect current
	// PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the
	// following.
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27')
			.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
			.replace(/%20/g, '+');
}

function serialize(mixed_value) {
	// discuss at: http://phpjs.org/functions/serialize/
	// original by: Arpad Ray (mailto:arpad@php.net)
	// improved by: Dino
	// improved by: Le Torbi (http://www.letorbi.de/)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
	// bugfixed by: Andrej Pavlovic
	// bugfixed by: Garagoth
	// bugfixed by: Russell Walker (http://www.nbill.co.uk/)
	// bugfixed by: Jamie Beck (http://www.terabit.ca/)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
	// bugfixed by: Ben (http://benblume.co.uk/)
	// input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
	// input by: Martin (http://www.erlenwiese.de/)
	// note: We feel the main purpose of this function should be to ease the
	// transport of data between php & js
	// note: Aiming for PHP-compatibility, we have to translate objects to
	// arrays
	// example 1: serialize(['Kevin', 'van', 'Zonneveld']);
	// returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
	// example 2: serialize({firstName: 'Kevin', midName: 'van', surName:
	// 'Zonneveld'});
	// returns 2:
	// 'a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}'

	var val, key, okey, ktype = '', vals = '', count = 0, _utf8Size = function(
			str) {
		var size = 0, i = 0, l = str.length, code = '';
		for (i = 0; i < l; i++) {
			code = str.charCodeAt(i);
			if (code < 0x0080) {
				size += 1;
			} else if (code < 0x0800) {
				size += 2;
			} else {
				size += 3;
			}
		}
		return size;
	};
	_getType = function(inp) {
		var match, key, cons, types, type = typeof inp;

		if (type === 'object' && !inp) {
			return 'null';
		}
		if (type === 'object') {
			if (!inp.constructor) {
				return 'object';
			}
			cons = inp.constructor.toString();
			match = cons.match(/(\w+)\(/);
			if (match) {
				cons = match[1].toLowerCase();
			}
			types = [ 'boolean', 'number', 'string', 'array' ];
			for (key in types) {
				if (cons == types[key]) {
					type = types[key];
					break;
				}
			}
		}
		return type;
	};
	type = _getType(mixed_value);

	switch (type) {
	case 'function':
		val = '';
		break;
	case 'boolean':
		val = 'b:' + (mixed_value ? '1' : '0');
		break;
	case 'number':
		val = (Math.round(mixed_value) == mixed_value ? 'i' : 'd') + ':'
				+ mixed_value;
		break;
	case 'string':
		val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
		break;
	case 'array':
	case 'object':
		val = 'a';
		/*
		 * if (type === 'object') { var objname =
		 * mixed_value.constructor.toString().match(/(\w+)\(\)/); if (objname ==
		 * undefined) { return; } objname[1] = this.serialize(objname[1]); val =
		 * 'O' + objname[1].substring(1, objname[1].length - 1); }
		 */

		for (key in mixed_value) {
			if (mixed_value.hasOwnProperty(key)) {
				ktype = _getType(mixed_value[key]);
				if (ktype === 'function') {
					continue;
				}

				okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
				vals += this.serialize(okey) + this.serialize(mixed_value[key]);
				count++;
			}
		}
		val += ':' + count + ':{' + vals + '}';
		break;
	case 'undefined':
		// Fall-through
	default:
		// if the JS object has a property which contains a null value, the
		// string cannot be unserialized by PHP
		val = 'N';
		break;
	}
	if (type !== 'object' && type !== 'array') {
		val += ';';
	}
	return val;
}

/**
 * 
 * @param fecha
 * @param mes_largo,
 *            true o false
 * @returns {String}
 */
function Fecha_a_cadena_corta(fecha, mes_largo, mostrar_ano) {
	var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday",
			"Thursday", "Friday", "Saturday");
	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
			"Aug", "Sep", "Oct", "Nov", "Dec");
	var m_names_large = new Array("January", "February", "March", "April",
			"May", "June", "Jule", "August", "September", "October",
			"November", "December");

	var limpiar_espacio = fecha.split(" ");
	var myDateArray = limpiar_espacio[0].split("-");
	var d = new Date(myDateArray[0], myDateArray[1] - 1, myDateArray[2]);
	var curr_day = d.getDay(); // dia de la semana
	var curr_date = d.getDate();
	var sup = "";
	if (curr_date == 1 || curr_date == 21 || curr_date == 31) {
		sup = "st";
	} else if (curr_date == 2 || curr_date == 22) {
		sup = "nd";
	} else if (curr_date == 3 || curr_date == 23) {
		sup = "rd";
	} else {
		sup = "th";
	}
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	var txt = "";
	if (mes_largo) {
		txt = (d_names[curr_day] + ", " + curr_date + " " + m_names_large[curr_month]);
	} else {
		txt = (curr_date + " " + m_names[curr_month]);
	}
	if (mostrar_ano) {
		txt = txt + " " + curr_year.toString();
	}
	return txt;
}

/**
 * 
 * @param fecha
 *            de formato HM Y-m-d H:i
 * @param mostrar_hora,
 *            para ocultar o no la hora
 * @returns {String}
 */
function Fecha_a_dia_hora(fecha, mostrar_hora) {
	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
			"Aug", "Sep", "Oct", "Nov", "Dec");
	var m_names_large = new Array("January", "February", "March", "April",
			"May", "June", "Jule", "August", "September", "October",
			"November", "December");
	var limpiar_espacio = fecha.split(" ");
	var myDateArray = limpiar_espacio[0].split("-");
	var d = new Date(myDateArray[0], myDateArray[1] - 1, myDateArray[2]);
	var curr_day = d.getDay();
	var curr_date = d.getDate();
	var sup = "";
	var result = "";
	if (curr_date == 1 || curr_date == 21 || curr_date == 31) {
		sup = "st";
	} else if (curr_date == 2 || curr_date == 22) {
		sup = "nd";
	} else if (curr_date == 3 || curr_date == 23) {
		sup = "rd";
	} else {
		sup = "th";
	}	
	var actual = new Date();
	var ano = "";
	if (actual.getUTCFullYear()!=d.getUTCFullYear()) {
		ano = d.getUTCFullYear();
		ano = ano.toString().substr(2,2);
	}
	var curr_month = d.getMonth();
	var limpiar_hora = limpiar_espacio[1].split(":");
	var hora = limpiar_hora[0] + ":" + limpiar_hora[1];
	if (hora == "00:00" || mostrar_hora == false) {
		result = (curr_date + " " + m_names[curr_month] + " " + ano);
	} else {
		result = (curr_date + " " + m_names[curr_month] + " "  + ano + " " + hora);
	}
	return result.trim();
}

/**
 * Retorna dia
 * 
 * @param fecha
 *            de formato HM Y-m-d H:i
 * @returns {String}
 */
function Fecha_a_numdia(fecha) {
	var limpiar_espacio = fecha.split(" ");
	var myDateArray = limpiar_espacio[0].split("-");
	var d = new Date(myDateArray[0], myDateArray[1] - 1, myDateArray[2]);
	var curr_day = d.getDate();
	curr_day = Num_2_dig(curr_day);
	return curr_day;
}

/**
 * Retorna mes largo o corto
 * 
 * @param fecha
 *            de formato HM Y-m-d H:i
 * @param mes_largo,
 *            boolean
 * @returns
 */
function Fecha_a_mes(fecha, mes_largo) {
	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
			"Aug", "Sep", "Oct", "Nov", "Dec");
	var m_names_large = new Array("January", "February", "March", "April",
			"May", "June", "Jule", "August", "September", "October",
			"November", "December");
	var limpiar_espacio = fecha.split(" ");
	var myDateArray = limpiar_espacio[0].split("-");
	var d = new Date(myDateArray[0], myDateArray[1] - 1, myDateArray[2]);
	var curr_month = d.getMonth();
	var actual = new Date();	
	if (mes_largo) {
		return m_names_large[curr_month];
	} else {
		if (actual.getUTCFullYear()!=d.getUTCFullYear()) {
			var ano = d.getUTCFullYear();
			ano = ano.toString().substr(2,2);
			return m_names[curr_month] + " " + ano;
		} else {
			return m_names[curr_month];	
		}
	}
}

/**
 * 
 * @param fecha
 *            de tipo DATE
 */
function Fecha_date_a_formato_HM(fecha) {
	var r = fecha.getFullYear().toString() + "-"
			+ Num_2_dig((fecha.getMonth() + 1).toString()) + "-"
			+ Num_2_dig(fecha.getDate().toString());
	return r;
}

/**
 * Parametro fecha por referencia, lo cambia y lo devuelve cambiado con la suma
 * 
 * @param fecha,
 *            tipo date
 * @param dias,
 *            integer
 * @returns {Date}
 */
function Sumar_dias_a_date(fecha, dias) {
	var tiempo = fecha.getTime();
	var n_horas = dias * 24;
	var milisegundos = parseInt(n_horas * 60 * 60 * 1000);
	fecha.setTime(tiempo + milisegundos);
	return fecha;
}

/* convierte saltos de linea en BR, segun html o xhtml */
function nl2br(string/* , is_HTML */) {
	var br = arguments[1] ? '<br>' : '<br />';
	return string.replace(/\r\n|\n|\r/g, br);
}

function Quitar_br(string) {
	var br = string.replace("<br>", "");
	br = br.replace("<br/>", "");
	return br;
}

function Pausa(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

function Num_2_dig(valor) {
	if (valor < 10) {
		valor = "0" + valor;
	}
	return valor;
}

function Validar_email(val) {
	if (!val.match(/\S+@\S+\.\S+/)) { // Jaymon's / Squirtle's solution
		// do something
		return false;
	}
	if (val.indexOf(' ') != -1 || val.indexOf('..') != -1) {
		// do something
		return false;
	}
	return true;
}

/**
 * 
 * @returns {Array}, año, mes (de 1 a 12), dia, hora y minutos
 */
function Fecha_UTC() {
	var exd = new Date();
	var arr = new Array(exd.getUTCFullYear(), (exd.getUTCMonth() + 1), exd
			.getUTCDate(), exd.getUTCHours(), exd.getUTCMinutes());
	return arr;
}

function Obtener_navegador() {
	var env = $$.environment();
	var nav = "";
	if (!env.isMobile) {
		nav = navigator.appCodeName;
	} else {
		nav = env.browser;
	}
	return nav;
}

function number_format(number, decimals, dec_point, thousands_sep) {
	var n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 0
			: Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ','
			: thousands_sep, dec = (typeof dec_point === 'undefined') ? '.'
			: dec_point, s = '', toFixedFix = function(n, prec) {
		var k = Math.pow(10, prec);
		return '' + Math.round(n * k) / k;
	};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

function Generar_notification_html(mensaje, icon) {
	var r = "<div class='pad6'><span class='icon " + icon + "'></span><br>"
			+ mensaje + "</div>";
	return r;
}

function isDate(date) {
	var parts = date.match(/(\d+)/g);
	if(!isNaN(new Date(parts[0], parts[1]-1, parts[2]).getTime())) {
		return true;
	} else {
		return false;
	}
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

