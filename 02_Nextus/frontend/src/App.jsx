import Home from './Home.jsx'

import {Registration, Login, 
        EntrepreneurDashboard, InvestorDashboard, 
        Profile,Listofusers,
        MyDocs,UploadDoc,Documents,Download,AddSignature,
        MeetingsPage, UserList,Messages,Chat,
        PaymentPage,PaymentForm,
        NotFound
       } from './pages/index.js'

import {createBrowserRouter,} from 'react-router'
import ProtectedRoute from './components/ProtectedRoute.jsx';



const routers = createBrowserRouter([
 {
    path: "/",
    element: <Home />,
    children: [
      // { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
    
       { path: "*", element: <NotFound /> },
   
     

      // signup and login
      { path: "/registration", element: <Registration /> },
      { path: "/login", element: <Login /> },

      // dashboard
      { path: "/dashboard/investor", element: <EntrepreneurDashboard /> },
      { path: "/dashboard/entrepreneur", element: <InvestorDashboard /> },
      
      //profile
      { path: "/profile", element: <Profile /> },
       { path: "/finduser", element: <Listofusers /> },


      // doc routes
      { path: "/documents", 
        element: <ProtectedRoute><Documents /></ProtectedRoute>,
        children: [
        { path: "/documents/list", element: <ProtectedRoute><MyDocs /></ProtectedRoute> },
        { path: "/documents/upload", element: <ProtectedRoute><UploadDoc /></ProtectedRoute> },
        { path: "/documents/download", element: <ProtectedRoute><Download /></ProtectedRoute> },
        { path: "/documents/signature", element: <ProtectedRoute><AddSignature /></ProtectedRoute> },
        ] 
      },

      //meeting
       { path: "/messages", element: <ProtectedRoute><Messages /></ProtectedRoute>,
        children:[
        { path: "/messages/meetingArangment", element: <ProtectedRoute><MeetingsPage /></ProtectedRoute> },
        { path: "/messages/videocall", element: <ProtectedRoute><UserList /></ProtectedRoute> },
        { path: "/messages/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
        ]
       },

       { path: "/transactions", element: <PaymentPage /> },
       { path: "/realtransactions", element: <PaymentForm /> },
    


    ],
  },
]);

export default routers;
