import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleWithUnderline from 'src/components/TitleWithUnderline/TitleWithUnderline';
import {
  ButtonsDisplay,
  DisplayButton,
} from 'src/modules/create/components/DisplayElements';
import { COLORS } from 'src/theme/colors';
import styled from 'styled-components';

const PostDetails: React.FC<PostDetailsProps> = ({
  setPostDetails,
  postDetails,
  postTypes,
  nextHandler,
  prevHandler,
  postTypePrefix,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { Option } = Select;

  const { title, type, body, customType } = postDetails;
  const [showCustomType, setShowCustomType] = useState(type === 'customType');
  const toggleCustomType = (value: string) => {
    setShowCustomType(value === 'customType');
  };

  return (
    <PostDetailsWrapper>
      <TitleWithUnderline level={2} color={COLORS.primaryDark}>
        {postTypePrefix} {t('modules.create.stepTitles.details')}
      </TitleWithUnderline>
      <DetailsForm
        layout="vertical"
        form={form}
        onFinish={values => {
          setPostDetails({ ...values, type: values.customType || values.type });
          nextHandler();
        }}
        initialValues={{ title, type, body, customType }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'space-between',
          }}
        >
          <Form.Item
            label={t('modules.create.postDetails.titleLabel')}
            name="title"
            rules={[
              {
                required: true,
                message: t('newRequest.form.title_error_message'),
              },
            ]}
          >
            <Input
              placeholder={t('modules.create.defaults.postDetails.title')}
            />
          </Form.Item>

          <Form.Item
            label={t('modules.create.postDetails.typeLabel')}
            name="type"
            rules={[
              {
                required: true,
                message: t('newRequest.form.type_error_message'),
              },
            ]}
          >
            <Select onChange={toggleCustomType}>
              {[...postTypes, 'customType'].map(key => (
                <Option value={key} key={key}>
                  {' '}
                  {key === 'customType' ? 'other' : key}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {showCustomType && (
            <Form.Item
              name="customType"
              rules={[
                {
                  required: true,
                  message: t('newRequest.form.type_error_message'),
                },
              ]}
            >
              <Input placeholder={t('newRequest.form.other')} />
            </Form.Item>
          )}

          <FormItem
            name="body"
            label={t('newRequest.form.body')}
            rules={[
              {
                required: true,
                message: t('newRequest.form.body_error_message'),
              },
            ]}
          >
            <Input.TextArea
              placeholder={t('modules.create.defaults.postDetails.body')}
              maxLength={500}
              autoSize={{ minRows: 6, maxRows: 8 }}
            />
          </FormItem>
          <CharacterLimitDiv>500 Character Limit</CharacterLimitDiv>
        </div>
        <ButtonsDisplay>
          <DisplayButton
            type="default"
            block
            onClick={prevHandler}
            icon={<CloseOutlined />}
          >
            {t('cancel')}
          </DisplayButton>

          <DisplayButton
            type="primary"
            block
            icon={<ArrowRightOutlined />}
            htmlType="submit"
          >
            {t('next')}
          </DisplayButton>
        </ButtonsDisplay>
      </DetailsForm>
    </PostDetailsWrapper>
  );
};
const PostDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 16px;
  justify-content: space-between;
  height: 100%;
`;

const DetailsForm = styled(Form)`
  width: 80%;
  margin: 0 auto !important;
  height: 100%;
  .ant-form-item-label {
    line-height: 14px;
  }
  label {
    height: 14px;
    font-size: 12px;
  }
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 0;
`;

const CharacterLimitDiv = styled.div`
  font-size: 12px;
  margin-bottom: 24px;
`;

interface PostDetailsProps {
  nextHandler: () => void;
  setPostDetails: (values: any) => void;
  postTypes: string[];
  postDetails: any;
  prevHandler: () => void;
  postTypePrefix: string;
}

export default PostDetails;
