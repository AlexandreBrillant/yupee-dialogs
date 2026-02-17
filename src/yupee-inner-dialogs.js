/*
 * yupee-inner-dialogs.js
 * Copyright 2026 Alexandre Brillant
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/*
* It uses here inner dialogs for the Yupee framework
* Just add this library after the yupee library for usage
*
* @author Alexandre Brillant (https://github.com/AlexandreBrillant/)
* @version 1.0
*/
( ( $$ ) => {

    console.log( typeof $$ );

    class Dialog {
        #background;
        #defaultClass;

        constructor( defaultClass = "yupee_dialog" ) {
            !this.#background && ( this.#background = document.createElement( "DIV" ) );
            this.#defaultClass = defaultClass;
            this.#applyCSS( this.#background, {
                position: "fixed",
                top:0,
                left:0,
                width:"100%",
                height:"100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "none",
                zIndex: 1000,
                display: "none",
            } );
        }

        #getBackground() {
            while ( this.#background.childElementCount ) {
                this.#background.remove( 0 );
            }
            return this.#background;
        }

        select( cssSelector ) {
            return this.#background.querySelector( cssSelector );
        }

        #applyCSS( container, css ) {
            for ( let key in css ) {
                container.style[ key ] = css[ key ];
            }            
        }
        
        setVisible( visible ) {
            this.#background.style.display = visible ? "block" : "none";
            if ( visible )
                document.body.appendChild( this.#background );
            else
                document.body.removeChild( this.#background );
        }

        getReturnValue( container, btn ) {
            return btn.textContent
        }

        defaultFocus( container ) {
            container.querySelector( "BUTTON" ).focus();
        }

        defaultResolver( container, btn, resolver ) {
            resolver( this.getReturnValue( container, btn ) );
        }

        async show( htmlContent, actions = ["OK"] ) {
            const p = new Promise(
                (resolver) => {
                    const container = document.createElement( "DIV" );
                    container.classList.add( this.#defaultClass );
                    container.style.display = "flex";
                    container.style.flexDirection = "column";            
                    this.#applyCSS( container, {
                            position: "fixed",
                            top: "20%",
                            left: "50%",
                            minWidth : "200px",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            zIndex: "1001"
                        } 
                    );

                    const panel = document.createElement( "DIV" );
                    this.#applyCSS( panel,
                        {
                            padding:"10px",
                            paddingLeft:"20px",
                            paddingRight:"20px"
                        } );

                    panel.innerHTML = htmlContent;

                    container.appendChild( panel );

                    const buttons = document.createElement( "DIV" );
                    for ( const action of actions ) {
                        const btn = document.createElement( "BUTTON" );
                        btn.textContent = action;
                        const that = this;
                        btn.addEventListener( "click", () => {
                            that.defaultResolver(container,btn,resolver);
                            this.setVisible( false );
                        } );
                        buttons.appendChild( btn );
                    }
                    this.#applyCSS( buttons,
                        {
                            marginTop:"auto",
                            display:"flex",
                            justifyContent: "flex-end",
                            padding:"10px",
                            gap:"10px"
                        } );

                    container.appendChild( buttons );

                    this.#getBackground().appendChild( container );
                    this.setVisible( true );
                    this.defaultFocus( container, resolver );
            } );
            return p;
        }

    }

    class DialogAlert extends Dialog {
    }
    class DialogConfirm extends Dialog {
        getReturnValue( container, btn ) {
            return btn.textContent == "OK";
        }
        async show( htmlContent ) {
            return super.show( htmlContent, ["OK", "Cancel"] );
        }
    }

    class DialogPrompt extends Dialog {
        defaultFocus( container, resolver ) {
            const input = container.querySelector( "INPUT" );
            input.focus();
            const that = this;
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' ) {
                    resolver( input.value );
                    that.setVisible( false );
            } } );
        }
     
        getReturnValue( container, btn ) {
            if ( btn.textContent == "OK" ) {
                return container.querySelector( "INPUT" ).value;
            } else
                return null;
        }
        async show( htmlContent, defaultValue ) {
            htmlContent += "<div><input type='text' width='100%' style='margin:10px;display:block'></div>";
            const promess = super.show( htmlContent, ["OK", "Cancel"] );
            if ( defaultValue ) {
                this.select( "INPUT" ).value = defaultValue;
            }
            return promess;
        }        
    }

    $$.dialogs = $$.dialogs || {};
    $$.dialogs.alert = async ( msg ) => (new DialogAlert()).show( msg );
    $$.dialogs.confirm = async ( msg ) => (new DialogConfirm()).show( msg );
    $$.dialogs.prompt = async ( msg, defaultValue ) => (new DialogPrompt()).show( msg, defaultValue );

} )( typeof $$ == "undefined" ? window : $$ );


