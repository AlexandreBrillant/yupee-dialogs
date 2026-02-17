/*
 * yupee-native-dialogs.js
 * Copyright 2026 Alexandre Brillant
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
* Default dialog using the native dialogs for the Yupee framework.
* Just add this library after the yupee library for usage
*
* @author Alexandre Brillant (https://github.com/AlexandreBrillant/)
* @version 1.0
*/
( ( $$ ) => {

    $$.dialogs = $$.dialogs || {};
    $$.dialogs.alert = async ( msg ) => new Promise( (resolve, reject) => window.alert( msg ) && resolve( true ) )
    $$.dialogs.confirm = async ( msg ) => new Promise( ( resolve,reject ) => resolve( window.confirm( msg ) ) ),
    $$.dialogs.prompt = async ( msg, defaultValue ) => new Promise( ( resolve, reject ) => resolve( window.prompt( msg, defaultValue ) ) )

} )( typeof $$ == "undefined" ? window : $$ );
