import {x, h} from "../../src";

export const Nav = x('x-nav', () => (
        <host>
            <css>{// language=CSS format=true
                jcss`
                    :host {
                        display: block;
                        position: fixed;
                        top: 0;
                        width: 100%;
                        left: 0;
                        right: 0;
                        z-index: var(--zIndexNav);
                        flex-shrink: 0;
                        border-bottom: 1px solid aliceblue;
                        height: var(--navHeight);
                        max-height: var(--navHeight);
                        background: var(--bg2);
                        box-shadow: var(--shadow1)
                    }
                `
            }</css>
            <slot/>
        </host>
    ),
    {
        shadow: true,
        noRerender: true
    }
);