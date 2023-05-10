/* FlickrInteressantes.js */

const API_KEY = "4d24216fdb5dcfe237dfbab8c85f6f85";

// Declaração do Event Handler para o evento DOMContentLoaded no objecto Document 
document.addEventListener( "DOMContentLoaded", init );


// Esta função é chamada quando se der o evento DOMContentLoaded no objecto Document, isto é, 
// quando a página HTML estiver carregada e a árvore do DOM construída 
function init()
{
    flickrRequest();       
}

function flickrRequest()
{
   var url =  "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=4d24216fdb5dcfe237dfbab8c85f6f85&extras=geo&per_page=24&format=json&nojsoncallback=1";
   // var url = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=" + API_KEY + "&extras=geo&per_page=24&format=json&nojsoncallback=1";
   
   // Criamos um novo objecto da classe XMLHttpRequest
   var xhr = new XMLHttpRequest();
   
   /* Definimos os detalhes do pedido HTTP que vamos realizar:
      - o método HTTP é o GET
      - o URL
      - e true significa que o pedido é assíncrono
   */   
   xhr.open( "GET", url, true );
   
   // Declaração do Event Handler para o evento load no objecto xhr
   xhr.addEventListener("load", processaResposta_JSON);
   
   // Agora sim, é realizado o pedido
   xhr.send();
}


// Esta função é chamada quando se der o evento load no objecto xhr, isto é, 
// quando a resposta ao pedido HTTP tiver completamente chegado 
function processaResposta_JSON( )
{
    var url_foto_pequena, url_foto_grande;

    var objResposta = JSON.parse( this.responseText);
    var arrayFotos = objResposta.photos.photo;
    
    for( let foto of arrayFotos )
    {
        // Obtenção dos URLs da foto em tamanho pequeno e médio
        url_foto_pequena = constroiURL_photo(foto.farm, foto.server, foto.id, foto.secret, "s");
        url_foto_media = constroiURL_photo(foto.farm, foto.server, foto.id, foto.secret, "c");

        console.log(url_foto_pequena);
        console.log(url_foto_media);

        // Construção de HTML
        constroiHTML_photo(url_foto_pequena, url_foto_media, foto.title);
    }
}


/*
  Documentação em  https://www.flickr.com/services/api/misc.urls.html
  sobre a construção dos URLs das fotos

  https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg

  https://farm9.staticflickr.com/8754/17324569936_01bc18bd18_c.jpg
  
*/
function constroiURL_photo( farm_id, server_id, photo_id, secret, size )
{  
  //return  "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + photo_id + "_" + secret + "_" + size + ".jpg";
  
  return  `https://farm${farm_id}.staticflickr.com/${server_id}/${photo_id}_${secret}_${size}.jpg`;
}


/* OUTPUT 
   Associado a uma Foto, construir 
    um hiperlink <a> com href com o url da foto de tamanho médio
        contendo um <img> com src com a url da foto de tamanho pequeno
            com alt com o title da Foto
    
    Ex: 
    <a href="https://farm66.staticflickr.com/65535/50576120286_4744cdf195_c.jpg">
        <img src="https://farm66.staticflickr.com/65535/50576120286_4744cdf195_s.jpg"
             alt="St Mary's Church, Dinton">
    </a>        
    
    Adicionar o hiperlink criado ao <div id="fotos">
    
    Declarar a resposta ao evento click no hiperlink 
      como sendo a chamada da função showPhotoMedia 

*/
function constroiHTML_photo( url_photo_pequena, url_photo_media, title )
{
    /* CODIFICAR usando a API do DOM   */ 
    var divFotos = document.querySelector("#fotos");

    // Criar novos elementos
    var hiperlink = document.createElement("a");
    var img = document.createElement("img");

    // Definir-lhes atributos
    hiperlink.setAttribute("href", url_photo_media);
    img.setAttribute("src", url_photo_pequena);
    img.setAttribute("alt", title);

    // Definir a resposta ao evento click no hiperlink
    hiperlink.addEventListener("click", showPhotoMedia );

    // Fazer as ligações
    divFotos.appendChild(hiperlink);
    hiperlink.appendChild(img);
    
}


// Mostra a imagem da foto tamanho médio correspondente à de tamanho pequeno que foi clickada
function showPhotoMedia( e )
{
    /* CODIFICAR usando a API do DOM   */
    //alert("Mostrar imagem grande");
    var img = document.querySelector("#imagem");
    var p = document.querySelector("#titulo");

    // this   representa o objecto onde ocorreu o evento
    // this   representa o hiperlink que foi clickado
    
    var url_foto_grande = this.getAttribute("href");
    var title = this.firstElementChild.getAttribute("alt");

    img.setAttribute("src", url_foto_grande);
    img.setAttribute("alt", title);

    p.textContent = title;
    
    e.preventDefault();
    
}



