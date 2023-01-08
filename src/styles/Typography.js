import { createGlobalStyle } from 'styled-components'
// import "typeface-heebo"
import '@fontsource/rubik'

const Typography = createGlobalStyle`
    h1,
    .title__main {
    font-size: 1rem;
    font-weight: 500;
    color: var(--dark);
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    letter-spacing: -2px;
    line-height: 1.1em;

    // &:after {
    //     content: '.';
    //     display: inline-block;
    //     color: var(--highlight);
    // }
    }

    h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--grey);
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.25em;
    letter-spacing: -0.5px;
    }

    p {
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
    }
`

export default Typography
