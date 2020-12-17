import {
  CaretDownOutlined,
  CaretUpOutlined,
  BellFilled as NotificationsIcon,
  MenuOutlined as SideMenuIcon,
} from '@ant-design/icons';
import { Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Logo from 'src/assets/logo.svg';
import {
  CreateOfferLocationUrl,
  CreateRequestLocationUrl,
} from 'src/modules/create/constants';
import {
  AboutPageLocation,
  HomePageLocation,
} from 'src/modules/landing-page/constants';
import { LoginLocation } from 'src/modules/login/constants';
import { MyOfferPostsLocationUrl } from 'src/modules/MyPosts/constants';
import { AppState } from 'src/store';
import { COLORS } from 'src/theme/colors';
import styled from 'styled-components';

import { LanguageSelector } from '../SideBottomMenu/LanguageSelector';

const { Text } = Typography;

const TopNavbar: React.FC<TopNavbarProps> = ({
  openMenu,
  // openNotifications,
  // unseenOffersCount,
  visible = true,
}) => {
  const [createNewShowing, setCreateNewShowing] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const onboarded = useSelector((state: AppState) => state.auth.onboarded);
  const isLoggedIn = useSelector((state: AppState) => !!state.auth.user?.email);

  const CreateNew = createNewShowing
    ? styled.div`
        @media (max-width: 1050px) {
          display: none;
        }
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        left: 12.2%;
        top: 29px;
        width: 150px;

        background: white;

        div {
          display: flex;

          svg {
            position: relative;
            left: 10%;
            top: 19%;
          }

          h4 {
            font-weight: 500;
            font-size: 16px;
            transition: 0.3s ease all;
            &:hover {
              color: ${COLORS.primaryOrange};
            }
          }
        }
      `
    : styled.div`
        // TODO: Test if this media query is redundant; remove if true;
        @media (max-width: 1050px) {
          display: none;
        }
        display: ${!isLoggedIn ? 'none' : 'flex'};
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        left: 12.2%;
        top: 3px;
        width: 150px;
        height: 30px;
        overflow: hidden;

        background: white;

        div {
          display: flex;

          svg {
            position: relative;
            left: 10%;
            top: 19%;
          }

          h4 {
            font-weight: 500;
            font-size: 16px;
            transition: 0.3s ease all;
            &:hover {
              color: ${COLORS.primaryOrange};
            }
          }
        }
      `;

  return visible ? (
    <HeaderContainer>
      {window.location.pathname === '/list/find' && <GhostMargin />}
      <BetaFlairTop>
        We&apos;re in beta testing mode -
        <BetaLink href={HomePageLocation.path}>give us feedback</BetaLink>
      </BetaFlairTop>
      <TopNavbarWrapper>
        <NavButtonMenu aria-label="Menu Button" onClick={openMenu}>
          <SideMenuIcon />
        </NavButtonMenu>
        <NavButton>
          <IconImg src={Logo} />
          <IconText>
            Reach<TextOrange>4</TextOrange>Help
          </IconText>
        </NavButton>

        {/* <NavButton aria-label="Notifications Button" onClick={openNotifications}>
        {unseenOffersCount > 0 ? (
          <NotificationsIcon style={{ color: 'red' }} />
        ) : (
          <NotificationsIcon />
        )}
      </NavButton> */}
        <LinkContainer>
          <LeftLink href={HomePageLocation.path}>Home</LeftLink>
          <LeftLink href={MyOfferPostsLocationUrl}>Help Requests</LeftLink>
          <LeftLink href={MyOfferPostsLocationUrl}>Volunteer Offers</LeftLink>

          {/* TODO: Conditionally render CreateNew when isLoggedIn==true || status: DONE */}
          <CreateNew onClick={() => setCreateNewShowing(!createNewShowing)}>
            <div>
              <h4>Create New</h4>
              {createNewShowing ? <CaretUpOutlined /> : <CaretDownOutlined />}
            </div>
            <Link href={CreateRequestLocationUrl}>Help Request</Link>
            {/* <br /> */}
            <Link href={CreateOfferLocationUrl}>Volunteer Offer</Link>
          </CreateNew>
          {isLoggedIn ? (
            <Link href={AboutPageLocation.path}>About Us</Link>
          ) : (
            <LeftLink href={AboutPageLocation.path}>About Us</LeftLink>
          )}
          <LanguageSelector />

          {isLoggedIn ? (
            <NotificationsIcon />
          ) : (
            <>
              <LoginButton>
                <BtnLink href={LoginLocation.path}>Login</BtnLink>
              </LoginButton>

              {/* TODO: Change hardcoded hrefs to constants || status: DONE */}

              <SignUpButton>
                <BtnLink href={LoginLocation.path}>Sign Up</BtnLink>
              </SignUpButton>
            </>
          )}
        </LinkContainer>
      </TopNavbarWrapper>
      <BetaFlairBottom>
        We&apos;re in beta testing mode -
        <BetaLink href={HomePageLocation.path}>give us feedback</BetaLink>
      </BetaFlairBottom>
    </HeaderContainer>
  ) : null;
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 80vw;

  @media (max-width: 1050px) {
    justify-content: flex-end;
  }

  & > * {
    margin: 0 20px;
  }

  @media (max-width: 1050px) {
    & > * {
      display: none;
    }
    & > button:last-child {
      display: block;
      position: relative;
    }
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  left: 8.2%;
  &:hover {
    color: ${COLORS.primaryOrange};
  }
`;

const LeftLink = styled(Link)`
  left: 12.2%;
`;

const BetaLink = styled.a`
  color: #1890ff;
  text-decoration: none;
  margin-left: 4px;
`;

const AuthButton = styled.button`
  width: 85px;
  height: 35px;
  border-radius: 4px;
`;

const LoginButton = styled(AuthButton)`
  background: none;
  color: black;
  border: none;
  position: relative;
  left: 3%;
  &:hover {
    border: 1px solid ${COLORS.primaryOrange};
  }
`;

const SignUpButton = styled(AuthButton)`
  background: ${COLORS.primaryOrange};
  border: none;
  color: white;
  &:hover {
    transform: scale(1.05);
  }
`;

const BtnLink = styled.a`
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
`;

const NavButton = styled('button')`
  font-size: 1.3rem;
  background: transparent;
  border: none;
  outline: none;
  color: ${COLORS.primaryOrange};
  padding: 0 1rem;
  &:hover,
  &:focus,
  &:active,
  &:focus-within {
    color: ${COLORS.link} !important;
    font-weight: 700;
  }
`;

const NavButtonMenu = styled(NavButton)`
  @media (min-width: 1050px) {
    display: none;
  }
`;

const TopNavbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  padding: 32px 0;
  background: white;
  z-index: 1;

  @media (min-width: 1050px) {
    top: 30px;
    width: 100%;
  }
`;

const BetaFlairTop = styled.div`
  @media (max-width: 1050px) {
    display: none;
  }

  z-index: 5;
  height: 30px;
  width: 100%;
  background: #e3f2ff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  font-size: 18px;
  font-weight: 400;
  position: fixed;
  top: 0;
`;

// WARNING: THIS IS A TEMPORARY FIX (DOES NOT BREAK)
// Suggestion: use sticky
const GhostMargin = styled.div`
  position: relative;
  width: 100%;
  width: 100px;
  margin-bottom: 40px;
`;

const BetaFlairBottom = styled.div`
  @media (min-width: 1050px) {
    display: none;
  }

  height: 30px;
  width: 100%;
  background: #e3f2ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  z-index: 5;
  position: relative;
  top: 64px;
  margin-bottom: -10px;
`;

const IconImg = styled.img`
  width: 32px;
  height: 32px;

  @media (max-width: 1050px) {
    display: none;
  }
`;

const IconText = styled(Text)`
  font-size: 1.2rem;
  color: ${COLORS.primaryDark};
  padding: 5px;

  @media (max-width: 1050px) {
    position: relative;
    right: 20%;
  }
`;

const TextOrange = styled(Text)`
  color: #ff7b02;
`;

interface TopNavbarProps {
  openMenu: () => void;
  openNotifications: () => void;
  visible?: boolean;
  unseenOffersCount: number;
}

export default TopNavbar;
