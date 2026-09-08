/**
 * @format
 */

// MUST be the very first imports — polyfills window/performance.now and initializes React Native core
import './shim';
import 'react-native/Libraries/Core/InitializeCore';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
