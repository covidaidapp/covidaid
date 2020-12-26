import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { StepBackButton, StepForwardButton } from 'src/components/Buttons';
import { Offer } from 'src/models/offers';
import { Request } from 'src/models/requests';
import { TimelineViewLocation } from 'src/modules/timeline/constants';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../../theme/colors';
import avgRating from '../assets/pinAverageRating.svg';
import defaultUserPic from '../assets/role_pin.png';

// import warningSign from '../assets/warningExclamation.svg';

// export const getWarningMessage = (request: Request) =>
// {
//   let bottomWarningMessage;
//   if (
//     isPinAndOpenRequest &&
//     !Object.keys(offers).length &&
//     Date.now() - request.createdAt.toDate().getTime() > 1000 * 60 * 60 * 24 * 7
//   ) {
//     bottomWarningMessage = (
//       <WarningMessage
//         style={{
//           background: '#FAFAFA',
//         }}
//       >
//         {t('modules.requests.containers.no_reply')}
//       </WarningMessage>
//     );
//   } else if (
//     isPinAndOpenRequest &&
//     toCloseRequest &&
//     (Object.keys(offers).length >= 5 ||
//       (Object.keys(offers).length < 5 &&
//         Date.now() - request.createdAt.toDate().getTime() >
//           1000 * 60 * 60 * 24 * 7))
//   ) {
//     bottomWarningMessage = (
//       <WarningMessage
//         style={{
//           background: 'rgba(255, 203, 82, 0.1)',
//         }}
//       >
//         <Row>
//           <Col span={2}>
//             <img
//               src={warningSign}
//               alt="Attention"
//               style={{ animation: 'fadeIn 0.75s' }}
//             />
//           </Col>
//           <Col span={22}>
//             <p>{t('modules.requests. ')}</p>
//           </Col>
//         </Row>
//         <Row>
//           <Col span={12} offset={12}>
//             <CloseButton
//               onClick={() => toCloseRequest()}
//               style={{ fontSize: '16px' }}
//             >
//               Close Request
//             </CloseButton>
//           </Col>
//         </Row>
//       </WarningMessage>
//     );
//   }
// )

const RequestPostItem: React.FC<RequestItemProps> = ({
  request,
  // TODO: (es) remove requestId,
  // TODO: (es) remove handleTimeline,
  isCavAndOpenRequest,
  // isPinAndOpenRequest = false, TODO: (es) needed?
  // offers = {}, TODO: (es) needed?
  hideUserPic,
  // toCloseRequest, TODO: (es) needed?
  loading = false,
}): React.ReactElement => {
  const { t } = useTranslation();

  const [displayDetails, toggleDetails] = useState(false);
  const [actionPerformed, setActionPerformed] = useState(0); // 0 - Nothing, 1 - Accept, 2 - Reject
  const history = useHistory();

  const handleTimeline = (requestId: string | undefined) => {
    history.push(TimelineViewLocation.toUrl({ requestId }));
  };

  const handleRequestClick = () => {
    if (isCavAndOpenRequest) {
      toggleDetails(true);
    } else {
      handleTimeline(request.requestId);
    }
  };

  const displayUserFirstname = (username: string | null): string => {
    if (username) {
      const firstname = username.split(' ')[0];
      return firstname;
    }
    return '';
  };
  if (displayDetails) {
    return (
      <Item>
        <div
          onClick={() => toggleDetails(false)}
          style={{ marginBottom: '15px' }}
        >
          <UserPic
            src={request.pinUserSnapshot.displayPicture || defaultUserPic}
            alt="Profile pic"
          />
          <UserDetails style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            <Paragraph style={{ fontSize: '18px' }}>
              {request.pinUserSnapshot.displayName}
            </Paragraph>
            <div style={{ display: 'flex' }}>
              <Icon src={avgRating} />
              <Paragraph>{request.pinUserSnapshot.averageRating}</Paragraph>
            </div>
          </UserDetails>
        </div>
        <hr style={{ margin: '5px' }} />
        <RequestItemDetails>
          <Title style={{ color: 'rgba(0, 0, 0, 1)' }}>{request.title}</Title>
          <Paragraph
            style={{
              color: 'rgba(0, 0, 0, 0.85)',
              marginBottom: '20px',
            }}
          >
            {request.description}
          </Paragraph>
          {/* TODO: (es) What the heck does this do? */}
          <Row justify="space-between" gutter={16}>
            <Col>
              <StepBackButton
                loading={loading && actionPerformed === 2}
                disabled={loading && actionPerformed !== 2}
                onClick={() => {
                  setActionPerformed(2);
                  handleTimeline(request.requestId);
                }}
              >
                {t('modules.requests.cannot_help')}
              </StepBackButton>
            </Col>
            <Col>
              <StepForwardButton
                loading={loading && actionPerformed === 1}
                disabled={loading && actionPerformed !== 1}
                onClick={() => {
                  setActionPerformed(1);
                  handleTimeline(request.requestId);
                }}
              >
                Help {displayUserFirstname(request.pinUserSnapshot.displayName)}
              </StepForwardButton>
            </Col>
          </Row>
        </RequestItemDetails>
      </Item>
    );
  }
  return (
    <>
      <Item style={{ marginBottom: '0px' }}>
        <div
          onClick={handleRequestClick}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <RequestItemDetails
            style={{
              width: '75%',
              whiteSpace: 'nowrap',
            }}
          >
            <Title
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'rgba(0, 0, 0, 0.65)',
              }}
            >
              {request.title}
            </Title>
            <Paragraph
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {request.description}
            </Paragraph>
          </RequestItemDetails>
          {!hideUserPic && (
            <UserPic
              style={{
                float: 'right',
              }}
              src={request.pinUserSnapshot?.displayPicture || defaultUserPic}
              alt={t('modules.requests.a11y_profile_pic')}
            />
          )}
          <Status>{request.status}</Status>
        </div>
      </Item>
      {/* TODO: (es) {bottomWarningMessage} */}
    </>
  );
};

