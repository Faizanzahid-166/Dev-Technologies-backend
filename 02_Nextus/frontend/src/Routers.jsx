import App from './App.jsx'

import {Home,
        Registration, VerifyOtpPage, Login, 
         UserPannel, User,
         Admin,
         ChatPage,
         Documents, //MyDocs,UploadDoc,Download,AddSignature,
        // Profile,Listofusers,
        // MeetingsPage, UserList,Messages,Chat,
        // PaymentPage,PaymentForm,
        NotFound
       } from './pages/index.js'

import {createBrowserRouter,} from 'react-router'
// import ProtectedRoute from './components/ProtectedRoute.jsx';



const routers = createBrowserRouter([
 {
    path: "/",
    element: <App />,
    children: [
      // { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
    
       { path: "*", element: <NotFound /> },

       //home
         { path: "/", element: <Home /> },
   
     

      // signup and login
      { path: "/signup", element: <Registration /> },
      { path: "/VerifyOtp", element: <VerifyOtpPage /> },
       { path: "/login", element: <Login /> },

      // // dashboard
      { path: "/dashboard/user-pannel", element: <UserPannel />,
         children: [
          // 1-user-account-page
           { index: true, element: <User /> },
           { path: "/dashboard/user-pannel/info",  element: <User /> }, 

           // 2-chat app
            { path: "/dashboard/user-pannel/chat/ChatPage", element: <ChatPage /> },

           // 3- docomentation
              { path: "/dashboard/user-pannel/documents", element: <Documents />,
                children: [
                  // { path: "/documents/upload", element: <UploadDoc /> },
                  // { path: "/documents/list", element: <MyDocs /> },
                  // { path: "/documents/signature", element: <AddSignature /> },
                  // { path: "/documents/download", element: <Download /> },
                  ] 
              },

         ]
        },
    

      { path: "/dashboard/admin-pannel", element: <Admin /> },
      //  { path: "/finduser", element: <Listofusers /> },


      // //meeting
      //  { path: "/messages", element: <ProtectedRoute><Messages /></ProtectedRoute>,
      //   children:[
      //   { path: "/messages/meetingArangment", element: <ProtectedRoute><MeetingsPage /></ProtectedRoute> },
      //   { path: "/messages/videocall", element: <ProtectedRoute><UserList /></ProtectedRoute> },
      //   { path: "/messages/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
      //   ]
      //  },

      //  { path: "/transactions", element: <PaymentPage /> },
      //  { path: "/realtransactions", element: <PaymentForm /> },
    


    ],
  },
]);

export default routers;
