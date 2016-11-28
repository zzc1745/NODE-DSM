window.onload = function() {

    var btn = document.querySelector( '#card' );

    var divFront = btn.querySelector( '#front' ),
        divBack = btn.querySelector( '#back' ),
        btnFront = btn.querySelector( '#turn-back' ),
        btnBack = btn.querySelector( '#turn-front' );
    
    btnFront.addEventListener( 'click', function( event ) {
        btn.classList.add( 'is-open' );
    } );

    btnBack.addEventListener( 'click', function( event ) {
        btn.classList.remove( 'is-open' );
    } );

};