const Item = styled.div`
  overflow: auto;
  margin: 15px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid ${COLORS.strokeCards};
  border-radius: 2px;
`;

const RequestItemDetails = styled.div`
  float: left;
  font-family: Roboto, sans-serif;
  color: rgba(0, 0, 0, 0.65);
  padding: 5px;
`;

const Title = styled.h4`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
`;

const Paragraph = styled.p`
  margin-bottom: 3px;
  font-family: Roboto, sans-serif;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const UserPic = styled.img`
  float: left;
  width: 56px;
  height: 56px;
  margin: 5px;
  border-radius: 105px;
  animation: ${fadeIn} 0.75s;
  object-fit: cover;
`;

// TODO: (es) Use when reimplement warning message
// const CloseButton = styled(Button)`
//   border-radius: 4px;
//   width: 100%;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// `;

const UserDetails = styled.div`
  display: inline-block;
  margin-left: 15px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

// TODO: (es) WarningMessage
// const WarningMessage = styled.div`
//   border: 1px solid ${COLORS.secondaryLight};
//   color: rgba(0, 0, 0, 0.65);
//   font-family: Roboto;
//   font-size: 12px;
//   line-height: 20px;
//   margin-left: 15px;
//   margin-right: 15px;
//   margin-bottom: 15px;
//   padding: 12px;
//   border-radius: 2px;
// `;

const Status = styled.div`
  border: 1px solid ${COLORS.primaryOrange};
  border-radius: 2px;
  box-sizing: border-box;
  min-width: 61px;
  height: 22px;
  color: ${COLORS.primaryOrange};
  text-align: center;
  font-family: Roboto;
  font-weight: bold;
  font-size: 12px;
  line-height: 22px;
`;

export interface RequestItemProps {
  request: Request;
  // TODO: (es) remove requestId: string;
  // TODO: (es) remove handleTimeline: Function;
  isCavAndOpenRequest: boolean;
  hideUserPic?: boolean;
  offers?: Record<string, Offer>;
  loading?: boolean;
  toCloseRequest?: (action?: boolean) => void;
  isPinAndOpenRequest?: boolean;
}

export default RequestPostItem;
