import '../fake-db';
// import { AuthProvider } from "app/contexts/Auth0Context";
// import { AuthProvider } from 'app/contexts/JWTAuthContext';
import {AuthProvider} from 'app/contexts/FirebaseAuthContext';
import {SettingsProvider} from 'app/contexts/SettingsContext';
import {Provider} from 'react-redux';
import {useRoutes} from 'react-router-dom';
import {MatxTheme} from './components';
import {Store} from './redux/Store';
import routes from './routes';
import './index.css';

const App = () => {
   const content = useRoutes(routes);

   return (
       <Provider store={Store}>
          <SettingsProvider>
             <MatxTheme>
                <AuthProvider>{content}</AuthProvider>
             </MatxTheme>
          </SettingsProvider>
       </Provider>
   );
};

export default App;
