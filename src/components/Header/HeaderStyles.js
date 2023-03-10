import styled from 'styled-components'

export const HeaderStyles = styled.header`
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 98;
  transition: background-color 0.1s ease, box-shadow 0.1s ease;

  &.nav__scrolled {
    background-color: #fff;
    box-shadow: -1px 5px 11px 0px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 2rem;
    a {
      color: var(--dark);
      text-decoration: none;
      transition: color 0.1s ease;
    }

    &:hover {
      a {
        color: var(--highlight);
      }
    }
  }
`
