// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Collapse } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars

import { AddressChooser } from '../../../../components/AddressChooser/AddressChooser';
import { SettingsListButton } from '../../../../components/Buttons';
import { H4Font } from '../../../../components/figma';
import {
  SettingsCollapsePanelHeaderContent,
  SettingsListCollapsePanel,
  SettingsListContainer,
  SettingsListItemWrapper,
  SettingsListWrapper,
} from '../../../../components/figma/BlockStyles';
import { ChangeName } from '../ChangeName/ChangeName';

const SettingsList: React.FC<SettingsProps> = ({
  changeNameSubmitHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  deleteAccountClickHandler,
  initialValues,
}): React.ReactElement => {
  const { t } = useTranslation();
  const [collapseActiveKey, setCollapseActiveKey] = useState<string[]>([]);

  const changeNameHandler = activeKey => setCollapseActiveKey(activeKey);
  const ChangeNameExpandedHeader = () => (
    <H4Font>
      <UserOutlined />
      <SettingsCollapsePanelHeaderContent>
        {t('settings.changeName')}
      </SettingsCollapsePanelHeaderContent>
    </H4Font>
  );

  const ChangeNameHeader = () => (
    <>
      <UserOutlined />
      <SettingsCollapsePanelHeaderContent>
        {t('settings.changeName')}
      </SettingsCollapsePanelHeaderContent>
    </>
  );

  const changeAddressesHandler = activeKey => setCollapseActiveKey(activeKey);
  const ChangeAddressesHeader = () => (
    <>
      <UserOutlined />
      <SettingsCollapsePanelHeaderContent>
        {t('settings.changeAddresses')}
      </SettingsCollapsePanelHeaderContent>
    </>
  );

  const ChangeAddressesExpandedHeader = () => (
    <H4Font>
      <UserOutlined />
      <SettingsCollapsePanelHeaderContent>
        {t('settings.changeAddresses')}
      </SettingsCollapsePanelHeaderContent>
    </H4Font>
  );

  const NamePanelHeader = () =>
    collapseActiveKey.includes('1')
      ? ChangeNameExpandedHeader()
      : ChangeNameHeader();

  const AddressesPanelHeader = () =>
    collapseActiveKey.includes('2')
      ? ChangeAddressesExpandedHeader()
      : ChangeAddressesHeader();

  const forceCollapse = (key: number) => {
    const index = collapseActiveKey.indexOf(`${key}`);
    const newCollapseKey = [...collapseActiveKey];
    if (index > -1) {
      newCollapseKey.splice(index, 1);
    }
    setCollapseActiveKey(newCollapseKey);
  };

  return (
    <SettingsListWrapper>
      <SettingsListContainer>
        <SettingsListItemWrapper>
          <Col span="24" lg={12}>
            <Collapse
              onChange={changeNameHandler}
              bordered={false}
              activeKey={collapseActiveKey}
            >
              <SettingsListCollapsePanel
                showArrow={false}
                header={NamePanelHeader()}
                key={1}
                forceRender
              >
                <ChangeName
                  changeNameHandler={changeNameSubmitHandler}
                  cancelHandler={() => setCollapseActiveKey([])}
                  initialValues={{
                    displayNickname: initialValues.displayNickname,
                    username: initialValues.username,
                  }}
                />
              </SettingsListCollapsePanel>
            </Collapse>
          </Col>
        </SettingsListItemWrapper>
        <SettingsListItemWrapper>
          <Col span="24" lg={12}>
            <SettingsListButton
              type="default"
              onClick={() => deleteAccountClickHandler()}
            >
              <UserDeleteOutlined />
              <span>{t('settings.deleteAccount')}</span>
            </SettingsListButton>
          </Col>
        </SettingsListItemWrapper>
        <SettingsListItemWrapper>
          <Col span="24" lg={12}>
            <Collapse
              onChange={changeAddressesHandler}
              bordered={false}
              activeKey={collapseActiveKey}
            >
              <SettingsListCollapsePanel
                showArrow={false}
                header={AddressesPanelHeader()}
                key={2}
                forceRender
              >
                <AddressChooser
                  actionHandler={() => forceCollapse(2)}
                  actionType="submit"
                  isSettings
                  cancelHandler={() => forceCollapse(2)}
                  cancelType="cancel"
                />
              </SettingsListCollapsePanel>
            </Collapse>
          </Col>
        </SettingsListItemWrapper>
      </SettingsListContainer>
    </SettingsListWrapper>
  );
};

interface SettingsProps {
  changeNameSubmitHandler: Function;
  deleteAccountClickHandler: Function;
  initialValues: {
    displayNickname: string | null;
    username: string | null;
  };
}

export default SettingsList;
