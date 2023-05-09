/* oTempoQueFaz.js */

// API Key para a AccuWeather API
const apiKey = "F6EJOcAebfsNeHMeP6Uv4ulqS83sm3Ho";

// Chave da localização obtida pela AccuWeather Locations API 
var locationKey;

window.addEventListener('DOMContentLoaded', initApp );


// Inicializa a aplicação
function initApp()
{ 
	console.log( "Init App!! ");

	// Obter as coordenadas geográficas do utilizador
	// utilizando a HTML5 Geolocation API
	// navigator.geolocation.watchPosition( mostrarLocalizacao, mostrarErro );
	navigator.geolocation.getCurrentPosition( mostrarLocalizacao, mostrarErro );
	
	//pedirCondicoesActuaisTempo();	
}



/* Efectuar um pedido à Current Conditions API (uma das APIs do AccuWeather )
       - GET Current Conditions	

   
*/
function pedirCondicoesActuaisTempo()
{
	//var urlPedidoAccuWeather = 'http://dataservice.accuweather.com/currentconditions/v1/275484?apikey=F6EJOcAebfsNeHMeP6Uv4ulqS83sm3Ho&metric=true&language=pt&details=true';
	// var urlPedidoAccuWeather = "http://dataservice.accuweather.com/currentconditions/v1/275484?apikey=" + apiKey + "&metric=true&language=pt&details=true";
	var urlPedidoAccuWeather = "https://dataservice.accuweather.com/currentconditions/v1/" 
	                           + locationKey + "?apikey=" + apiKey + "&metric=true&language=pt&details=true";

	// Criar um novo objecto da classe XMLHttpRequest
	var xhr = new XMLHttpRequest();

	xhr.open('GET', urlPedidoAccuWeather );

	// Quando a resposta ao pedido chegar, executar 
	xhr.addEventListener('load', mostrarCondicoesActuais )
	xhr.send();
}

function mostrarCondicoesActuais(evt)
{
	var xhr = this;		// ou xhr = evt.target 

	alert( xhr.responseText );

	var respJson = xhr.responseText;
	var respObj = JSON.parse( respJson );

	// Extrair do objecto os dados da Temperatura, Icon e Texto Descritivo
	// e colocá-los em variáveis simples 
	var temperatura = respObj[0].Temperature.Metric.Value;
	var iconNumber = respObj[0].WeatherIcon;
	var descricao = respObj[0].WeatherText;


	// Seleccionar os elementos HTML pelo seu id  
	var strTemperatura = document.querySelector('#temperatura');
	var imgIcon = document.querySelector('#iconTempo');
	var strDescricao = document.querySelector('#descricao');


	// Actualizar a página HTML ( a nossa UI user interface )
	// neste caso o conteúdo de texto (textContent) dos elementos HTML
	// com os dados obtidos no serviço do AccuWeather  
	strTemperatura.textContent = temperatura;
	strDescricao.textContent = descricao;
	
	// o iconNumber tem de ter 2 digitos inteiros, ex: 1 será 01
	iconNumber = iconNumber.toLocaleString( undefined, { minimumIntegerDigits:2 } );

	// e actualizar também a imagem com o icon do estado do tempo
	var urlIcon = "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/" +
				   iconNumber + "-s.png";
	imgIcon.setAttribute('src', urlIcon );					
}

// Callback de sucesso passado ao método watchPosition ou getCurrentPosition
function mostrarLocalizacao( position )
{
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	console.log( 'Obtida localização:', latitude, longitude );

	// Seleccionar os elementos com os id 'latitude'  e 'longitude'
	var strLatitude = document.querySelector('#latitude');
	var strLongitude = document.querySelector('#longitude');

	strLatitude.textContent = latitude;
	strLongitude.textContent = longitude;

	obterLocationKey( latitude, longitude );
}	

// Callback de erro passado ao método watchPosition
function mostrarErro( positionError )
{
	console.log( 'Erro ' , positionError.code , positionError.message );
}

function getRequest( url, callback )
{
	// Criar um novo objecto da classe XMLHttpRequest
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url );

	// Quando a resposta ao pedido chegar, 
	// executar a função definida no parâmetro callback 
	xhr.addEventListener('load', callback )
	xhr.send();
}

function obterLocationKey( lat, lng )
{
	// http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=F6EJOcAebfsNeHMeP6Uv4ulqS83sm3Ho&q=39.610477499999995,-8.4019861&language=pt
	var urlPedidoAccuWeather = "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + 
	                           apiKey + "&q=" + lat + ',' + lng + "&language=pt";    

	getRequest( urlPedidoAccuWeather, mostrarLocationKey );
}

function mostrarLocationKey()
{
	var xhr = this;		// ou xhr = evt.target 

	alert( xhr.responseText );

	var respJson = xhr.responseText;
	var respObj = JSON.parse( respJson );

	// Variável Global
	locationKey = respObj.Key;	

	var localidade = respObj.LocalizedName;

	// Seleccionar os elementos com os id 'localidade'  e 'locationKey'
	var strLocalidade = document.querySelector('#localidade');
	var strLocationKey = document.querySelector('#locationKey');

	strLocalidade.textContent = localidade;
	strLocationKey.textContent = locationKey;

	pedirCondicoesActuaisTempo();  
}