import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TitleWithUnderline from 'src/components/TitleWithUnderline/TitleWithUnderline';
import { IUserAddress } from 'src/models/users/privilegedInformation';
import {
  AddressDisplay,
  ButtonsContainer,
  ButtonsDisplay,
  DisplayButton,
  MapDisplay,
} from 'src/modules/create/components/DisplayElements';
import { COLORS } from 'src/theme/colors';
import styled from 'styled-components';

const PostLocationStep: React.FC<PostLocationStepProps> = ({
  addresses,
  postLocation,
  setPostLocation,
  setShowNewAddressModal,
  nextHandler,
  prevHandler,
  postTypePrefix,
}) => {
  const { t } = useTranslation();

  const handleAddressChange = value => {
    if (value === 'add') {
      setShowNewAddressModal(true);
    } else {
      setShowNewAddressModal(false);
      addresses && setPostLocation(addresses[value]);
    }
  };

  return (
    <PostLocationWrapper>
      <MapDisplay coords={postLocation.coords} />
      <TitleWithUnderline level={2} color={COLORS.primaryDark}>
        {postTypePrefix} {t('modules.create.stepTitles.map')}
      </TitleWithUnderline>
      <LocationFormDiv>
        <b>Choose an Address:</b>
        <ChooserDiv>
          <Select
            style={{ width: 360 }}
            onChange={handleAddressChange}
            defaultValue={postLocation.name}
          >
            {Object.keys(addresses || {}).map(addresskey => (
              <Select.Option key={addresskey} value={addresskey}>
                {addresskey}
              </Select.Option>
            ))}
            <Select.Option value="add">Add a new one</Select.Option>
          </Select>
        </ChooserDiv>
        <AddressDisplay location={postLocation} />
      </LocationFormDiv>
      <ButtonsContainer>
        <ButtonsDisplay>
          <DisplayButton
            type="default"
            block
            onClick={prevHandler}
            icon={<ArrowLeftOutlined />}
          >
            {t('back')}
          </DisplayButton>

          <DisplayButton
            type="primary"
            block
            icon={<ArrowRightOutlined />}
            onClick={nextHandler}
          >
            {t('next')}
          </DisplayButton>
        </ButtonsDisplay>
      </ButtonsContainer>
    </PostLocationWrapper>
  );
};

const LocationFormDiv = styled.div`
  margin: 10px auto;
  width: 80%;
`;
const PostLocationWrapper = styled.div`
  height: 100%;
`;

const ChooserDiv = styled.div`
  margin-bottom: 20px;
`;

interface PostLocationStepProps {
  addresses: Record<string, IUserAddress> | undefined;
  postLocation: any;
  setShowNewAddressModal: (any) => void;
  setPostLocation: (any) => void;
  nextHandler: (any) => void;
  prevHandler: () => void;
  postTypePrefix: string;
}

export default PostLocationStep;
