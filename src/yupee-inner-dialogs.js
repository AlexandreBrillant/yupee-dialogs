/*
 * yupee-inner-dialogs.js
 * Copyright 2026 Alexandre Brillant
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


