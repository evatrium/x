import {x, h} from "../../src";

export const Page = x('x-page', ({Host, CSS}) => (
        <Host>
            <CSS globalFallback>{// language=CSS format=true
                jcss`
                    x-page {
                        display: flex;
                        flex-direction: column;
                        flex: 1 0 auto;
                        height: 100%;
                        width: 100%;
                        padding-right: var(--spacing, 20px);
                        padding-left: var(--spacing, 20px);
                        margin-right: auto;
                        margin-left: auto;
                        max-width: var(--containerWidth, 1280px);
                        transition: padding 0.3s cubic-bezier(0.05, 0.69, 0.14, 1);
                    }

                    x-page[nav-top] {
                        padding-top: calc(var(--navHeight, 56px) + var(--spacing, 20px));
                    }

                    x-page[pad-b] {
                        padding-bottom: var(--spacing, 20px);
                    }

                    x-page[no-pad-h] {
                        padding-right: 0;
                        padding-left: 0;
                    }

                    x-page * {
                        -webkit-transform: translateZ(0px);
                    }
                `
            }</CSS>

        </Host>
    ),
    {
        propTypes: {
            noPad: {type: Boolean, reflect: true},
            navTop: {type: Boolean, reflect: true},
            padB: {type: Boolean, reflect: true}
        },
    }
);