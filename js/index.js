const apiKey = "2b6c4801d3c5f0dcc6137bcb86e2afef";
const hash = "9d649ab9475fea5f51ac617b8dbf7b8f";
const apiURL = `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${apiKey}&hash=${hash}`;

let marvelData;

let favoriteHeroes = [];

const getSuperHeroes = () => {
    return fetch(apiURL)
        .then(res => res.json())
        .then(data => marvelData = data.data.results);
}

const containerSuperhero = $('.container-superheores');

$(document).ready(() => {
    
    $('.link-nav:first').addClass('active');
    $('section').hide();
    $('section:first').show();

    $('.link-nav').click(function() {
        $('.link-nav').removeClass('active');
        $(this).addClass('active');

        $('section').hide();

        let link = $(this).attr('href')

        if(link === "#home") {
            containerSuperhero.show();
            $('.search-results').empty();
        }
       $(link).show();
        return false;
    })

    getSuperHeroes().then(() => {        
        loadSuperHeroes(marvelData, containerSuperhero);
        searchForHero(marvelData);
    })

});


// Cargar Heroes
function loadSuperHeroes(data, container) {
    container.show();
    data.forEach(hero => {
        container.append(
            $('<div>').addClass('box-hero').append(
                $('<div>').addClass('img-hero').attr('id', hero.id).click(showHeroDetail).append(
                    (hero.thumbnail.path).includes('image_not_available')
                    ? $('<img>').attr({
                        'src' : '../assets/images/image-not-found.png',
                        'alt' : hero.name 
                    }) 
                    : $('<img>').attr({
                        'src' : `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
                        'alt' : hero.name 
                    }),

                    $('<p>').addClass('name-hero').text(hero.name)
                ),

                $('<i>').addClass(
                    (favoriteHeroes.some(fav => fav.id === hero.id))
                    ? 'fas fa-heart'
                    : 'far fa-heart'
                ).click(function() {
                    
                    $(this).toggleClass('fas fa-heart').toggleClass('far fa-heart');
                    const className = $(this).attr('class');
                    if(className === 'far fa-heart') {
                        favoriteHeroes = favoriteHeroes.filter(fav => fav.id !== hero.id)
                    }
                    if(className === 'fas fa-heart') {  
                        (!favoriteHeroes.find(fav => fav.id === hero.id)) 
                            && favoriteHeroes.push(hero)
                    }
                    console.log(favoriteHeroes)
                    cargarFavoriteHeroe(favoriteHeroes)                                 
                })
            )
        )
    }); 
    ScrollReveal().reveal('.box-hero');
}


// Buscar Heroes
function searchForHero(data) {
    $('.btn-search').click(function(e) {
        $('.search-results').empty();
        e.preventDefault();
        const inputValue = $('.input-search').val();
        if(inputValue.length > 0) {
            const findHero = data.filter(hero => hero.name.toLowerCase().includes(inputValue.toLocaleLowerCase()))
            $('.input-search').val("");
            loadSuperHeroes(findHero, $('.search-results'));
        }    
    });
    ScrollReveal().reveal('.search-results');
}


// Muestra detalle de un heroe
function showHeroDetail() {
    $('.link-nav').removeClass('active');
    $('.container-superheores').hide();
    $('#search').hide();
    $('#herodetail').show();
    $('.container-hero-detail').empty();
    const heroId = $(this).attr('id');
    const findHero = marvelData.find(hero => hero.id === Number(heroId));

    $('.container-hero-detail').append(
        $('<h2>').text(findHero.name),

        $('<div>').addClass('img-hero-detail').append(
            (findHero.thumbnail.path).includes('image_not_available')
            ?   $('<img>').attr({
                    'src' : '../assets/images/image-not-found.png',
                    'alt' : findHero.name 
                }) 
            :   $('<img>').attr({
                    'src' : `${findHero.thumbnail.path}.${findHero.thumbnail.extension}`,
                    'alt' : findHero.name 
                }),
        ),

        $('<p>').text(findHero.description)            
    ); 
}


// Cargar lista de heroes favoritos
function cargarFavoriteHeroe(favoriteArray){
    $('.favorite-list ul').empty();
    (favoriteArray.length > 0)
    && (
        favoriteArray.map(hero => {
            $('.favorite-list ul').append(            
                $('<li>').append(
                    (hero.thumbnail.path).includes('image_not_available')
                        ? $('<img>').attr({
                            'src' : '../assets/images/image-not-found.png',
                            'alt' : hero.name 
                        }) 
                        : $('<img>').attr({
                            'src' : `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
                            'alt' : hero.name 
                        }),
                    $('<h3>').text(hero.name),
                    $('<i>').addClass('fas fa-trash').click(function() {
                        favoriteHeroes = favoriteHeroes.filter(fav => fav.id !== hero.id);
                        cargarFavoriteHeroe(favoriteHeroes);

                        const find = $(`.box-hero .img-hero[id=${hero.id}]`).parent();
                        find.find(`i`).attr('class', 'far fa-heart');
                    })
                )
            )
        })
    )
    // : ( $('.favorite-list').append($('<h2>').text('No favorite heroes yet...')))
}