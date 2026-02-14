/*
* It uses here inner dialogs for the Yupee framework
* Just add this library after the yupee library for usage
*
* @author Alexandre Brillant (https://github.com/AlexandreBrillant/)
* @version 1.0
*/
( ( $$ ) => {

    $$.dialogs = {
        alert: async ( msg ) => new Promise( (resolve, reject) => window.alert( msg ) && resolve( true ) ),
        confirm: async ( msg ) => new Promise( ( resolve,reject ) => resolve( window.confirm( msg ) ) ),
        prompt: async ( msg ) => new Promise( ( resolve, reject ) => resolve( window.prompt( msg ) ) )
    };

} )( $$ );
