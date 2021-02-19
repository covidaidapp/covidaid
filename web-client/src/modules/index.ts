import { Module } from 'src/types/module';

import Create from './create';
import LandingPage from './landing-page';
import Login from './login';
import Posts from './myRequests';
import PersonalData from './personalData';
import Phone from './phone';
import Settings from './settings';

const modules: Record<string, Module> = {
  Create,
  LandingPage,
  Login,
  Phone,
  PersonalData,
  Posts, // TODO: (es) More refactoring
  Settings,
};

export default modules;
