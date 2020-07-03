import { UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Collapse, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsButton } from '../../../../components/Buttons';
import { H4Font } from '../../../../components/figma';
import {
  ChangeNameHeaderContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  CollapsePanelWrapper,
  SettingsWrapper,
} from '../../../../components/figma/BlockStyles';
import { ChangeName } from '../ChangeName/ChangeName';

const { Panel } = Collapse;

const Settings: React.FC<SettingsProps> = ({
  changeNameSubmitHandler,
  deleteAccountClickHandler,
  initialValues,
}): React.ReactElement => {
  const { t } = useTranslation();
  const [collapseActiveKey, setCollapseActiveKey] = useState<string[]>([]);

  const changeNameHandler = activeKey => setCollapseActiveKey(activeKey);
  const ChangeNameExpandedHeader = () => (
    <H4Font>
      <UserOutlined />
      <ChangeNameHeaderContent>
        {t('settings.changeName')}
      </ChangeNameHeaderContent>
    </H4Font>
  );

  const ChangeNameHeader = () => (
    <>
      <UserOutlined />
      <ChangeNameHeaderContent>
        {t('settings.changeName')}
      </ChangeNameHeaderContent>
    </>
  );
  const PanelHeader = () =>
    collapseActiveKey.length > 0
      ? ChangeNameExpandedHeader()
      : ChangeNameHeader();

  return (
    <SettingsWrapper>
      <Row gutter={[0, 12]}>
        <Col span="24" md={12}>
          <Collapse
            onChange={changeNameHandler}
            bordered={false}
            activeKey={collapseActiveKey}
          >
            <Panel showArrow={false} header={PanelHeader()} key={1} forceRender>
              <ChangeName
                changeNameHandler={changeNameSubmitHandler}
                cancelHandler={() => setCollapseActiveKey([])}
                initialValues={initialValues}
              />
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <Row gutter={[0, 12]}>
        <Col span="24" md={12}>
          <SettingsButton
            type="default"
            onClick={() => deleteAccountClickHandler()}
          >
            <UserDeleteOutlined />
            <span>{t('settings.deleteAccount')}</span>
          </SettingsButton>
        </Col>
      </Row>
    </SettingsWrapper>
  );
};

interface SettingsProps {
  changeNameSubmitHandler: Function;
  deleteAccountClickHandler: Function;
  initialValues: {
    displayName: string | null;
    username: string | null;
  };
}

export default Settings;
