import styled from "styled-components"

const DRAWER_HEIGHT_MOBILE = "100%"
const PADDING_HORIZONTAL = "50px"

export const HeaderWrapper = styled.header`
  position: fixed;
  width: 100%;
  z-index: ${p => p.theme.zIndices.headerPrimary};

  a:hover {
    text-decoration: none;
  }

  p {
    font-size: 16px;
  }

  .actions {
    margin: 0 -20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .languages {
      margin: 6px;
    }

    button {
      margin: 6px;
      padding: 9px 30px;
      font-family: Roboto;
      /* font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: #fff;
      outline: none;
      border: none;
      cursor: pointer;
      box-sizing: border-box; */
      /* border-radius: 6px;
      white-space: nowrap; */
    }
  }
`

export const TopWrapper = styled.div`
  z-index: ${p => p.theme.zIndices.headerPrimary};
  height: ${p => p.theme.measurements.headerHeight}px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 ${PADDING_HORIZONTAL};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(31, 0, 41, 0.3);

  ${p => p.theme.breakpoints.small} {
    padding: 0 15px;
  }

  .logo {
    flex-grow: 1;
    display: flex;
    align-items: center;

    img {
      width: 30px;
    }

    .logo-type {
      margin-left: 8px;
      margin-right: 8px;
      margin-top: 2px;
      width: 108px;

      .text {
        fill: ${p => p.theme.colors.secondaryDark};
      }
      .accent {
        fill: ${p => p.theme.colors.accent};
      }
    }

    ${p => p.theme.breakpoints.small} {
      flex-grow: 0;

      width: 100% img {
        width: 30px;
      }
      .logo-type {
        align-content: center;
      }
    }
  }

  .actions {
    ${p => p.theme.breakpoints.small} {
      display: none;
    }
  }
`

export const DrawerWrapper = styled.div`
  position: relative;
  height: ${p => p.theme.measurements.drawerHeight}px;
  background: ${p => p.theme.colors.accent};
  box-shadow: 0px 4px 10px rgba(31, 0, 41, 0.15);
  z-index: ${p => p.theme.zIndices.headerSecondary};
  padding-bottom: 15px;

  nav {
    display: flex;
    justify-content: center;
    height: 100%;

    ul {
      width: 500px;
      min-width: 200px;
      display: flex;
      justify-content: space-evenly;
      list-style-type: none;

      ${p => p.theme.breakpoints.small} {
        padding: 1.5em;
      }
    }

    li {
      padding-top: 2.5%;
      height: ${DRAWER_HEIGHT_MOBILE};
      position: relative;
      font-weight: bold;
      margin: 0px 35px;

      ${p => p.theme.breakpoints.small} {
        padding-top: 0%;
      }

      a {
        color: white;
        text-decoration: none;
        font-size: 15px;
        text-decoration: none;
        font-weight: bold;

        p {
          word-spacing: 1.5px;
          opacity: 0.6;
          transition: opacity 0.25s ease;

          :hover {
            opacity: 1;
          }
        }

        ${p => p.theme.breakpoints.small} {
          color: ${props => props.theme.colors.accent};
          font-size: 1.1rem;

          p {
            opacity: 0.5;
          }
          :hover {
            color: ${props => props.theme.colors.accent};
          }
        }
      }

      .active {
        color: white;

        p {
          opacity: 1;
        }

        ${p => p.theme.breakpoints.small} {
          color: ${props => props.theme.colors.accent};
        }
      }
    }
  }

  /* TODO: note to self - clean this up at some point PLEASE */
  ${p => p.theme.breakpoints.small} {
    width: 100%;
    height: 350px;
    /* max-height: 300px; */
    background: rgb(248, 248, 248);
    box-shadow: 1px 0 10px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
    position: absolute;

    transform: ${props => (props.show ? "translateY(-150%)" : "translateY(0)")};
    visibility: ${props => (props.show ? "hidden" : "visible")};
    transition: visibility 0.3s, transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);

    ul {
      padding: 0;
      display: flex;
      flex-direction: column;
    }
  }
`

export const ActionsLi = styled.li`
  display: none;

  ${p => p.theme.breakpoints.small} {
    display: list-item;
  }

  button {
    margin: 6px;
    padding: 9px 30px;
    font-family: Roboto;
  }

  align-self: center;
  visibility: ${props => (props.show ? "hidden" : "visible")};
  transition: visibility 0.3s;
`
