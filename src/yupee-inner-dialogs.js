/*
 * yupee-inner-dialogs.js
 * Copyright 2026 Alexandre Brillant
 * https://github.com/AlexandreBrillant
 * https://www.alexandrebrillant.com
 */

/* 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
* It uses here inner dialogs for the Yupee framework
* Just add this library after the yupee library for usage
*
* @author Alexandre Brillant (https://github.com/AlexandreBrillant/)
* @version 1.0
*/
( ( $$ ) => {

    const OK = "OK";
    const CANCEL = "Cancel";

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

        async show( dialogContent, actions = [ OK ] ) {
            let config = {};
            let defaultFocus;
            if ( !Array.isArray( actions ) ) {
                config = actions;
                if ( actions.actions && Array.isArray( actions.actions ) ) {
                    actions = actions.actions;
                }
                defaultFocus = config.focus;
            }

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
                            minWidth : ( config.width || 200 ) + "px",
                            minHeight : ( config.height ? `${config.height}px` : "auto"),
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            zIndex: "1001",
                            ...config
                        } 
                    );

                    let panel;

                    if ( dialogContent instanceof Node ) {
                        panel = dialogContent;
                    } else {
                        panel = document.createElement( "DIV" );
                        panel.innerHTML = dialogContent;
                    }

                    this.#applyCSS( panel,
                        {
                            padding:"10px",
                            paddingLeft:"20px",
                            paddingRight:"20px"
                        } );

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
                    if ( defaultFocus ) {
                        if ( typeof defaultFocus == "string" ) {
                            const node = container.querySelector( defaultFocus );
                            node && node.focus();
                        }
                    } else
                        this.defaultFocus( container, resolver );
            } );
            return p;
        }

    }

    class DialogAlert extends Dialog {
    }
    class DialogConfirm extends Dialog {
        getReturnValue( container, btn ) {
            return btn.textContent == OK;
        }
        async show( dialogContent ) {
            return super.show( dialogContent, [ OK, CANCEL ] );
        }
    }

    class DialogPrompt extends Dialog {

        #listMode = false;

        defaultFocus( container, resolver ) {
            let input = null;
            if ( this.#listMode )
                input = container.querySelector( "SELECT" );
            else
                input = container.querySelector( "INPUT" );
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
                if ( this.#listMode ) {
                    const select = container.querySelector( "SELECT" );
                    const { selectedIndex } = select;
                    if ( selectedIndex < 0 )
                        return null;
                    return select.options[ selectedIndex ].value;
                }
                return container.querySelector( "INPUT" ).value;
            } else
                return null;
        }
        async show( dialogContent, defaultValue ) {
            this.#listMode = defaultValue && Array.isArray( defaultValue );
            dialogContent += "<div>";

            if ( this.#listMode ) {
                dialogContent += "<select>";
                dialogContent += defaultValue.map( ( item ) => "<option value='" + item + "'>" + item + "</option>" ).join("");
                dialogContent += "</select>";
            } else
                dialogContent += "<input type='text' width='100%' style='margin:10px;display:block'>";

            dialogContent += "</div>";

            const promess = super.show( dialogContent, [ OK, CANCEL ] );
            if ( defaultValue && !this.#listMode ) {
                this.select( "INPUT" ).value = defaultValue;
            }
            return promess;
        }        
    }

    class DialogPanel extends Dialog {
        async show( dialogContent, config ) {
            const promess = super.show( dialogContent, config || [ OK, CANCEL ] );
            return promess;
        }
    }

    $$.dialogs = $$.dialogs || {};
    $$.dialogs.alert = async ( msg ) => (new DialogAlert()).show( msg );
    $$.dialogs.confirm = async ( msg ) => (new DialogConfirm()).show( msg );
    $$.dialogs.prompt = async ( msg, defaultValue ) => (new DialogPrompt()).show( msg, defaultValue );
    $$.dialogs.panel = async ( container, config ) => new DialogPanel().show( container, config );

} )( typeof $$ == "undefined" ? window : $$ );


