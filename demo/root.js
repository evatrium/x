import {x, h} from "../src";


export const Root = x('x-root', ({Host, CSS}) =>
    <Host>
        <CSS globalFallback>{
            // cssVars +
            /*language=CSS format=true*/
            jcss`
                :root {
                    /* primaries */
                    --primary1: #485be4;
                    --primary2: #4cd0e1;
                    --primary3: #673AB7;

                    /* advisories */
                    --error: #ff3058;
                    --warning: #ffb231;
                    --success: #13caab;

                    /* surface backgrounds */
                    --bg1: #fff;
                    --bg2: #fff;

                    /* shades */
                    --shade1: #fbfdfe;
                    --shade2: #fafcfd;
                    --shade3: #f8fafb;
                    --shade4: #f2f6fa;
                    --shade5: #e9f1f7;
                    --shade6: #e0ebf3;
                    --shade7: #dae6f1;
                    --shade8: #d3e2ee;
                    --shade9: #cedfec;
                    --shade10: #c8dae9;

                    /* z-index */
                    --zIndexToast: 9000;
                    --zIndexDropdown: 8000;
                    --zIndexModal: 7000;
                    --zIndexNav: 6000;
                    --zIndexDrawer: 5000;
                    --zIndexOverlay: 4000;

                    /* box-shadow */
                    --shadow1: 0px 4px 19px 1px rgba(150, 160, 229, 0.18);
                    --shadow2: 0px 6px 19px 2px rgba(150, 160, 229, 0.28);
                    --shadow3: 1px 7px 12px 1px rgba(142, 151, 219, 0.54);

                    /* positioning */
                    --spacing: 20px;

                    /* components */
                    --navHeight: 56px;
                    --containerWidth: 1280px;
                    --gridGutter: 10px;
                    --drawerWidth: 320px;
                    --dropDownListMaxHeight: 25vh;
                    --dropDownListWidth: 100%;
                    --lazyImgBlurDuration: 600ms;
                    --avatarSize: 50px;
                    --fallbackAvatarIconColor: white;
                    --textFieldBackground: transparent;
                    --overlayRgba: rgba(250, 252, 255, 0.65);
                    --toastWidth: 365px;

                    /* ink */
                    --inkOpacity: 0.3;
                    --inkColor: #c8dae9;

                    /* typography */
                    --fontFamily: 'Montserrat', "Helvetica Neue", -apple-system, "Segoe UI", "Roboto", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                    --fontSize: 17px;
                    --fontWeight: 500;
                    --fontColor: #070737;
                    --fontLighter: rgba(7, 7, 55, 0.53);
                    --lineHeight: 120%;
                    --textFieldLineHeight: 22px;
                    --paragraphLineHeight: 1.5;
                    --letterSpacing: 0.3px;
                    --contrast: white;
                    --fontWeightBold: 700;

                    /* misc */
                    --iconColor: #070737;
                    --borderRadius: 10px;
                    --duration1: 300ms;
                    --transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1);


                }

                html {
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                    overflow-x: hidden;
                }

                html, body {
                    height: 100%;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    flex: 1 0 auto;
                    background: var(--bg1);
                    font-family: var(--fontFamily);
                    letter-spacing: var(--letterSpacing);
                    color: var(--fontColor);
                    font-size: var(--fontSize)
                }

                *, *::before,
                *::after {
                    box-sizing: border-box;
                }

                x-root {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    min-height: 100%;
                    -webkit-overflow-scrolling: touch;
                    flex: 1 0 auto;
                }

                ::-webkit-scrollbar {
                    width: 12px;
                    background-color: var(--shade2);
                }

                ::-webkit-scrollbar-thumb {
                    border-radius: 20px;
                    background-color: var(--shade4);
                }

                * {
                    flex-shrink: 1;
                }

                .w100 {
                    width: 100%;
                }
            `
        }</CSS>
    </Host>
);


/*

                .fadeIn {
                    will-change: opacity;
                    animation: fadein 500ms ease-in-out;
                }

                @keyframes fadein {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }


   ::-webkit-scrollbar{
      width: 12px;
      background-color: ${theme.shade_1};
    }
    ::-webkit-scrollbar-thumb{
      border-radius: 20px;
      background-color: ${theme.shade_5};
    }


        ::-webkit-scrollbar{
                  width: 12px;
                  background-color: ${theme.shade1};
                }
                ::-webkit-scrollbar-thumb{
                  border-radius: 20px;
                  background-color: ${theme.shade5};
                }


                         background: ${theme.bg1};

                              font-family: ${theme.fontFamily};
*/

